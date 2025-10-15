import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Vérifier que la clé Stripe est présente
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY manquant dans .env.local')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
})

export async function POST(request: NextRequest) {
  try {
    console.log('📦 Début création session Stripe...')
    
    const { items, paymentMethod } = await request.json()
    console.log('📦 Items reçus:', items)
    console.log('💳 Méthode de paiement:', paymentMethod)

    if (!items || items.length === 0) {
      console.log('❌ Panier vide')
      return NextResponse.json(
        { error: 'Le panier est vide' },
        { status: 400 }
      )
    }

    // Calculer le sous-total et les frais de livraison
    const subtotal = items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0)
    const shipping = subtotal > 100 ? 0 : 9.90
    const total = subtotal + shipping

    console.log('💰 Calculs:', { subtotal, shipping, total })

    // Créer les line items pour Stripe
    const lineItems = items.map((item: any) => {
      console.log('🛍️ Traitement item:', item.name, 'Prix:', item.price)
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            description: item.cbdPercent ? `CBD ${item.cbdPercent}%` : undefined,
          },
          unit_amount: Math.round(item.price * 100), // Convertir euros en centimes
        },
        quantity: item.quantity,
      }
    })

    // Ajouter les frais de livraison si nécessaire
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Frais de livraison',
            description: 'Livraison standard',
          },
          unit_amount: Math.round(shipping * 100), // Convertir euros en centimes
        },
        quantity: 1,
      })
    }
    
    console.log('📋 Line items préparés:', lineItems.length, 'items')

    // Pour l'instant, on utilise seulement les cartes
    // Apple Pay et Google Pay nécessitent une configuration plus complexe
    const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = ['card']

    // Créer la session Stripe Checkout
    console.log('🔐 Création session Stripe...')
    console.log('💳 Méthodes de paiement:', paymentMethodTypes)
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethodTypes,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cart`,
      metadata: {
        userId: 'guest',
        paymentMethod: paymentMethod || 'stripe',
      },
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'LU', 'CH', 'DE', 'ES', 'IT', 'NL'],
      },
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
    })

    console.log('✅ Session créée:', session.id)
    console.log('🔗 URL:', session.url)

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('❌ Erreur création session Stripe:', error)
    console.error('Détails:', {
      message: error.message,
      type: error.type,
      code: error.code,
    })
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    )
  }
}
