import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth0 } from '@/lib/auth0'

// POST - Voter sur un commentaire (utile ou pas utile)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params
    const body = await request.json()
    const { isHelpful } = body

    // Vérifier que l'utilisateur est connecté
    const session = await auth0.getSession(request)
    if (!session?.user?.sub) {
      return NextResponse.json(
        { error: 'Vous devez être connecté pour voter' },
        { status: 401 }
      )
    }

    const userId = session.user.sub

    if (typeof isHelpful !== 'boolean') {
      return NextResponse.json(
        { error: 'isHelpful doit être un booléen' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur a déjà voté sur ce commentaire
    const existingVote = await prisma.commentVote.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId,
        },
      },
    })

    if (existingVote) {
      // Si l'utilisateur a déjà voté, mettre à jour le vote
      const updatedVote = await prisma.commentVote.update({
        where: {
          id: existingVote.id,
        },
        data: {
          isHelpful,
        },
      })

      return NextResponse.json({
        success: true,
        vote: updatedVote,
        message: 'Vote mis à jour',
      })
    } else {
      // Créer un nouveau vote
      const newVote = await prisma.commentVote.create({
        data: {
          commentId,
          userId,
          isHelpful,
        },
      })

      return NextResponse.json({
        success: true,
        vote: newVote,
        message: 'Vote enregistré',
      })
    }
  } catch (error) {
    console.error('Erreur lors du vote:', error)
    return NextResponse.json(
      { error: 'Erreur lors du vote' },
      { status: 500 }
    )
  }
}

// GET - Récupérer le vote de l'utilisateur sur un commentaire
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params

    // Vérifier que l'utilisateur est connecté
    const session = await auth0.getSession(request)
    if (!session?.user?.sub) {
      return NextResponse.json({ vote: null })
    }

    const userId = session.user.sub

    const vote = await prisma.commentVote.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId,
        },
      },
    })

    return NextResponse.json({ vote })
  } catch (error) {
    console.error('Erreur lors de la récupération du vote:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du vote' },
      { status: 500 }
    )
  }
}

