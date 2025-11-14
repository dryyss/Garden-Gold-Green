import { promises as fs } from 'fs'
import path from 'path'
// Import initial pour fallback seulement, ne pas utiliser directement
import initialOrdersData from '@/data/orders.json'

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

type OrdersMap = Record<string, OrderRecord>

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

const ordersFilePath = path.join(process.cwd(), 'src', 'data', 'orders.json')

async function ensureOrdersFile(): Promise<void> {
  try {
    await fs.access(ordersFilePath)
  } catch {
    const dir = path.dirname(ordersFilePath)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(ordersFilePath, JSON.stringify({}, null, 2), 'utf8')
  }
}

async function readOrdersMap(): Promise<OrdersMap> {
  await ensureOrdersFile()
  try {
    const raw = await fs.readFile(ordersFilePath, 'utf8')
    const parsed = JSON.parse(raw)
    // Toujours retourner les données du fichier si c'est un objet valide
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as OrdersMap
    }
    // Si le fichier contient un tableau ou autre chose, retourner un objet vide
    console.warn('⚠️ orders.json contient un format invalide (tableau au lieu d\'objet), retour d\'un objet vide')
    return {}
  } catch (error) {
    console.error('❌ Erreur lecture orders.json:', error)
    // En cas d'erreur, essayer de retourner les données depuis l'import initial comme fallback
    // Mais seulement si c'est un objet, pas un tableau
    if (initialOrdersData && typeof initialOrdersData === 'object' && !Array.isArray(initialOrdersData)) {
      return initialOrdersData as OrdersMap
    }
    // Sinon, retourner un objet vide
    return {}
  }
}

async function writeOrdersMap(orders: OrdersMap): Promise<void> {
  try {
    await ensureOrdersFile()
    const content = JSON.stringify(orders, null, 2)
    console.log(`📝 Écriture dans ${ordersFilePath}...`)
    console.log(`📊 Nombre de commandes à écrire: ${Object.keys(orders).length}`)
    await fs.writeFile(ordersFilePath, content, 'utf8')
    console.log(`✅ orders.json mis à jour avec succès: ${Object.keys(orders).length} commande(s)`)
    
    // Vérifier que le fichier a bien été écrit
    const verifyContent = await fs.readFile(ordersFilePath, 'utf8')
    const verifyParsed = JSON.parse(verifyContent)
    console.log(`✅ Vérification: fichier contient ${Object.keys(verifyParsed).length} commande(s)`)
  } catch (error: any) {
    console.error(`❌ Erreur lors de l'écriture dans ${ordersFilePath}:`, error)
    console.error(`❌ Détails de l'erreur:`, error.message)
    console.error(`❌ Stack trace:`, error.stack)
    throw error
  }
}

function ensureIsoString(value: unknown): string | null {
  if (typeof value === 'string') {
    const date = new Date(value)
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString()
    }
    return null
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString()
  }
  return null
}

function normalizeShippingHistory(value: unknown): ShippingHistoryEntry[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map(entry => {
      if (!entry || typeof entry !== 'object') return null
      const obj = entry as Record<string, unknown>
      const status = typeof obj.status === 'string' ? obj.status : null
      const note =
        typeof obj.message === 'string'
          ? obj.message
          : typeof obj.note === 'string'
            ? obj.note
            : undefined
      const date =
        ensureIsoString(obj.date) ??
        ensureIsoString(obj.occurredAt) ??
        ensureIsoString(obj.createdAt)

      if (!status || !date) {
        return null
      }

      return {
        status,
        date,
        message: note,
      }
    })
    .filter((entry): entry is ShippingHistoryEntry => entry !== null)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

function normalizeShippingInfo(value: any): OrderShippingInfo | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }
  const raw = value as Record<string, unknown>
  const history = normalizeShippingHistory(raw.history)

  const shippingInfo: OrderShippingInfo = {
    carrier: typeof raw.carrier === 'string' ? raw.carrier : null,
    trackingNumber: typeof raw.trackingNumber === 'string' ? raw.trackingNumber : null,
    trackingUrl:
      typeof raw.trackingUrl === 'string'
        ? raw.trackingUrl
        : typeof raw.url === 'string'
          ? raw.url
          : null,
    status: typeof raw.status === 'string' ? raw.status : null,
    shippedAt: ensureIsoString(raw.shippedAt) ?? undefined,
    deliveredAt: ensureIsoString(raw.deliveredAt) ?? undefined,
    estimatedDeliveryDate: ensureIsoString(raw.estimatedDeliveryDate) ?? undefined,
    history: history.length > 0 ? history : undefined,
  }

  const hasData = Object.values(shippingInfo).some(value => {
    if (Array.isArray(value)) return value.length > 0
    return value !== undefined && value !== null
  })

  return hasData ? shippingInfo : null
}

