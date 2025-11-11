import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { listOrdersByUser, upsertOrder } from '@/lib/orders-store'

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

    const userId = session.user.sub
    const orders = await listOrdersByUser(userId)

    return NextResponse.json({
      success: true,
      orders,
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

    const nowId = `MAN-${Date.now()}`
    const order = await upsertOrder({
      id: nowId,
      userId,
      status: 'pending',
      totalCents,
      currency: 'EUR',
      customerEmail: customerEmail || session.user.email || '',
      customerName: customerName || session.user.name || '',
      customerPhone: customerPhone || '',
      shippingAddress: shippingAddress || {},
      items,
    })

    return NextResponse.json({
      success: true,
      order,
    })

  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

