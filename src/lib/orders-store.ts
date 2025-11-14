import { prisma } from '@/lib/prisma'

export interface OrderItemRecord {
  productId: string
  name: string
  priceCents: number
  quantity: number
  image?: string
}

export interface ShippingHistoryEntry {
  date: string
  status: string
  message?: string
}

export interface OrderShippingInfo {
  carrier?: string | null
  trackingNumber?: string | null
  trackingUrl?: string | null
  status?: string | null
  shippedAt?: string | null
  deliveredAt?: string | null
  estimatedDeliveryDate?: string | null
  history?: ShippingHistoryEntry[]
}

export interface OrderRecord {
  id: string
  userId?: string | null
  status: string
  totalCents: number
  currency: string
  items: OrderItemRecord[]
  createdAt: string
  updatedAt: string
  deliveredAt?: string | null
  subtotalCents?: number | null
  shippingCents?: number | null
  taxCents?: number | null
  discountCents?: number | null
  customerEmail?: string
  customerName?: string
  customerPhone?: string
  shippingAddress?: Record<string, unknown>
  billingAddress?: Record<string, unknown>
  stripeSessionId?: string
  paymentIntentId?: string
  receiptUrl?: string | null
  invoicePdf?: string | null
  trackingNumber?: string | null
  carrier?: string | null
  carrierTrackingUrl?: string | null
  shippingStatus?: string | null
  shippedAt?: string | null
  estimatedDeliveryDate?: string | null
  shippingHistory?: ShippingHistoryEntry[]
  shippingInfo?: OrderShippingInfo | null
  metadata?: Record<string, unknown>
}

// Convertir Prisma Order vers OrderRecord
function prismaOrderToRecord(order: any): OrderRecord {
  return {
    id: order.id,
    userId: order.userId,
    status: order.status,
    totalCents: order.totalCents,
    currency: order.currency,
    items: order.items?.map((item: any) => ({
      productId: item.productId,
      name: item.name,
      priceCents: item.priceCents,
      quantity: item.quantity,
      image: undefined
    })) || [],
    createdAt: order.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: order.updatedAt?.toISOString() || new Date().toISOString(),
    deliveredAt: order.deliveredAt?.toISOString() || null,
    subtotalCents: order.subtotalCents,
    shippingCents: order.shippingCents,
    taxCents: order.taxCents,
    discountCents: order.discountCents,
    customerEmail: order.customerEmail || undefined,
    customerName: order.customerName || undefined,
    customerPhone: order.customerPhone || undefined,
    shippingAddress: order.shippingAddress as Record<string, unknown> || undefined,
    billingAddress: order.billingAddress as Record<string, unknown> || undefined,
    stripeSessionId: order.stripeSessionId || undefined,
    paymentIntentId: order.paymentIntentId || undefined,
    receiptUrl: order.receiptUrl,
    invoicePdf: order.invoicePdf,
    trackingNumber: (order.shippingInfo as any)?.trackingNumber || null,
    carrier: (order.shippingInfo as any)?.carrier || null,
    carrierTrackingUrl: (order.shippingInfo as any)?.trackingUrl || null,
    shippingStatus: (order.shippingInfo as any)?.status || null,
    shippedAt: (order.shippingInfo as any)?.shippedAt || null,
    estimatedDeliveryDate: (order.shippingInfo as any)?.estimatedDeliveryDate || null,
    shippingHistory: (order.shippingInfo as any)?.history || undefined,
    shippingInfo: order.shippingInfo as OrderShippingInfo || null,
    metadata: order.metadata as Record<string, unknown> || undefined
  }
}

