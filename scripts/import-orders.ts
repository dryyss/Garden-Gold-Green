import { promises as fs } from 'fs'
import path from 'path'
import {
  upsertOrder,
  type OrderRecord,
  type ShippingHistoryEntry,
  type OrderShippingInfo,
} from '../src/lib/orders-store'
import { prisma } from '../src/lib/prisma'

interface LegacyOrderRecord extends Omit<Partial<OrderRecord>, 'paymentIntentId'> {
  id: string
  items: Array<{
    productId: string
    name: string
    quantity: number
    priceCents: number
    image?: string
  }>
  paymentIntentId?: string | { id?: string }
  shippingStatus?: string | null
  carrier?: string | null
  carrierTrackingUrl?: string | null
  shippedAt?: string | null
  estimatedDeliveryDate?: string | null
  shippingHistory?: ShippingHistoryEntry[]
  shippingInfo?: OrderShippingInfo | null
}

function ensureIso(value: unknown): string | undefined {
  if (!value) return undefined
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString()
  }
  if (typeof value === 'string') {
    const date = new Date(value)
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString()
    }
  }
  return undefined
}

function normalizeOrder(raw: LegacyOrderRecord): OrderRecord {
  const paymentIntentId =
    typeof raw.paymentIntentId === 'string'
      ? raw.paymentIntentId
      : raw.paymentIntentId && typeof raw.paymentIntentId === 'object'
        ? raw.paymentIntentId.id ?? undefined
        : raw.paymentIntentId ?? undefined

  const shippingInfo: OrderShippingInfo | null =
    raw.shippingInfo ??
    (() => {
      const info: OrderShippingInfo = {
        carrier: raw.carrier ?? null,
        trackingNumber: raw.trackingNumber ?? null,
        trackingUrl: raw.carrierTrackingUrl ?? null,
        status: raw.shippingStatus ?? null,
        shippedAt: ensureIso(raw.shippedAt) ?? null,
        deliveredAt: ensureIso(raw.deliveredAt) ?? null,
        estimatedDeliveryDate: ensureIso(raw.estimatedDeliveryDate) ?? null,
        history: raw.shippingHistory && raw.shippingHistory.length > 0 ? raw.shippingHistory : undefined,
      }

      const hasData = Object.values(info).some(value => {
        if (Array.isArray(value)) return value.length > 0
        return value !== undefined && value !== null
      })

      return hasData ? info : null
    })()

  return {
    id: raw.id,
    userId: raw.userId ?? null,
    status: raw.status ?? 'pending',
    totalCents: raw.totalCents ?? 0,
    currency: raw.currency ?? 'EUR',
    items: raw.items ?? [],
    createdAt: ensureIso(raw.createdAt) ?? new Date().toISOString(),
    updatedAt: ensureIso(raw.updatedAt) ?? new Date().toISOString(),
    deliveredAt: ensureIso(raw.deliveredAt) ?? null,
    subtotalCents: raw.subtotalCents ?? null,
    shippingCents: raw.shippingCents ?? null,
    taxCents: raw.taxCents ?? null,
    discountCents: raw.discountCents ?? null,
    customerEmail: raw.customerEmail,
    customerName: raw.customerName,
    customerPhone: raw.customerPhone,
    shippingAddress: raw.shippingAddress,
    billingAddress: raw.billingAddress,
    stripeSessionId: raw.stripeSessionId,
    paymentIntentId: paymentIntentId ?? undefined,
    receiptUrl: raw.receiptUrl ?? null,
    invoicePdf: raw.invoicePdf ?? null,
    trackingNumber: raw.trackingNumber ?? null,
    carrier: raw.carrier ?? null,
    carrierTrackingUrl: raw.carrierTrackingUrl ?? null,
    shippingStatus: raw.shippingStatus ?? null,
    shippedAt: ensureIso(raw.shippedAt) ?? null,
    estimatedDeliveryDate: ensureIso(raw.estimatedDeliveryDate) ?? null,
    shippingHistory: raw.shippingHistory ?? [],
    shippingInfo,
    metadata: raw.metadata ?? {},
  }
}

async function main() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'orders.json')
  const rawFile = await fs.readFile(filePath, 'utf8')
  const parsed = JSON.parse(rawFile) as Record<string, LegacyOrderRecord>
  const entries = Object.values(parsed)

  console.log(`📦 Import de ${entries.length} commandes depuis orders.json…`)

  for (const [index, legacy] of entries.entries()) {
    const normalized = normalizeOrder(legacy)

    await upsertOrder({
      ...normalized,
    })

    console.log(`  ➜ Commande ${normalized.id} importée (${index + 1}/${entries.length})`)
  }

  console.log('✅ Import terminé.')
}

main()
  .catch(error => {
    console.error('❌ Erreur import commandes:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

