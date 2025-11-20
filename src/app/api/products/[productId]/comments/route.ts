import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth0 } from '@/lib/auth0'

// Cache les commentaires pendant 60 secondes
export const revalidate = 60

// GET - Récupérer les commentaires d'un produit
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    const comments = await prisma.comment.findMany({
      where: {
        productId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // Compter les votes pour chaque commentaire
    const commentsWithVotes = await Promise.all(
      comments.map(async (comment) => {
        const helpfulCount = await prisma.commentVote.count({
          where: {
            commentId: comment.id,
            isHelpful: true,
          },
        })
        const notHelpfulCount = await prisma.commentVote.count({
          where: {
            commentId: comment.id,
            isHelpful: false,
          },
        })

        return {
      id: comment.id,
      userId: comment.userId,
      userName: comment.user.name || 'Utilisateur',
      productId: comment.productId,
      rating: comment.rating,
      comment: comment.content,
      date: comment.createdAt.toISOString(),
      verified: comment.isVerified,
          helpful: helpfulCount,
          notHelpful: notHelpfulCount,
        }
      })
    )

    return NextResponse.json(commentsWithVotes)
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commentaires' },
      { status: 500 }
    )
  }
}

// POST - Créer un nouveau commentaire
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    const body = await request.json()
    const { rating, comment } = body

    // Vérifier que l'utilisateur est connecté
    const session = await auth0.getSession(request)
    if (!session?.user?.sub) {
      return NextResponse.json(
        { error: 'Vous devez être connecté pour laisser un commentaire' },
        { status: 401 }
      )
    }

    const userId = session.user.sub

    if (!rating || !comment) {
      return NextResponse.json(
        { error: 'Rating et commentaire requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur a acheté ce produit (status: paid, shipped, ou delivered)
    const hasPurchased = await prisma.order.findFirst({
      where: {
        userId: userId,
        status: {
          in: ['paid', 'shipped', 'delivered']
        },
        items: {
          some: {
            productId,
          },
        },
      },
    })

    if (!hasPurchased) {
      return NextResponse.json(
        { error: 'Vous devez avoir acheté ce produit pour laisser un commentaire' },
        { status: 403 }
      )
    }

    const newComment = await prisma.comment.create({
      data: {
        userId: userId,
        productId,
        rating: parseInt(rating),
        content: comment,
        isVerified: true, // Vérifié car l'utilisateur a acheté le produit
        orderId: hasPurchased.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({
      id: newComment.id,
      userId: newComment.userId,
      userName: newComment.user.name || 'Utilisateur',
      productId: newComment.productId,
      rating: newComment.rating,
      comment: newComment.content,
      date: newComment.createdAt.toISOString(),
      verified: newComment.isVerified,
    })
  } catch (error) {
    console.error('Erreur lors de la création du commentaire:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du commentaire' },
      { status: 500 }
    )
  }
}
