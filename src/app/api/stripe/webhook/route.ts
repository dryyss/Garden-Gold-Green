import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

const prisma = new PrismaClient()
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('❌ Erreur vérification webhook:', err)
      return NextResponse.json(
        { error: 'Signature webhook invalide' },
        { status: 400 }
      )
    }

    // Traiter les événements Stripe
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        console.log('✅ Paiement réussi:', session.id)

        // Récupérer les métadonnées
        const metadata = session.metadata
        const cartItems = metadata?.cartItems ? JSON.parse(metadata.cartItems) : []
        const userId = metadata?.userId
        const userEmail = session.customer_details?.email || metadata?.userEmail

        // Créer la commande en base de données
        try {
          const order = await prisma.order.create({
            data: {
              userId: userId || null,
              stripeSessionId: session.id,
              paymentIntentId: session.payment_intent as string,
              totalCents: session.amount_total!, // Garder en centimes
              status: 'paid',
              customerEmail: userEmail || '',
              customerName: session.customer_details?.name || '',
              customerPhone: session.customer_details?.phone || '',
              shippingAddress: session.shipping?.address || {},
              items: {
                create: cartItems.map((item: any) => ({
                  productId: item.id,
                  name: item.name,
                  quantity: item.quantity,
                  priceCents: Math.round(item.price * 100), // Convertir en centimes
                })),
              },
            },
            include: {
              items: true,
            },
          })

          console.log('📦 Commande créée:', order.id)

          // TODO: Envoyer email de confirmation
          // await sendOrderConfirmationEmail(order)

        } catch (dbError) {
          console.error('❌ Erreur création commande:', dbError)
          // Ne pas retourner d'erreur pour ne pas bloquer le webhook
        }

        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('💳 Payment Intent réussi:', paymentIntent.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('❌ Payment Intent échoué:', paymentIntent.id)
        
        // TODO: Notifier l'utilisateur de l'échec
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        console.log('↩️ Remboursement:', charge.id)

        // Mettre à jour le statut de la commande
        try {
          const paymentIntentId = charge.payment_intent as string
          await prisma.order.updateMany({
            where: { paymentIntentId: paymentIntentId },
            data: { status: 'refunded' },
          })
        } catch (dbError) {
          console.error('❌ Erreur mise à jour remboursement:', dbError)
        }

        break
      }

      default:
        console.log(`ℹ️ Événement non traité: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('❌ Erreur webhook Stripe:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}