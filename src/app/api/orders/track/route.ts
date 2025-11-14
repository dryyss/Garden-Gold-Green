import { NextRequest, NextResponse } from 'next/server'
import { readOrdersMap } from '@/lib/orders-store'

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

    const orders = await readOrdersMap()
    const normalizedEmail = email.toLowerCase().trim()
    const order = Object.values(orders).find(o =>
      o.id === orderId && (o.customerEmail?.toLowerCase().trim() === normalizedEmail)
    )

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée. Vérifiez votre numéro de commande et votre email.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, order })

  } catch (error) {
    console.error('Erreur lors du suivi de la commande:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

