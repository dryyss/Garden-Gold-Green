import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth0 } from '@/lib/auth0'

const prisma = new PrismaClient()

// POST - Créer une demande de retour
export async function POST(request: NextRequest) {
  try {
    // Vérifier que l'utilisateur est connecté
    const session = await auth0.getSession(request)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const userId = session.user.sub
    const body = await request.json()
    const { orderId, items, reason, type } = body

    if (!orderId || !items || items.length === 0 || !reason || !type) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Vérifier que la commande appartient à l'utilisateur
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
      },
      include: {
        items: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      )
    }

    // Créer la demande de retour
    const returnRequest = await prisma.returnRequest.create({
      data: {
        orderId: orderId,
        userId: userId,
        items: items,
        reason: reason,
        type: type,
        status: 'pending',
      },
    })

    // Marquer les articles comme "en retour"
    await prisma.orderItem.updateMany({
      where: {
        id: {
          in: items,
        },
      },
      data: {
        status: 'return_requested',
      },
    })

    // Envoyer un email de confirmation (à implémenter)
    // await sendReturnConfirmationEmail(userId, returnRequest.id)

    return NextResponse.json({
      id: returnRequest.id,
      status: 'success',
      message: 'Demande de retour créée avec succès',
    })
  } catch (error) {
    console.error('Erreur lors de la création de la demande de retour:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la demande de retour' },
      { status: 500 }
    )
  }
}

// GET - Récupérer les demandes de retour d'un utilisateur
export async function GET(request: NextRequest) {
  try {
    // Vérifier que l'utilisateur est connecté
    const session = await auth0.getSession(request)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const userId = session.user.sub

    const returnRequests = await prisma.returnRequest.findMany({
      where: {
        userId: userId,
      },
      include: {
        order: {
          include: {
            items: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(returnRequests)
  } catch (error) {
    console.error('Erreur lors de la récupération des retours:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des retours' },
      { status: 500 }
    )
  }
}
