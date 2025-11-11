import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { readOrdersMap } from '@/lib/orders-store'

export async function POST(request: NextRequest) {
  try {
    // Contournement temporaire pour tests
    const bypassAuth = process.env.BYPASS_ADMIN_SECURITY !== 'false'
    
    let sessionUserId: string | null = null
    
    if (!bypassAuth) {
      const session = await auth0.getSession(request)
      
      if (!session?.user) {
        return NextResponse.json(
          { error: 'Non authentifié' },
          { status: 401 }
        )
      }
      sessionUserId = session.user.sub
    }

    const body = await request.json().catch(() => ({}))
    const { lastChecked, userId: requestedUserId } = body as {
      lastChecked?: string | null
      userId?: unknown
    }
    const bodyUserId =
      typeof requestedUserId === 'string' && requestedUserId.trim().length > 0
        ? requestedUserId
        : null

    const effectiveUserId = sessionUserId ?? bodyUserId ?? null

    const lastCheckedDate =
      typeof lastChecked === 'string' && !Number.isNaN(Date.parse(lastChecked))
        ? new Date(lastChecked)
        : null

    let orders = Object.values(await readOrdersMap())

    if (effectiveUserId) {
      orders = orders.filter(order => order.userId === effectiveUserId)
    }

    if (lastCheckedDate) {
      const lastCheckedTime = lastCheckedDate.getTime()
      orders = orders.filter(order => {
        const updatedTime = new Date(order.updatedAt).getTime()
        return !Number.isNaN(updatedTime) && updatedTime > lastCheckedTime
      })
    }

    orders.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )

    const limitedOrders = orders.slice(0, 50)

    return NextResponse.json({
      success: true,
      updates: limitedOrders.map(order => ({
        id: order.id,
        status: order.status,
        updatedAt: (() => {
          const parsedDate = new Date(order.updatedAt)
          if (Number.isNaN(parsedDate.getTime())) {
            return new Date().toISOString()
          }
          return parsedDate.toISOString()
        })()
      }))
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des mises à jour:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

