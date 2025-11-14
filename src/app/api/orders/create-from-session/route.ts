import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { upsertOrder, CartItemPayload } from '@/lib/orders-store'
import { listProducts } from '@/lib/products-store'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

/**
 * Crée une commande depuis une session Stripe
 * Utilisé quand le webhook n'est pas disponible (développement local)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId requis' },
        { status: 400 }
      )
    }

    console.log(`📥 [create-from-session] Création commande depuis session ${sessionId}`)

    // Récupérer la session Stripe
    const expandedSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['invoice', 'payment_intent'],
    })

    // Vérifier si la commande existe déjà
    const existingOrder = await prisma.order.findFirst({
      where: { stripeSessionId: sessionId }
    })

    if (existingOrder) {
      console.log(`✅ [create-from-session] Commande ${existingOrder.id} existe déjà`)
      return NextResponse.json({
        success: true,
        order: existingOrder,
        message: 'Commande déjà créée'
      })
    }

    const metadata = expandedSession.metadata
    const cartItems: CartItemPayload[] = metadata?.cartItems
      ? JSON.parse(metadata.cartItems)
      : []
    const userId = metadata?.userId
    const userEmail = expandedSession.customer_details?.email || metadata?.userEmail

    if (cartItems.length === 0) {
      console.error('❌ [create-from-session] Aucun item dans cartItems')
      return NextResponse.json(
        { error: 'Aucun item dans la commande' },
        { status: 400 }
      )
    }

    // Récupérer les produits
    const products = await listProducts()
    console.log(`📦 [create-from-session] Produits récupérés: ${products.length}`)
    console.log(`📦 [create-from-session] Exemples d'IDs produits:`, products.slice(0, 3).map(p => ({ id: p.id, name: p.name })))
    
    // Créer une map avec plusieurs clés possibles (id, slug, ancien id numérique)
    const productsMap = new Map<string, any>()
    products.forEach(product => {
      // Clé par ID Prisma
      productsMap.set(String(product.id), product)
      // Clé par slug si disponible
      if (product.slug) {
        productsMap.set(product.slug, product)
      }
      // Si l'ID ressemble à un nombre, essayer aussi comme nombre
      if (!isNaN(Number(product.id))) {
        productsMap.set(String(Number(product.id)), product)
      }
    })

    // Mapper les items
    const mappedItems = cartItems.map((item, index) => {
      const productIdFromCart = String(item.i ?? item.id ?? '')
      console.log(`🔍 [create-from-session] Item ${index}: productIdFromCart="${productIdFromCart}"`)
      
      // Chercher le produit par ID
      let product = productsMap.get(productIdFromCart)
      
      // Si pas trouvé, essayer de chercher par slug ou autre
      if (!product) {
        console.warn(`⚠️ [create-from-session] Produit "${productIdFromCart}" non trouvé dans la map`)
        // Chercher dans tous les produits par slug ou nom
        product = products.find(p => 
          p.slug === productIdFromCart || 
          String(p.id) === productIdFromCart ||
          (!isNaN(Number(productIdFromCart)) && !isNaN(Number(p.id)) && Number(p.id) === Number(productIdFromCart))
        )
        if (product) {
          console.log(`✅ [create-from-session] Produit trouvé par recherche alternative: ${product.id}`)
        } else {
          console.error(`❌ [create-from-session] Produit "${productIdFromCart}" introuvable dans la base`)
        }
      }
      
      // Utiliser l'ID Prisma du produit trouvé, ou l'ID du panier si pas trouvé
      const realProductId = product ? String(product.id) : productIdFromCart
      
      if (!product) {
        console.error(`❌ [create-from-session] PROBLÈME: Produit ${productIdFromCart} non trouvé, la commande échouera`)
      }
      
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
      }
    })
    
    // Filtrer les items sans produit valide
    const validItems = mappedItems.filter(item => {
      const product = products.find(p => String(p.id) === item.productId)
      if (!product) {
        console.error(`❌ [create-from-session] Item avec productId invalide: ${item.productId}`)
        return false
      }
      return true
    })
    
    if (validItems.length === 0) {
      console.error('❌ [create-from-session] Aucun item valide après validation')
      return NextResponse.json(
        { error: 'Aucun produit valide dans la commande' },
        { status: 400 }
      )
    }
    
    console.log(`✅ [create-from-session] Items valides: ${validItems.length}/${mappedItems.length}`)

    const orderNumber = `CMD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-4)}`

    // Récupérer les informations de livraison
    const shippingAddressData = expandedSession.shipping_details?.address || null
    const shippingName = expandedSession.shipping_details?.name || ''
    const [shippingFirstName, ...shippingRest] = shippingName ? shippingName.split(' ') : ['']
    const shippingLastName = shippingRest.join(' ')
    const shippingPhone = expandedSession.shipping_details?.phone || ''

    const billingAddressData = expandedSession.customer_details?.address || null
    const billingName = expandedSession.customer_details?.name || ''
    const [billingFirstName, ...billingRest] = billingName ? billingName.split(' ') : ['']
    const billingLastName = billingRest.join(' ')
    const billingPhone = expandedSession.customer_details?.phone || ''

    const paymentIntentId = typeof expandedSession.payment_intent === 'string'
      ? expandedSession.payment_intent
      : (expandedSession.payment_intent as any)?.id

    const subtotalCents = expandedSession.amount_subtotal ?? null
    const shippingCents = expandedSession.total_details?.amount_shipping ?? null
    const taxCents = expandedSession.total_details?.amount_tax ?? null
    const discountCents = expandedSession.total_details?.amount_discount ?? null

    console.log(`📝 [create-from-session] Création commande ${orderNumber}`)

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
      metadata: {
        userId,
        paymentMethod: metadata?.paymentMethod,
      },
    })

    console.log(`✅ [create-from-session] Commande ${orderRecord.id} créée avec succès`)

    return NextResponse.json({
      success: true,
      order: orderRecord,
    })

  } catch (error: any) {
    console.error('❌ [create-from-session] Erreur:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors de la création de la commande',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

