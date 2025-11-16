import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    const formattedComments = comments.map(comment => ({
      id: comment.id,
      userId: comment.userId,
      userName: comment.user.name || 'Utilisateur',
      productId: comment.productId,
      rating: comment.rating,
      comment: comment.content,
      date: comment.createdAt.toISOString(),
      verified: comment.isVerified,
    }))

    return NextResponse.json(formattedComments)
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

    // Vérifier que l'utilisateur est connecté (à adapter selon votre système d'auth)
    // const userId = await getCurrentUserId(request)
    const userId = 'temp-user-id' // À remplacer par l'ID utilisateur réel

    if (!rating || !comment) {
      return NextResponse.json(
        { error: 'Rating et commentaire requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur a acheté ce produit
    const hasPurchased = await prisma.order.findFirst({
      where: {
        userId: userId,
        status: 'delivered',
        items: {
          some: {
            productId,
          },
        },
      },
    })

    const newComment = await prisma.comment.create({
      data: {
        userId: userId,
        productId,
        rating: parseInt(rating),
        content: comment,
        isVerified: !!hasPurchased, // Vérifié si l'utilisateur a acheté le produit
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