function toShippingInfoPayload(
  existing: OrderShippingInfo | null,
  update: Partial<OrderRecord>
): OrderShippingInfo | null {
  if (!existing && !update.shippingInfo && !update.trackingNumber && !update.carrier) {
    return {
      history: [
        {
          date: new Date().toISOString(),
          status: 'Commande créée',
          message: 'Votre commande a été enregistrée et est en attente de traitement.',
        },
      ],
    }
  }

  const base: OrderShippingInfo = existing ? { ...existing } : {}

  const mergeInfo = (info?: OrderShippingInfo | null) => {
    if (!info) return
    if (info.carrier !== undefined) base.carrier = info.carrier
    if (info.trackingNumber !== undefined) base.trackingNumber = info.trackingNumber
    if (info.trackingUrl !== undefined) base.trackingUrl = info.trackingUrl
    if (info.status !== undefined) base.status = info.status
    if (info.shippedAt !== undefined) base.shippedAt = ensureIsoString(info.shippedAt) ?? undefined
    if (info.deliveredAt !== undefined) base.deliveredAt = ensureIsoString(info.deliveredAt) ?? undefined
    if (info.estimatedDeliveryDate !== undefined) {
      base.estimatedDeliveryDate = ensureIsoString(info.estimatedDeliveryDate) ?? undefined
    }
    if (info.history) {
      base.history = normalizeShippingHistory(info.history)
    }
  }

  mergeInfo(update.shippingInfo)

  if (update.carrier !== undefined) {
    base.carrier = update.carrier
  }
  if (update.trackingNumber !== undefined) {
    base.trackingNumber = update.trackingNumber
  }
  if (update.carrierTrackingUrl !== undefined) {
    base.trackingUrl = update.carrierTrackingUrl
  }
  if (update.shippingStatus !== undefined) {
    base.status = update.shippingStatus
  }
  if (update.shippedAt !== undefined) {
    base.shippedAt = ensureIsoString(update.shippedAt) ?? undefined
  }
  if (update.deliveredAt !== undefined) {
    base.deliveredAt = ensureIsoString(update.deliveredAt) ?? undefined
  }
  if (update.estimatedDeliveryDate !== undefined) {
    base.estimatedDeliveryDate = ensureIsoString(update.estimatedDeliveryDate) ?? undefined
  }
  if (update.shippingHistory !== undefined) {
    base.history = normalizeShippingHistory(update.shippingHistory)
  }

  const hasData = Object.values(base).some(value => {
    if (Array.isArray(value)) return value.length > 0
    return value !== undefined && value !== null
  })

  return hasData ? base : null
}

