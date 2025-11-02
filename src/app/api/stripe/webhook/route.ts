import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'
import { sendOrderConfirmationEmail } from '@/lib/email'

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

        // Récupérer les métadonnées
        const metadata = session.metadata
        const cartItems = metadata?.cartItems ? JSON.parse(metadata.cartItems) : []
        const userId = metadata?.userId
        const userEmail = session.customer_details?.email || metadata?.userEmail

        // Créer la commande en base de données
        try {
          // Générer un numéro de commande lisible (ex: CMD-20250101-0001)
          const orderNumber = `CMD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-4)}`
          
          const order = await prisma.order.create({
            data: {
              id: orderNumber, // Numéro de commande personnalisé
              userId: userId || null,
              stripeSessionId: session.id,
              paymentIntentId: session.payment_intent as string,
              totalCents: session.amount_total!, // Garder en centimes
              status: 'paid',
              customerEmail: userEmail || '',
              customerName: session.customer_details?.name || '',
              customerPhone: session.customer_details?.phone || '',
              shippingAddress: {
                firstName: session.customer_details?.name?.split(' ')[0] || '',
                lastName: session.customer_details?.name?.split(' ').slice(1).join(' ') || '',
                email: userEmail || '',
                phone: session.customer_details?.phone || '',
                address: session.shipping?.address?.line1 || '',
                city: session.shipping?.address?.city || '',
                postalCode: session.shipping?.address?.postal_code || '',
                country: session.shipping?.address?.country || '',
              },
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
              },
            },
          })

          console.log(`✅ Commande créée: ${order.id}`)
          
          // Envoyer email de confirmation
          try {
            await sendOrderConfirmationEmail({
              id: order.id,
              customerName: order.customerName || 'Client',
              total: order.totalCents / 100,
              currency: order.currency,
              items: order.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.priceCents / 100,
              })),
              shippingAddress: order.shippingAddress as any,
            })
          } catch (emailError) {
            console.error('❌ Erreur envoi email:', emailError)
            // Ne pas bloquer le webhook si l'email échoue
          }

        } catch (dbError) {
          console.error('❌ Erreur création commande:', dbError)
          // Ne pas retourner d'erreur pour ne pas bloquer le webhook
        }

        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // TODO: Notifier l'utilisateur de l'échec
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge

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
        // Événement non traité
        break
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