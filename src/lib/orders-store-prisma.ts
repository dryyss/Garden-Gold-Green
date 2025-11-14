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

export interface CartItemPayload {
  id?: string
  name?: string
  price?: number
  priceCents?: number
  quantity?: number
  image?: string
  i?: string
  q?: number
  pc?: number
}

// Convertir Prisma Order vers OrderRecord
function prismaOrderToRecord(order: any): OrderRecord {
  const shippingInfo = order.shippingInfo as OrderShippingInfo | null

  return {
    id: order.id,
    userId: order.userId,
    status: order.status,
    totalCents: order.totalCents,
    currency: order.currency,
    items: order.items.map((item: any) => ({
      productId: item.productId,
      name: item.name,
      priceCents: item.priceCents,
      quantity: item.quantity,
      image: item.product?.images ? JSON.parse(item.product.images)[0] : undefined
    })),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
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
    trackingNumber: shippingInfo?.trackingNumber || null,
    carrier: shippingInfo?.carrier || null,
    carrierTrackingUrl: shippingInfo?.trackingUrl || null,
    shippingStatus: shippingInfo?.status || null,
    shippedAt: shippingInfo?.shippedAt || null,
    estimatedDeliveryDate: shippingInfo?.estimatedDeliveryDate || null,
    shippingHistory: shippingInfo?.history,
    shippingInfo: shippingInfo,
    metadata: order.metadata as Record<string, unknown> || undefined
  }
}

export async function upsertOrder(
  order: Omit<OrderRecord, 'createdAt' | 'updatedAt'> & Partial<OrderRecord>
): Promise<OrderRecord> {
  try {
    const existing = await prisma.order.findUnique({
      where: { id: order.id },
      include: { items: { include: { product: true } } }
    })

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

    const orderData: any = {
      userId: order.userId ?? existing?.userId ?? null,
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
      result = await prisma.order.create({
        data: {
          ...orderData,
          id: order.id,
          items: {
            create: order.items.map(item => ({
              productId: item.productId,
              name: item.name,
              priceCents: item.priceCents,
              quantity: item.quantity,
              status: 'ordered'
            }))
          }
        },
        include: { items: { include: { product: true } } }
      })
    }

    console.log(`✅ Commande ${order.id} sauvegardée dans Prisma`)
    return prismaOrderToRecord(result)
  } catch (error: any) {
    console.error(`❌ ERREUR lors de la sauvegarde de la commande ${order.id}:`, error)
    throw error
  }
}

export async function listOrdersByUser(userId: string, userEmail?: string): Promise<OrderRecord[]> {
  try {
    const where: any = {}
    
    // Si userId est un auth0Id, chercher l'utilisateur
    if (userId.startsWith('auth0|') || userId.startsWith('google-oauth2|')) {
      const user = await prisma.user.findUnique({
        where: { auth0Id: userId }
      })
      if (user) {
        where.userId = user.id
      } else if (userEmail) {
        // Fallback: chercher par email
        const userByEmail = await prisma.user.findUnique({
          where: { email: userEmail }
        })
        if (userByEmail) {
          where.userId = userByEmail.id
        } else {
          // Si pas d'utilisateur, chercher par email dans customerEmail
          where.customerEmail = userEmail
        }
      } else {
        where.customerEmail = null // Pas de résultats
      }
    } else {
      where.userId = userId
    }

    // Si userEmail est fourni et pas de userId trouvé, chercher par email
    if (userEmail && !where.userId) {
      where.OR = [
        { customerEmail: userEmail },
        { userId: { in: await prisma.user.findMany({ where: { email: userEmail } }).then(users => users.map(u => u.id)) } }
      ]
    }

    const orders = await prisma.order.findMany({
      where,
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`📊 ${orders.length} commande(s) trouvée(s) pour userId: "${userId}", email: "${userEmail}"`)
    return orders.map(prismaOrderToRecord)
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération des commandes utilisateur:', error)
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

// Fonction de compatibilité (non utilisée avec Prisma)
export async function readOrdersMap(): Promise<Record<string, OrderRecord>> {
  const orders = await fetchOrders()
  return orders.reduce((acc, order) => {
    acc[order.id] = order
    return acc
  }, {} as Record<string, OrderRecord>)
}

