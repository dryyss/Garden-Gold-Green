import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { sendOrderConfirmationEmail } from '@/lib/email'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: any

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Erreur webhook signature:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        await handlePaymentSuccess(paymentIntent)
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object
        await handlePaymentFailure(failedPayment)
        break

      default:
        console.log(`Événement non géré: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Erreur traitement webhook:', error)
    return NextResponse.json(
      { error: 'Erreur traitement webhook' },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  try {
    const { metadata, amount, currency } = paymentIntent
    const items = JSON.parse(metadata.items)
    
    // Créer la commande dans la base de données
    const order = await prisma.order.create({
      data: {
        stripePaymentIntentId: paymentIntent.id,
        totalAmount: amount / 100, // Convertir centimes en euros
        currency: currency.toUpperCase(),
        status: 'PAID',
        customerEmail: metadata.customerEmail,
        customerName: metadata.customerName,
        items: items,
        shippingAddress: {},
        createdAt: new Date(),
      },
    })

    console.log(`Commande créée: ${order.id} pour ${metadata.customerEmail}`)
    
    // Envoyer email de confirmation
    try {
      await sendOrderConfirmationEmail({
        orderId: order.id,
        customerName: metadata.customerName,
        customerEmail: metadata.customerEmail,
        items: items,
        totalAmount: amount / 100,
        shippingAddress: {}, // TODO: Récupérer depuis le formulaire
      })
      console.log(`Email de confirmation envoyé pour la commande ${order.id}`)
    } catch (emailError) {
      console.error('Erreur envoi email confirmation:', emailError)
    }
    
  } catch (error) {
    console.error('Erreur création commande:', error)
  }
}

async function handlePaymentFailure(paymentIntent: any) {
  try {
    const { metadata } = paymentIntent
    
    // Marquer la commande comme échouée
    await prisma.order.updateMany({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: { status: 'FAILED' },
    })

    console.log(`Paiement échoué pour: ${metadata.customerEmail}`)
    
  } catch (error) {
    console.error('Erreur gestion échec paiement:', error)
  }
}
