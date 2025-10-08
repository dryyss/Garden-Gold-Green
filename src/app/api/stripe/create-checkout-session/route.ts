import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSession } from '@auth0/nextjs-auth0'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    const { items, successUrl, cancelUrl } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Panier vide' },
        { status: 400 }
      )
    }

    // Créer les line items pour Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          images: [item.image || 'https://gardengoldgreen.com/logo.png'],
          description: item.description || '',
        },
        unit_amount: Math.round(item.price * 100), // Prix en centimes
      },
      quantity: item.quantity,
    }))

    // Métadonnées pour le webhook
    const metadata: any = {
      cartItems: JSON.stringify(items),
    }

    // Ajouter l'ID utilisateur si connecté
    if (session?.user) {
      metadata.userId = session.user.sub
      metadata.userEmail = session.user.email
    }

    // Créer la session de paiement Stripe
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: successUrl || `${process.env.AUTH0_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.AUTH0_BASE_URL}/checkout/cancel`,
      metadata,
      customer_email: session?.user?.email || undefined,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'LU', 'NL', 'ES', 'IT', 'DE', 'CH'],
      },
      phone_number_collection: {
        enabled: true,
      },
    })

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    })

  } catch (error) {
    console.error('Erreur création session Stripe:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    )
  }
}