export async function upsertOrder(
  order: Omit<OrderRecord, 'createdAt' | 'updatedAt'> & Partial<OrderRecord>
): Promise<OrderRecord> {
  const orders = await readOrdersMap()
  const existing = orders[order.id]
  const now = new Date().toISOString()
  
  const shippingInfo = toShippingInfoPayload(
    existing?.shippingInfo ?? null,
    order
  )

  const next: OrderRecord = {
    id: order.id,
    userId: order.userId ?? existing?.userId ?? null,
    status: order.status ?? existing?.status ?? 'pending',
    totalCents: order.totalCents ?? existing?.totalCents ?? 0,
    currency: order.currency ?? existing?.currency ?? 'EUR',
    items: order.items ?? existing?.items ?? [],
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    deliveredAt: order.deliveredAt !== undefined ? (order.deliveredAt ? ensureIsoString(order.deliveredAt) : null) : existing?.deliveredAt ?? null,
    subtotalCents: order.subtotalCents ?? existing?.subtotalCents ?? null,
    shippingCents: order.shippingCents ?? existing?.shippingCents ?? null,
    taxCents: order.taxCents ?? existing?.taxCents ?? null,
    discountCents: order.discountCents ?? existing?.discountCents ?? null,
    customerEmail: order.customerEmail ?? existing?.customerEmail,
    customerName: order.customerName ?? existing?.customerName,
    customerPhone: order.customerPhone ?? existing?.customerPhone,
    shippingAddress: order.shippingAddress ?? existing?.shippingAddress,
    billingAddress: order.billingAddress ?? existing?.billingAddress,
    stripeSessionId: order.stripeSessionId ?? existing?.stripeSessionId,
    paymentIntentId: typeof order.paymentIntentId === 'string' 
      ? order.paymentIntentId 
      : (typeof order.paymentIntentId === 'object' && order.paymentIntentId !== null 
        ? (order.paymentIntentId as any).id || JSON.stringify(order.paymentIntentId)
        : existing?.paymentIntentId),
    receiptUrl: order.receiptUrl ?? existing?.receiptUrl ?? null,
    invoicePdf: order.invoicePdf ?? existing?.invoicePdf ?? null,
    trackingNumber: shippingInfo?.trackingNumber ?? order.trackingNumber ?? existing?.trackingNumber ?? null,
    carrier: shippingInfo?.carrier ?? order.carrier ?? existing?.carrier ?? null,
    carrierTrackingUrl: shippingInfo?.trackingUrl ?? order.carrierTrackingUrl ?? existing?.carrierTrackingUrl ?? null,
    shippingStatus: shippingInfo?.status ?? order.shippingStatus ?? existing?.shippingStatus ?? null,
    shippedAt: shippingInfo?.shippedAt ?? order.shippedAt ?? existing?.shippedAt ?? null,
    estimatedDeliveryDate: shippingInfo?.estimatedDeliveryDate ?? order.estimatedDeliveryDate ?? existing?.estimatedDeliveryDate ?? null,
    shippingHistory: shippingInfo?.history ?? order.shippingHistory ?? existing?.shippingHistory,
    shippingInfo,
    metadata: order.metadata ?? existing?.metadata,
  }

  orders[order.id] = next
  console.log(`📝 Sauvegarde commande ${order.id} dans orders.json...`)
  console.log(`📦 Commande à sauvegarder:`, JSON.stringify(next, null, 2))
  try {
    await writeOrdersMap(orders)
    console.log(`✅ Commande ${order.id} sauvegardée avec succès dans ${ordersFilePath}`)
  } catch (error: any) {
    console.error(`❌ ERREUR lors de la sauvegarde de la commande ${order.id}:`, error)
    throw error
  }
  return next
}

export async function listOrdersByUser(userId: string, userEmail?: string): Promise<OrderRecord[]> {
  try {
    const orders = await readOrdersMap()
    const ordersArray = Object.values(orders)
    
    console.log(`🔍 Recherche commandes pour userId: "${userId}", email: "${userEmail}"`)
    console.log(`📦 Total commandes dans orders.json: ${ordersArray.length}`)
    
    // Filtrer par userId OU par email
    const filtered = ordersArray.filter(order => {
      const matchesUserId = order.userId === userId
      const matchesEmail = userEmail 
        ? order.customerEmail?.toLowerCase() === userEmail.toLowerCase()
        : false
      
      if (matchesUserId || matchesEmail) {
        console.log(`✅ Commande trouvée: ${order.id} (userId: "${order.userId}", email: "${order.customerEmail}")`)
      }
      
      return matchesUserId || matchesEmail
    })

    console.log(`📊 Commandes trouvées: ${filtered.length}`)

    // Trier par date de création (plus récent en premier)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération des commandes utilisateur:', error)
    return []
  }
}

export async function getOrderById(orderId: string): Promise<OrderRecord | null> {
  try {
    const orders = await readOrdersMap()
    return orders[orderId] || null
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération de la commande:', error)
    return null
  }
}

export async function fetchOrders(): Promise<OrderRecord[]> {
  try {
    const orders = await readOrdersMap()
    const ordersArray = Object.values(orders)
    
    // Trier par date de création (plus récent en premier)
    return ordersArray.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération des commandes:', error)
    return []
  }
}

export { readOrdersMap }

export async function deleteOrder(orderId: string): Promise<boolean> {
  try {
    const orders = await readOrdersMap()
    if (!orders[orderId]) return false
    delete orders[orderId]
    await writeOrdersMap(orders)
    return true
  } catch (error: any) {
    console.error('❌ Erreur suppression commande:', error)
    return false
  }
}