export async function upsertOrder(
  order: Omit<OrderRecord, 'createdAt' | 'updatedAt'> & Partial<OrderRecord>
): Promise<OrderRecord> {
  try {
    console.log(`🔍 [upsertOrder] Début pour commande ${order.id}`)
    console.log(`📦 [upsertOrder] Items reçus (${order.items?.length || 0}):`, JSON.stringify(order.items?.slice(0, 2), null, 2))
    
    if (!order.items || order.items.length === 0) {
      console.error(`❌ [upsertOrder] Aucun item dans la commande ${order.id}`)
      throw new Error(`Aucun item dans la commande ${order.id}`)
    }
    
    const existing = await prisma.order.findUnique({
      where: { id: order.id },
      include: { items: { include: { product: true } } }
    })
    
    console.log(`📋 [upsertOrder] Commande existante:`, existing ? `OUI (${existing.items.length} items)` : 'NON')

    // Préparer shippingInfo
    const existingShippingInfo = existing?.shippingInfo as OrderShippingInfo | null
    const updateShippingInfo = order.shippingInfo || (order.trackingNumber || order.carrier ? {
      carrier: order.carrier || null,
      trackingNumber: order.trackingNumber || null,
      trackingUrl: order.carrierTrackingUrl || null,
      status: order.shippingStatus || null,
      shippedAt: order.shippedAt || null,
      deliveredAt: order.deliveredAt || null,
      estimatedDeliveryDate: order.estimatedDeliveryDate || null,
      history: order.shippingHistory || []
    } : null)

    const shippingInfo = updateShippingInfo || existingShippingInfo || null

    // userId doit être l'auth0Id directement
    const orderData: any = {
      userId: order.userId ?? existing?.userId ?? null, // Stocke l'auth0Id directement
      status: order.status ?? existing?.status ?? 'pending',
      totalCents: order.totalCents ?? existing?.totalCents ?? 0,
      currency: order.currency ?? existing?.currency ?? 'EUR',
      subtotalCents: order.subtotalCents ?? existing?.subtotalCents ?? null,
      shippingCents: order.shippingCents ?? existing?.shippingCents ?? null,
      taxCents: order.taxCents ?? existing?.taxCents ?? null,
      discountCents: order.discountCents ?? existing?.discountCents ?? null,
      customerEmail: order.customerEmail ?? existing?.customerEmail ?? null,
      customerName: order.customerName ?? existing?.customerName ?? null,
      customerPhone: order.customerPhone ?? existing?.customerPhone ?? null,
      shippingAddress: order.shippingAddress ?? existing?.shippingAddress ?? null,
      billingAddress: order.billingAddress ?? existing?.billingAddress ?? null,
      stripeSessionId: order.stripeSessionId ?? existing?.stripeSessionId ?? null,
      paymentIntentId: order.paymentIntentId ?? existing?.paymentIntentId ?? null,
      receiptUrl: order.receiptUrl ?? existing?.receiptUrl ?? null,
      invoicePdf: order.invoicePdf ?? existing?.invoicePdf ?? null,
      shippingInfo: shippingInfo,
      metadata: order.metadata ?? existing?.metadata ?? null,
      deliveredAt: order.deliveredAt ? new Date(order.deliveredAt) : (existing?.deliveredAt ?? null)
    }

    let result
    if (existing) {
      // Mettre à jour
      console.log(`📝 [upsertOrder] Mise à jour de la commande ${order.id}`)
      result = await prisma.order.update({
        where: { id: order.id },
        data: orderData,
        include: { items: { include: { product: true } } }
      })

      // Mettre à jour les items si fournis
      if (order.items && order.items.length > 0) {
        // Supprimer les anciens items
        await prisma.orderItem.deleteMany({
          where: { orderId: order.id }
        })

        // Créer les nouveaux items
        await prisma.orderItem.createMany({
          data: order.items.map(item => ({
            orderId: order.id,
            productId: item.productId,
            name: item.name,
            priceCents: item.priceCents,
            quantity: item.quantity,
            status: 'ordered'
          }))
        })

        // Recharger avec les nouveaux items
        result = await prisma.order.findUnique({
          where: { id: order.id },
          include: { items: { include: { product: true } } }
        })!
      }
    } else {
      // Créer
      console.log(`📝 [upsertOrder] Création de la commande ${order.id} avec ${order.items.length} item(s)`)
      
      // Valider et formater les items
      const itemsToCreate = order.items.map((item, index) => {
        if (!item.productId) {
          console.error(`❌ [upsertOrder] Item ${index} sans productId:`, item)
          throw new Error(`Item ${index} sans productId`)
        }
        if (!item.name) {
          console.error(`❌ [upsertOrder] Item ${index} sans name:`, item)
          throw new Error(`Item ${index} sans name`)
        }
        if (typeof item.priceCents !== 'number') {
          console.error(`❌ [upsertOrder] Item ${index} avec priceCents invalide (${typeof item.priceCents}):`, item)
          throw new Error(`Item ${index} avec priceCents invalide: ${item.priceCents}`)
        }
        if (typeof item.quantity !== 'number') {
          console.error(`❌ [upsertOrder] Item ${index} avec quantity invalide (${typeof item.quantity}):`, item)
          throw new Error(`Item ${index} avec quantity invalide: ${item.quantity}`)
        }
        
        return {
          productId: item.productId,
          name: item.name,
          priceCents: item.priceCents,
          quantity: item.quantity,
          status: 'ordered' as const
        }
      })
      
      console.log(`✅ [upsertOrder] Items validés (${itemsToCreate.length}):`, JSON.stringify(itemsToCreate.slice(0, 2), null, 2))
      
      try {
        result = await prisma.order.create({
          data: {
            ...orderData,
            id: order.id,
            items: {
              create: itemsToCreate
            }
          },
          include: { items: { include: { product: true } } }
        })
        
        console.log(`✅ [upsertOrder] Commande ${order.id} créée avec succès dans Prisma (${result.items.length} items)`)
      } catch (createError: any) {
        console.error(`❌ [upsertOrder] Erreur lors de la création Prisma:`, createError)
        console.error(`❌ [upsertOrder] Détails:`, {
          code: createError.code,
          message: createError.message,
          meta: createError.meta
        })
        throw createError
      }
    }

    console.log(`✅ [upsertOrder] Commande ${order.id} sauvegardée dans Prisma`)
    return prismaOrderToRecord(result)
  } catch (error: any) {
    console.error(`❌ [upsertOrder] ERREUR lors de la sauvegarde de la commande ${order.id}:`, error)
    throw error
  }
}

