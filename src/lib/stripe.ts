import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

// Configuration Stripe côté serveur
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
})

// Configuration Stripe côté client (publishable key)
export const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLISHABLE_KEY

if (!stripePublishableKey) {
  throw new Error('STRIPE_PUBLISHABLE_KEY is not defined in environment variables')
}

// Types pour les produits
export interface StripeProduct {
  id: string
  name: string
  description?: string
  price: number
  currency: string
  image?: string
  quantity: number
}

// Types pour les sessions de checkout
export interface CheckoutSessionData {
  items: StripeProduct[]
  customerEmail?: string
  customerName?: string
  shippingAddress?: {
    line1: string
    line2?: string
    city: string
    postal_code: string
    country: string
  }
  metadata?: Record<string, string>
}

// Fonction utilitaire pour créer des line items
export function createLineItems(items: StripeProduct[]) {
  return items.map(item => ({
    price_data: {
      currency: item.currency || 'eur',
      product_data: {
        name: item.name,
        description: item.description,
        images: item.image ? [item.image] : undefined,
      },
      unit_amount: Math.round(item.price * 100), // Convertir en centimes
    },
    quantity: item.quantity,
  }))
}

// Fonction pour créer une session de checkout
export async function createCheckoutSession(data: CheckoutSessionData) {
  const lineItems = createLineItems(data.items)
  
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'payment',
    line_items: lineItems,
    success_url: `${process.env.AUTH0_BASE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.AUTH0_BASE_URL || 'http://localhost:3000'}/checkout/cancel`,
    metadata: {
      userId: data.metadata?.userId || 'anonymous',
      orderItems: JSON.stringify(data.items),
      ...data.metadata,
    },
  }

  // Ajouter les informations de livraison si fournies
  if (data.customerEmail) {
    sessionParams.customer_email = data.customerEmail
  }

  if (data.shippingAddress) {
    sessionParams.shipping_address_collection = {
      allowed_countries: ['FR', 'BE', 'DE', 'ES', 'IT', 'NL', 'CH'],
    }
  }

  return await stripe.checkout.sessions.create(sessionParams)
}

// Fonction pour récupérer une session
export async function getCheckoutSession(sessionId: string) {
  return await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'payment_intent'],
  })
}

// Fonction pour créer un payment intent (pour les paiements sans checkout)
export async function createPaymentIntent(amount: number, currency: string = 'eur', metadata?: Record<string, string>) {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convertir en centimes
    currency,
    metadata: metadata || {},
    automatic_payment_methods: {
      enabled: true,
    },
  })
}
