import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { auth0 } from '@/lib/auth0'
import { getAuth0User } from '@/lib/auth0-management'
import { getUserById, upsertUser } from '@/lib/users-store'
import { stripe as sharedStripe } from '@/lib/stripe'

// Vérifier que la clé Stripe est présente
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY manquant dans .env.local')
}

const stripe = sharedStripe instanceof Stripe ? sharedStripe : new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
})

export async function POST(request: NextRequest) {
  try {
    const { items, paymentMethod } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Le panier est vide' },
        { status: 400 }
      )
    }

    // Récupérer l'utilisateur Auth0 et vérifier son statut
    const session = await auth0.getSession(request)

    if (!session?.user?.sub) {
      return NextResponse.json(
        { error: 'Authentification requise pour procéder au paiement', code: 'auth_required' },
        { status: 401 }
      )
    }

    const userId = session.user.sub

    let auth0User: Awaited<ReturnType<typeof getAuth0User>> | null = null
    try {
      auth0User = await getAuth0User(userId)
    } catch (error) {
      console.error('❌ Impossible de récupérer les informations Auth0:', error)
      return NextResponse.json(
        { error: 'Impossible de vérifier votre compte pour le paiement', code: 'user_lookup_failed' },
        { status: 500 }
      )
    }

    const emailVerified = Boolean(
      auth0User?.email_verified ?? (session.user as any).email_verified ?? false
    )
    const userEmail = auth0User?.email || session.user.email || undefined


    if (!emailVerified) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const verifyEmailUrl = `${baseUrl}/verify-email`
      
      return NextResponse.json(
        {
          error: 'Veuillez vérifier votre adresse email avant de finaliser le paiement.',
          code: 'email_not_verified',
          redirectUrl: verifyEmailUrl,
        },
        { status: 403 }
      )
    }


    // Calculer le sous-total et les frais de livraison
    const subtotal = items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0)
    const shipping = subtotal > 100 ? 0 : 9.90
    const total = subtotal + shipping

    // Créer les line items pour Stripe
    const lineItems = items.map((item: any) => {
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

    const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = ['card']
    if (process.env.STRIPE_ENABLE_PAYPAL === 'true') {
      paymentMethodTypes.push('paypal')
    }

    let stripeCustomerId: string | undefined
    if (session?.user?.sub) {
      const storedUser = await getUserById(session.user.sub)
      if (storedUser?.stripeCustomerId) {
        stripeCustomerId = storedUser.stripeCustomerId
      } else {
        const customer = await stripe.customers.create({
          email: userEmail,
          name: session.user.name || session.user.nickname,
          metadata: {
            auth0UserId: session.user.sub,
          },
        })
        const saved = await upsertUser({
          id: session.user.sub,
          email: userEmail,
          name: session.user.name || session.user.nickname,
          stripeCustomerId: customer.id,
        })
        stripeCustomerId = saved.stripeCustomerId
      }
    }

    const metadataItems = items.map((item: any) => ({
      i: String(item.id),
      q: Number(item.quantity) || 0,
      pc: Math.round(item.price * 100),
    }))

    const checkoutParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: paymentMethodTypes,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cart`,
      metadata: {
        userId: userId,
        userEmail: userEmail || '',
        cartItems: JSON.stringify(metadataItems),
        paymentMethod: paymentMethod || 'stripe',
      },
      invoice_creation: {
        enabled: true,
        invoice_data: {
          metadata: {
            userId: userId || '',
            userEmail: userEmail || '',
          },
        },
      },
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'LU', 'CH', 'DE', 'ES', 'IT', 'NL'],
      },
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
    }

    if (stripeCustomerId) {
      checkoutParams.customer = stripeCustomerId
    } else if (userEmail) {
      checkoutParams.customer_email = userEmail
    }

    if (session?.user?.sub) {
      checkoutParams.client_reference_id = session.user.sub
    }

    const checkoutSession = await stripe.checkout.sessions.create(checkoutParams)

    return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url })
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
