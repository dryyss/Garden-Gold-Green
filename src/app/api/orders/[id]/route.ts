import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { getOrderById, upsertOrder, deleteOrder } from '@/lib/orders-store'

function isAuthorizedFromAction(request: NextRequest): boolean {
  const header = request.headers.get('authorization') || ''
  const secret = process.env.AUTH0_ACTION_WEBHOOK_SECRET
  if (!secret) return false
  return header === `Bearer ${secret}`
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth0.getSession(request)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const userId = session.user.sub
    const { id: orderId } = await params

    const order = await getOrderById(orderId)

    if (!order || order.userId !== userId) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      order,
    })

  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth0.getSession(request)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const userId = session.user.sub
    const { id: orderId } = await params
    const body = await request.json()
    const { status, deliveredAt } = body

    const existingOrder = await getOrderById(orderId)

    if (!existingOrder || existingOrder.userId !== userId) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      )
    }

    const updated = await upsertOrder({
      ...existingOrder,
      status: status || existingOrder.status,
      deliveredAt: deliveredAt || existingOrder.deliveredAt,
    })

    return NextResponse.json({
      success: true,
      order: updated,
    })

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    // Suppression stricte: requiert le secret de l'Action Auth0
    if (!isAuthorizedFromAction(request)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const ok = await deleteOrder(id)
    if (!ok) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
