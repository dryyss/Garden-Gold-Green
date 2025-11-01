import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth0 } from '@/lib/auth0'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Récupérer la session utilisateur
    const session = await auth0.getSession(request)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const userId = session.user.sub
    const { id: orderId } = await params

    // Récupérer la commande spécifique
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId, // S'assurer que l'utilisateur ne peut voir que ses commandes
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
        { error: 'Commande non trouvée' },
        { status: 404 }
      )
    }

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
        customerPhone: order.customerPhone,
        shippingAddress: order.shippingAddress,
        paymentIntentId: order.paymentIntentId,
        stripeSessionId: order.stripeSessionId
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth0.getSession(request)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const userId = session.user.sub
    const { id: orderId } = await params
    const body = await request.json()
    const { status, deliveredAt } = body

    // Vérifier que la commande appartient à l'utilisateur
    const existingOrder = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
      }
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      )
    }

    // Mettre à jour la commande
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        ...(status && { status }),
        ...(deliveredAt && { deliveredAt: new Date(deliveredAt) }),
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

    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder.id,
        status: updatedOrder.status,
        totalCents: updatedOrder.totalCents,
        currency: updatedOrder.currency,
        items: updatedOrder.items.map(item => ({
          id: item.id,
          productId: item.productId,
          name: item.name,
          priceCents: item.priceCents,
          quantity: item.quantity,
          product: item.product
        })),
        createdAt: updatedOrder.createdAt.toISOString(),
        updatedAt: updatedOrder.updatedAt.toISOString(),
        deliveredAt: updatedOrder.deliveredAt?.toISOString(),
        customerEmail: updatedOrder.customerEmail,
        customerName: updatedOrder.customerName,
        customerPhone: updatedOrder.customerPhone,
        shippingAddress: updatedOrder.shippingAddress,
        paymentIntentId: updatedOrder.paymentIntentId,
        stripeSessionId: updatedOrder.stripeSessionId
      }
    })

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
