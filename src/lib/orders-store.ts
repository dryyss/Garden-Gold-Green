import { promises as fs } from 'fs'
import path from 'path'

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

export async function readOrdersMap(): Promise<OrdersMap> {
  await ensureOrdersFile()
  try {
    const raw = await fs.readFile(ordersFilePath, 'utf8')
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? (parsed as OrdersMap) : {}
  } catch {
    return {}
  }
}

export async function writeOrdersMap(orders: OrdersMap): Promise<void> {
  await ensureOrdersFile()
  await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), 'utf8')
}

export async function saveOrder(order: OrderRecord): Promise<OrderRecord> {
  const map = await readOrdersMap()
  map[order.id] = order
  await writeOrdersMap(map)
  return order
}

export async function upsertOrder(
  order: Omit<OrderRecord, 'createdAt' | 'updatedAt'> & Partial<OrderRecord>
): Promise<OrderRecord> {
  const map = await readOrdersMap()
  const existing = map[order.id]
  const now = new Date().toISOString()
  const record: OrderRecord = {
    id: order.id,
    userId: order.userId ?? existing?.userId ?? null,
    status: order.status ?? existing?.status ?? 'pending',
    totalCents: order.totalCents ?? existing?.totalCents ?? 0,
    currency: order.currency ?? existing?.currency ?? 'EUR',
    items: order.items ?? existing?.items ?? [],
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    deliveredAt:
      order.deliveredAt !== undefined ? order.deliveredAt : existing?.deliveredAt,
    subtotalCents:
      order.subtotalCents !== undefined
        ? order.subtotalCents
        : existing?.subtotalCents ?? null,
    shippingCents:
      order.shippingCents !== undefined
        ? order.shippingCents
        : existing?.shippingCents ?? null,
    taxCents:
      order.taxCents !== undefined ? order.taxCents : existing?.taxCents ?? null,
    discountCents:
      order.discountCents !== undefined
        ? order.discountCents
        : existing?.discountCents ?? null,
    customerEmail: order.customerEmail ?? existing?.customerEmail,
    customerName: order.customerName ?? existing?.customerName,
    customerPhone: order.customerPhone ?? existing?.customerPhone,
    shippingAddress: order.shippingAddress ?? existing?.shippingAddress,
    billingAddress: order.billingAddress ?? existing?.billingAddress,
    stripeSessionId: order.stripeSessionId ?? existing?.stripeSessionId,
    paymentIntentId: order.paymentIntentId ?? existing?.paymentIntentId,
    receiptUrl: order.receiptUrl ?? existing?.receiptUrl,
    invoicePdf: order.invoicePdf ?? existing?.invoicePdf,
    trackingNumber:
      order.trackingNumber !== undefined
        ? order.trackingNumber
        : existing?.trackingNumber ?? null,
    carrier:
      order.carrier !== undefined ? order.carrier : existing?.carrier ?? null,
    carrierTrackingUrl:
      order.carrierTrackingUrl !== undefined
        ? order.carrierTrackingUrl
        : existing?.carrierTrackingUrl ?? null,
    shippingStatus:
      order.shippingStatus !== undefined
        ? order.shippingStatus
        : existing?.shippingStatus ?? null,
    shippedAt:
      order.shippedAt !== undefined ? order.shippedAt : existing?.shippedAt ?? null,
    estimatedDeliveryDate:
      order.estimatedDeliveryDate !== undefined
        ? order.estimatedDeliveryDate
        : existing?.estimatedDeliveryDate ?? null,
    shippingHistory: order.shippingHistory
      ? [...order.shippingHistory]
      : existing?.shippingHistory
        ? [...existing.shippingHistory]
        : [],
    metadata: {
      ...(existing?.metadata || {}),
      ...(order.metadata || {}),
    },
  }
  map[order.id] = record
  await writeOrdersMap(map)
  return record
}

export async function listOrdersByUser(userId: string): Promise<OrderRecord[]> {
  const map = await readOrdersMap()
  return Object.values(map)
    .filter(order => order.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getOrderById(orderId: string): Promise<OrderRecord | null> {
  const map = await readOrdersMap()
  return map[orderId] ?? null
}

export async function deleteOrder(orderId: string): Promise<boolean> {
  const map = await readOrdersMap()
  if (!map[orderId]) return false
  delete map[orderId]
  await writeOrdersMap(map)
  return true
}
