import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Route publique pour suivre une commande avec ID et email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, email } = body

    if (!orderId || !email) {
      return NextResponse.json(
        { error: 'ID de commande et email requis' },
        { status: 400 }
      )
    }

    // Récupérer la commande avec vérification de l'email
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerEmail: email.toLowerCase().trim(), // Vérifier que l'email correspond
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                images: true,
              }
            }
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée. Vérifiez votre numéro de commande et votre email.' },
        { status: 404 }
      )
    }

    // Retourner les informations de la commande
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        totalCents: order.totalCents,
        currency: order.currency,
        items: order.items.map(item => ({
          id: item.id,
          productId: item.productId,
          name: item.name,
          priceCents: item.priceCents,
          quantity: item.quantity,
          product: item.product
        })),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        deliveredAt: order.deliveredAt?.toISOString(),
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        shippingAddress: order.shippingAddress,
        paymentIntentId: order.paymentIntentId,
        stripeSessionId: order.stripeSessionId
      }
    })

  } catch (error) {
    console.error('Erreur lors du suivi de la commande:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

