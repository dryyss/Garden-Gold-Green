import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID requis' },
        { status: 400 }
      )
    }

    // Chercher la commande par stripeSessionId
    const order = await prisma.order.findFirst({
      where: { stripeSessionId: sessionId },
      include: { items: { include: { product: true } } }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      )
    }

    // Convertir en format OrderRecord
    const orderRecord = {
      id: order.id,
      userId: order.userId,
      status: order.status,
      totalCents: order.totalCents,
      currency: order.currency,
      items: order.items.map(item => ({
        productId: item.productId,
        name: item.name,
        priceCents: item.priceCents,
        quantity: item.quantity,
      })),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt?.toISOString() || order.createdAt.toISOString(),
      customerEmail: order.customerEmail || undefined,
      customerName: order.customerName || undefined,
      stripeSessionId: order.stripeSessionId || undefined,
    }

    return NextResponse.json(orderRecord)

  } catch (error: any) {
    console.error('❌ Erreur récupération commande:', error)
    
    // Gérer spécifiquement les erreurs de connexion à la base de données
    if (error?.code === 'P1001' || error?.code === 'P1000') {
      return NextResponse.json(
        { 
          error: 'Service temporairement indisponible',
          details: 'La connexion à la base de données n\'est pas disponible. Veuillez réessayer plus tard.'
        },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

