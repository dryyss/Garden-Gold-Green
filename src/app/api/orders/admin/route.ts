import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-utils'
import {
  OrderRecord,
  ShippingHistoryEntry,
  readOrdersMap,
  upsertOrder,
} from '@/lib/orders-store'
import { sendOrderShippedEmail } from '@/lib/email'

function filterOrders(
  orders: OrderRecord[],
  {
    status,
    search,
  }: { status?: string | null; search?: string | null }
): OrderRecord[] {
  return orders.filter(order => {
    const statusOk = status ? order.status === status : true
    if (!statusOk) return false
    if (!search) return true

    const lower = search.toLowerCase()
    const matchesId = order.id.toLowerCase().includes(lower)
    const matchesEmail = order.customerEmail?.toLowerCase().includes(lower)
    const matchesName = order.customerName?.toLowerCase().includes(lower)
    return matchesId || matchesEmail || matchesName
  })
}

function paginate<T>(items: T[], page: number, limit: number) {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const currentPage = Math.min(Math.max(page, 1), totalPages)
  const start = (currentPage - 1) * limit
  const end = start + limit
  return {
    entries: items.slice(start, end),
    pagination: {
      page: currentPage,
      limit,
      total,
      totalPages,
    },
  }
}

export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    const map = await readOrdersMap()
    const allOrders = Object.values(map).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    const filtered = filterOrders(allOrders, { status, search })
    const { entries, pagination } = paginate(filtered, page, limit)

    return NextResponse.json({
      success: true,
      orders: entries,
      pagination,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes admin:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
})

export const PATCH = requireAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const {
      orderId,
      status,
      deliveredAt,
      shippedAt,
      trackingNumber,
      carrier,
      carrierTrackingUrl,
      shippingStatus,
      estimatedDeliveryDate,
      shippingHistory,
      shippingHistoryEntry,
    } = body

    if (!orderId) {
      return NextResponse.json(
        { error: 'ID de commande requis' },
        { status: 400 }
      )
    }

    const map = await readOrdersMap()
    const existing = map[orderId]

    if (!existing) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      )
    }

    const previousStatus = existing.status

    let history: ShippingHistoryEntry[] = existing.shippingHistory
      ? [...existing.shippingHistory]
      : []

    if (Array.isArray(shippingHistory)) {
      history = shippingHistory
        .filter((entry: ShippingHistoryEntry) => entry && entry.date && entry.status)
        .map(entry => ({
          date: entry.date,
          status: entry.status,
          message: entry.message,
        }))
    }

    if (shippingHistoryEntry && shippingHistoryEntry.status) {
      history = [
        ...history,
        {
          date: shippingHistoryEntry.date || new Date().toISOString(),
          status: shippingHistoryEntry.status,
          message: shippingHistoryEntry.message,
        },
      ]
    }

    history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const updated = await upsertOrder({
      ...existing,
      id: orderId,
      status: status ?? existing.status,
      deliveredAt: deliveredAt ?? existing.deliveredAt,
      shippedAt: shippedAt ?? existing.shippedAt,
      trackingNumber: trackingNumber ?? existing.trackingNumber ?? null,
      carrier: carrier ?? existing.carrier ?? null,
      carrierTrackingUrl: carrierTrackingUrl ?? existing.carrierTrackingUrl ?? null,
      shippingStatus: shippingStatus ?? existing.shippingStatus ?? null,
      estimatedDeliveryDate: estimatedDeliveryDate ?? existing.estimatedDeliveryDate ?? null,
      shippingHistory: history,
    })

    if (
      updated.status === 'shipped' &&
      previousStatus !== 'shipped' &&
      updated.customerEmail
    ) {
      try {
        await sendOrderShippedEmail({
          email: updated.customerEmail,
          orderId: updated.id,
          trackingNumber: updated.trackingNumber || '',
          customerName: updated.customerName || 'Client',
          trackOrderUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://gardengoldgreen.com'}/track-order?orderId=${encodeURIComponent(
            updated.id
          )}&email=${encodeURIComponent(updated.customerEmail)}`,
        })
      } catch (emailError) {
        console.error('⚠️ Erreur envoi email expédition:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      order: updated,
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande admin:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
})