export async function listOrdersByUser(userId: string, userEmail?: string): Promise<OrderRecord[]> {
  try {
    console.log(`🔍 [listOrdersByUser] Recherche pour userId: "${userId}", email: "${userEmail}"`)
    
    const where: any = {}
    
    // userId est maintenant l'auth0Id directement dans la table Order
    if (userId.startsWith('auth0|') || userId.startsWith('google-oauth2|')) {
      // Chercher directement par auth0Id
      where.userId = userId
      console.log(`🔍 [listOrdersByUser] Recherche par auth0Id: ${userId}`)
    } else {
      // Si c'est un ID Prisma, on peut quand même chercher
      where.userId = userId
    }

    // Fallback par email si pas de userId trouvé
    if (userEmail && !where.userId) {
      where.customerEmail = userEmail.toLowerCase()
    } else if (userEmail) {
      // Chercher aussi par email en plus du userId
      where.OR = [
        { userId: where.userId },
        { customerEmail: userEmail.toLowerCase() }
      ]
      delete where.userId
    }

    console.log(`🔍 [listOrdersByUser] Requête where:`, JSON.stringify(where, null, 2))

    const orders = await prisma.order.findMany({
      where,
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`📊 [listOrdersByUser] ${orders.length} commande(s) trouvée(s) pour userId: "${userId}", email: "${userEmail}"`)
    if (orders.length > 0) {
      console.log(`📋 [listOrdersByUser] Exemples d'IDs de commandes:`, orders.slice(0, 3).map(o => o.id))
    }
    return orders.map(prismaOrderToRecord)
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération des commandes utilisateur:', error)
    console.error('❌ Détails:', error.message, error.stack)
    return []
  }
}

export async function getOrderById(orderId: string): Promise<OrderRecord | null> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } }
    })
    return order ? prismaOrderToRecord(order) : null
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération de la commande:', error)
    return null
  }
}

export async function fetchOrders(): Promise<OrderRecord[]> {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    })
    return orders.map(prismaOrderToRecord)
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération des commandes:', error)
    return []
  }
}

export async function deleteOrder(orderId: string): Promise<boolean> {
  try {
    await prisma.order.delete({
      where: { id: orderId }
    })
    return true
  } catch (error: any) {
    console.error('❌ Erreur suppression commande:', error)
    return false
  }
}

// Fonction de compatibilité pour readOrdersMap (utilisée par admin)
export async function readOrdersMap(): Promise<Record<string, OrderRecord>> {
  const orders = await fetchOrders()
  return orders.reduce((acc, order) => {
    acc[order.id] = order
    return acc
  }, {} as Record<string, OrderRecord>)
}
