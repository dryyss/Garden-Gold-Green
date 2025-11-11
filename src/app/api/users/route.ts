import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { auth0 } from '@/lib/auth0'
import { listUsers, upsertUser, getUserById } from '@/lib/users-store'

export const runtime = 'nodejs'

function isAuthorizedFromAction(request: NextRequest): boolean {
  const header = request.headers.get('authorization') || ''
  const secret = process.env.AUTH0_ACTION_WEBHOOK_SECRET
  if (!secret) return false
  const expected = `Bearer ${secret}`
  return header === expected
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession(request)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }
    const users = await listUsers()
    return NextResponse.json({ users })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur' }, { status: 500 })
  }
}

/**
 * POST /api/users
 * Utilisé par l'Action Auth0 post-registration (webhook) pour injecter l'utilisateur
 * Body attendu (exemples potentiels d'Auth0):
 * {
 *   "user_id": "auth0|123", "sub": "auth0|123",
 *   "email": "user@example.com", "name": "John Doe"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Sécurisation: requiert le secret d'Action Auth0
    if (!isAuthorizedFromAction(request)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const auth0UserId: string | undefined = body.user_id || body.sub
    const email: string | undefined = body.email
    const name: string | undefined = body.name || body.nickname

    if (!auth0UserId) {
      return NextResponse.json({ error: 'user_id/sub manquant' }, { status: 400 })
    }

    const existing = await getUserById(auth0UserId)
    if (existing?.stripeCustomerId) {
      // Déjà injecté
      return NextResponse.json({ user: existing })
    }

    // Créer/assurer le client Stripe
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: { auth0UserId },
    })

    const saved = await upsertUser({
      id: auth0UserId,
      email,
      name,
      stripeCustomerId: customer.id,
    })

    return NextResponse.json({ user: saved }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur' }, { status: 500 })
  }
}



