import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sendOrderConfirmationEmail } from '@/lib/email'
import { upsertOrder, CartItemPayload } from '@/lib/orders-store'
import { listProducts } from '@/lib/products-store'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

// Cache des produits (rechargé à chaque requête si nécessaire)
let productsMapCache: Map<string, any> | null = null
async function getProductsMap(): Promise<Map<string, any>> {
  if (!productsMapCache) {
    const products = await listProducts()
    productsMapCache = new Map(
      products.map(product => [String(product.id), product])
    )
  }
  return productsMapCache
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    console.log('📥 Webhook Stripe reçu')
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!
    
    console.log(`📋 Signature webhook: ${signature ? 'présente' : 'manquante'}`)

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      console.log(`✅ Webhook vérifié: type ${event.type}`)
    } catch (err: any) {
      console.error('❌ Erreur vérification webhook:', err)
      console.error('❌ Détails:', err.message)
      return NextResponse.json(
        { error: 'Signature webhook invalide' },
        { status: 400 }
      )
    }

    // Traiter les événements Stripe
    console.log(`📥 Traitement événement Stripe: ${event.type}`)
    console.log(`📋 Event ID: ${event.id}`)
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['invoice', 'payment_intent'],
        })

        const metadata = expandedSession.metadata
        console.log(`📋 Metadata de la session:`, JSON.stringify(metadata, null, 2))
        
        const cartItems: CartItemPayload[] = metadata?.cartItems
          ? JSON.parse(metadata.cartItems)
          : []
        const userId = metadata?.userId
        const userEmail = expandedSession.customer_details?.email || metadata?.userEmail
        
        console.log(`📦 Cart items extraits: ${cartItems.length}`, JSON.stringify(cartItems.slice(0, 2), null, 2))
        console.log(`👤 User ID: ${userId}, Email: ${userEmail}`)

        try {
          const orderNumber = `CMD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-4)}`

          let receiptUrl: string | null = null
          let invoicePdf: string | null = null
          let paymentIntentId: string | undefined
          let paymentIntentObj: Stripe.PaymentIntent | null = null

          if (expandedSession.payment_intent) {
            const paymentIntentRaw = expandedSession.payment_intent
            try {
              paymentIntentObj =
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

          if (cartItems.length === 0) {
            console.error('❌ [WEBHOOK] Aucun item dans cartItems, impossible de créer la commande')
            console.error('❌ [WEBHOOK] Metadata:', JSON.stringify(metadata, null, 2))
            return NextResponse.json({ 
              received: true, 
              error: 'Aucun item dans la commande' 
            }, { status: 200 })
          }
          
          const productsMap = await getProductsMap()
          console.log(`📦 [WEBHOOK] Produits disponibles dans la map: ${productsMap.size}`)
          
          // Récupérer tous les produits pour la recherche alternative
          const allProducts = await listProducts()
          
          // Créer une map étendue avec plusieurs clés
          const extendedProductsMap = new Map<string, any>()
          allProducts.forEach(product => {
            extendedProductsMap.set(String(product.id), product)
            if (product.slug) {
              extendedProductsMap.set(product.slug, product)
            }
            if (!isNaN(Number(product.id))) {
              extendedProductsMap.set(String(Number(product.id)), product)
            }
          })
          
          const mappedItems = cartItems.map((item, index) => {
            const productIdFromCart = String(item.i ?? item.id ?? '')
            if (!productIdFromCart) {
              console.error(`❌ [WEBHOOK] Item ${index} sans productId:`, item)
            }
            
            // Chercher dans la map étendue
            let product = extendedProductsMap.get(productIdFromCart)
            
            // Si pas trouvé, chercher par recherche alternative
            if (!product) {
              console.warn(`⚠️ [WEBHOOK] Produit "${productIdFromCart}" non trouvé dans la map`)
              product = allProducts.find(p => 
                p.slug === productIdFromCart || 
                String(p.id) === productIdFromCart ||
                (!isNaN(Number(productIdFromCart)) && !isNaN(Number(p.id)) && Number(p.id) === Number(productIdFromCart))
              )
              if (product) {
                console.log(`✅ [WEBHOOK] Produit trouvé par recherche alternative: ${product.id}`)
              } else {
                console.error(`❌ [WEBHOOK] Produit "${productIdFromCart}" introuvable`)
              }
            }
            
            // Utiliser le vrai ID Prisma
            const realProductId = product ? String(product.id) : productIdFromCart
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
              productId: realProductId, // Utiliser le vrai ID Prisma
              name: item.name || product?.title || product?.name || `Produit ${realProductId}`,
              quantity,
              priceCents,
              image: item.image || product?.images?.[0],
            }
          })
          
          // Filtrer les items invalides
          const validItems = mappedItems.filter(item => {
            const product = allProducts.find(p => String(p.id) === item.productId)
            if (!product) {
              console.error(`❌ [WEBHOOK] Item avec productId invalide: ${item.productId}`)
              return false
            }
            return true
          })
          
          if (validItems.length === 0) {
            console.error('❌ [WEBHOOK] Aucun item valide après validation')
            return NextResponse.json({ 
              received: true, 
              error: 'Aucun produit valide dans la commande' 
            }, { status: 200 })
          }
          
          console.log(`✅ [WEBHOOK] Items valides: ${validItems.length}/${mappedItems.length}`)

          const subtotalCents = expandedSession.amount_subtotal ?? null
          const sessionShippingCents =
            expandedSession.total_details?.amount_shipping ??
            expandedSession.shipping_cost?.amount_total ??
            null
          const paymentIntentShippingCents =
            (paymentIntentObj?.amount_details as any)?.shipping?.amount ?? null
          const shippingCents =
            sessionShippingCents ?? paymentIntentShippingCents ?? null

          const taxCents =
            expandedSession.total_details?.amount_tax ??
            ((paymentIntentObj?.amount_details as any)?.tax?.amount ?? null)

          const discountCents = expandedSession.total_details?.amount_discount ?? null

          console.log(`📝 Création commande ${orderNumber} - userId: "${userId}", email: "${userEmail}"`)
          console.log(`📦 Items à sauvegarder (${mappedItems.length}):`, JSON.stringify(mappedItems.slice(0, 2), null, 2))
          
          try {
            const orderRecord = await upsertOrder({
            id: orderNumber,
            userId: userId || null,
            stripeSessionId: expandedSession.id,
            paymentIntentId,
            totalCents: expandedSession.amount_total || 0,
            currency: expandedSession.currency?.toUpperCase() || 'EUR',
            status: 'paid',
            subtotalCents,
            shippingCents,
            taxCents,
            discountCents,
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
            items: validItems,
            receiptUrl,
            invoicePdf,
            metadata: {
              userId,
              paymentMethod: metadata?.paymentMethod,
            },
          })

            console.log(`✅ Commande sauvegardée: ${orderRecord.id}`)
            console.log(`✅ Commande créée avec ${orderRecord.items.length} item(s)`)

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

        } catch (err: any) {
          console.error('❌ Erreur sauvegarde commande:', err)
          console.error('❌ Détails de l\'erreur:', err?.message)
          console.error('❌ Stack trace:', err?.stack)
          // Ne pas bloquer la réponse au webhook, mais loguer l'erreur
        }

        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // TODO: Notifier l'utilisateur de l'échec
        break;
      }

      case 'charge.refunded': {
        // Mise à jour du statut gérée côté commandes JSON si nécessaire
        break;
      }

      default:
        // Événement non traité
        break;
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