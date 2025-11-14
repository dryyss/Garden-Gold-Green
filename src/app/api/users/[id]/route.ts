import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { deleteUser, getUserById, upsertUser } from '@/lib/users-store'

export const runtime = 'nodejs'

function isAuthorizedFromAction(request: NextRequest): boolean {
  const header = request.headers.get('authorization') || ''
  const secret = process.env.AUTH0_ACTION_WEBHOOK_SECRET
  if (!secret) return false
  const expected = `Bearer ${secret}`
  return header === expected
}

async function isOwner(request: NextRequest, userId: string): Promise<boolean> {
  try {
    const session = await auth0.getSession(request)
    const sub = session?.user?.sub
    return !!sub && sub === userId
  } catch {
    return false
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const allowed = (await isOwner(request, id)) || isAuthorizedFromAction(request)
    if (!allowed) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const user = await getUserById(id)
    if (!user) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    return NextResponse.json({ user })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const isAction = isAuthorizedFromAction(request)
    const allowed = (await isOwner(request, id)) || isAction
    if (!allowed) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const body = await request.json()
    const { email, name, stripeCustomerId } = body || {}

    // Par sécurité, la mise à jour du stripeCustomerId n'est permise que via l'Action (webhook)
    if (stripeCustomerId && !isAction) {
      return NextResponse.json({ error: 'Mise à jour stripeCustomerId non autorisée' }, { status: 403 })
    }

    const saved = await upsertUser({
      id,
      email,
      name,
      stripeCustomerId,
    })
    return NextResponse.json({ user: saved })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur' }, { status: 500 })
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
    const ok = await deleteUser(id)
    if (!ok) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur' }, { status: 500 })
  }
}



