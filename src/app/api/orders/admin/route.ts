import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAuthenticatedUser } from '@/lib/auth-utils'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Vérifier si l'utilisateur est admin (à adapter selon votre logique)
    const isAdmin = session.user.email === process.env.ADMIN_EMAIL || 
                   session.user[`${process.env.AUTH0_ISSUER_BASE_URL}/roles`]?.includes('admin')

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Construire les filtres
    const whereClause: any = {}
    if (status) {
      whereClause.status = status
    }

    // Récupérer les commandes avec pagination
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: whereClause,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.order.count({ where: whereClause })
    ])

    return NextResponse.json({
      success: true,
      orders: orders.map(order => ({
        id: order.id,
        status: order.status,
        totalCents: order.totalCents,
        currency: order.currency,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        shippingAddress: order.shippingAddress,
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
        paymentIntentId: order.paymentIntentId,
        stripeSessionId: order.stripeSessionId
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des commandes admin:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Vérifier si l'utilisateur est admin
    const isAdmin = session.user.email === process.env.ADMIN_EMAIL || 
                   session.user[`${process.env.AUTH0_ISSUER_BASE_URL}/roles`]?.includes('admin')

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { orderId, status, deliveredAt, trackingNumber } = body

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'ID de commande et statut requis' },
        { status: 400 }
      )
    }

    // Mettre à jour la commande
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        ...(deliveredAt && { deliveredAt: new Date(deliveredAt) }),
        ...(trackingNumber && { 
          shippingAddress: {
            ...(await prisma.order.findUnique({ where: { id: orderId } }))?.shippingAddress as any,
            trackingNumber
          }
        })
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
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
        customerEmail: updatedOrder.customerEmail,
        customerName: updatedOrder.customerName,
        customerPhone: updatedOrder.customerPhone,
        shippingAddress: updatedOrder.shippingAddress,
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
        paymentIntentId: updatedOrder.paymentIntentId,
        stripeSessionId: updatedOrder.stripeSessionId
      }
    })

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande admin:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

