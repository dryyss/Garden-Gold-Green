import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth0 } from '@/lib/auth0'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Récupérer la session utilisateur
    const session = await auth0.getSession(request)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer l'ID utilisateur depuis Auth0
    const userId = session.user.sub

    // Récupérer les commandes de l'utilisateur
    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      orders: orders.map(order => ({
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
        shippingAddress: order.shippingAddress
      }))
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession(request)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const userId = session.user.sub
    const body = await request.json()
    const { items, totalCents, shippingAddress, customerEmail, customerName, customerPhone } = body

    // Validation des données
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Aucun article dans la commande' },
        { status: 400 }
      )
    }

    if (!totalCents || totalCents <= 0) {
      return NextResponse.json(
        { error: 'Montant invalide' },
        { status: 400 }
      )
    }

    // Créer la commande
    const order = await prisma.order.create({
      data: {
        userId: userId,
        totalCents: totalCents,
        currency: 'EUR',
        status: 'pending',
        customerEmail: customerEmail || session.user.email || '',
        customerName: customerName || session.user.name || '',
        customerPhone: customerPhone || '',
        shippingAddress: shippingAddress || {},
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            name: item.name,
            priceCents: item.priceCents,
            quantity: item.quantity
          }))
        }
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
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        shippingAddress: order.shippingAddress
      }
    })

  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

