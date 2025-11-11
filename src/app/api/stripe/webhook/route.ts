import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sendOrderConfirmationEmail } from '@/lib/email'
import { upsertOrder, CartItemPayload } from '@/lib/orders-store'
import productsData from '@/data/products.json'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

const productsMap = new Map(
  (productsData as any[]).map(product => [String(product.id), product])
)

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

        const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['invoice', 'payment_intent'],
        })

        const metadata = expandedSession.metadata
        const cartItems: CartItemPayload[] = metadata?.cartItems
          ? JSON.parse(metadata.cartItems)
          : []
        const userId = metadata?.userId
        const userEmail = expandedSession.customer_details?.email || metadata?.userEmail

        try {
          const orderNumber = `CMD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-4)}`

          let receiptUrl: string | null = null
          let invoicePdf: string | null = null
          let paymentIntentId: string | undefined

          if (expandedSession.payment_intent) {
            const paymentIntentRaw = expandedSession.payment_intent
            try {
              const paymentIntentObj =
                typeof paymentIntentRaw === 'string'
                  ? await stripe.paymentIntents.retrieve(paymentIntentRaw, { expand: ['charges'] })
                  : (paymentIntentRaw as Stripe.PaymentIntent)

              paymentIntentId = paymentIntentObj.id
              const charge = paymentIntentObj.charges?.data?.[0]
              receiptUrl = charge?.receipt_url || receiptUrl
            } catch (piError) {
              console.warn('⚠️ Impossible de récupérer le PaymentIntent:', piError)
            }
          }

          if (expandedSession.invoice) {
            const invoiceRaw = expandedSession.invoice
            try {
              const invoiceObj =
                typeof invoiceRaw === 'string'
                  ? await stripe.invoices.retrieve(invoiceRaw)
                  : (invoiceRaw as Stripe.Invoice)

              invoicePdf = invoiceObj.invoice_pdf || null
              receiptUrl =
                receiptUrl ||
                invoiceObj.hosted_invoice_url ||
                invoiceObj.invoice_pdf ||
                null
            } catch (invoiceError) {
              console.warn('⚠️ Impossible de récupérer la facture Stripe:', invoiceError)
            }
          }

          const shippingDetails = expandedSession.shipping_details || null
          const shippingAddressData = shippingDetails?.address || expandedSession.customer_details?.address || null
          const shippingPhone = shippingDetails?.phone || expandedSession.customer_details?.phone || ''
          const shippingName = shippingDetails?.name || expandedSession.customer_details?.name || ''
          const [shippingFirstName, ...shippingRest] = shippingName ? shippingName.split(' ') : ['']
          const shippingLastName = shippingRest.join(' ')

          const billingAddressData = expandedSession.customer_details?.address || null
          const billingName = expandedSession.customer_details?.name || ''
          const [billingFirstName, ...billingRest] = billingName ? billingName.split(' ') : ['']
          const billingLastName = billingRest.join(' ')
          const billingPhone = expandedSession.customer_details?.phone || ''

          const mappedItems = cartItems.map((item) => {
            const productId = String(item.i ?? item.id ?? '')
            const product = productId ? productsMap.get(productId) : undefined
            const quantity = item.q ?? item.quantity ?? 1
            const priceCents =
              typeof item.pc === 'number'
                ? item.pc
                : typeof item.priceCents === 'number'
                  ? item.priceCents
                  : typeof item.price === 'number'
                    ? Math.round(item.price * 100)
                    : typeof product?.priceCents === 'number'
                      ? product.priceCents
                      : 0

            return {
              productId,
              name: item.name || product?.title || product?.name || `Produit ${productId}`,
              quantity,
              priceCents,
              image: item.image || product?.images?.[0],
            }
          })

          const orderRecord = await upsertOrder({
            id: orderNumber,
            userId: userId || null,
            stripeSessionId: expandedSession.id,
            paymentIntentId,
            totalCents: expandedSession.amount_total || 0,
            currency: expandedSession.currency?.toUpperCase() || 'EUR',
            status: 'paid',
            customerEmail: userEmail || '',
            customerName: expandedSession.customer_details?.name || '',
            customerPhone: expandedSession.customer_details?.phone || '',
            shippingAddress: {
              firstName: shippingFirstName || '',
              lastName: shippingLastName || '',
              email: userEmail || '',
              phone: shippingPhone || '',
              address: shippingAddressData?.line1 || '',
              address2: shippingAddressData?.line2 || '',
              city: shippingAddressData?.city || '',
              postalCode: shippingAddressData?.postal_code || '',
              country: shippingAddressData?.country || '',
            },
            billingAddress: {
              firstName: billingFirstName || '',
              lastName: billingLastName || '',
              email: userEmail || '',
              phone: billingPhone || '',
              address: billingAddressData?.line1 || '',
              address2: billingAddressData?.line2 || '',
              city: billingAddressData?.city || '',
              postalCode: billingAddressData?.postal_code || '',
              country: billingAddressData?.country || '',
            },
            items: mappedItems,
            receiptUrl,
            invoicePdf,
            metadata: {
              userId,
              paymentMethod: metadata?.paymentMethod,
            },
          })

          console.log(`✅ Commande sauvegardée: ${orderRecord.id}`)

          if (orderRecord.customerEmail) {
            try {
              await sendOrderConfirmationEmail({
                id: orderRecord.id,
                customerEmail: orderRecord.customerEmail,
                customerName: orderRecord.customerName || 'Client',
                total: orderRecord.totalCents / 100,
                currency: orderRecord.currency,
                items: orderRecord.items.map(item => ({
                  name: item.name,
                  quantity: item.quantity,
                  price: item.priceCents / 100,
                })),
                shippingAddress: orderRecord.shippingAddress || {},
                billingAddress: orderRecord.billingAddress || {},
                receiptUrl: orderRecord.receiptUrl || orderRecord.invoicePdf || undefined,
                invoicePdfUrl: orderRecord.invoicePdf || undefined,
              })
            } catch (emailError) {
              console.error('❌ Erreur envoi email:', emailError)
            }
          } else {
            console.warn('⚠️ Email client manquant, confirmation non envoyée pour', orderRecord.id)
          }

        } catch (err) {
          console.error('❌ Erreur sauvegarde commande:', err)
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