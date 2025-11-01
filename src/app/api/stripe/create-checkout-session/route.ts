import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import jwt from 'jsonwebtoken'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY non définie')
      return NextResponse.json(
        { error: 'Configuration Stripe manquante' },
        { status: 500 }
      )
    }
    
    // Vérifier l'authentification via JWT
    let user: any = null
    const authHeader = request.headers.get('authorization')
    
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      try {
        user = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
      } catch (error) {
        // Utilisateur non authentifié, on continue quand même
      }
    }

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
    if (user) {
      metadata.userId = user.userId
      metadata.userEmail = user.email
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'

    // Créer la session de paiement Stripe
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: successUrl || `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${baseUrl}/checkout/cancel`,
      metadata,
      customer_email: user?.email || undefined,
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

