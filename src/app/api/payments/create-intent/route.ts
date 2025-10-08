import { NextRequest, NextResponse } from 'next/server'
import { stripe, formatAmountForStripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { items, customerEmail, customerName } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items requis pour créer le paiement' },
        { status: 400 }
      )
    }

    // Calculer le montant total
    const totalAmount = items.reduce((total: number, item: any) => {
      return total + (item.price * item.quantity)
    }, 0)

    // Créer le payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(totalAmount, 'EUR'),
      currency: 'eur',
      metadata: {
        customerEmail: customerEmail || '',
        customerName: customerName || '',
        items: JSON.stringify(items),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })

  } catch (error) {
    console.error('Erreur création payment intent:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    )
  }
}
