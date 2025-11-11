import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { auth0 } from '@/lib/auth0'
import { getUserById, upsertUser } from '@/lib/users-store'

export const runtime = 'nodejs'

const STRIPE_PORTAL_SECTIONS = new Set(['purchase-history', 'payment-methods', 'invoices', 'subscriptions'])

export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession(request)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }
    const userId = session.user.sub
    const user = await getUserById(userId)

    let stripeCustomerId = user?.stripeCustomerId
    // Si l'utilisateur n'existe pas encore dans le JSON (ou sans stripeId), on le crée maintenant
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name || session.user.nickname,
        metadata: { auth0UserId: userId },
      })
      const saved = await upsertUser({
        id: userId,
        email: session.user.email,
        name: session.user.name || session.user.nickname,
        stripeCustomerId: customer.id,
      })
      stripeCustomerId = saved.stripeCustomerId
    }

    const returnUrl =
      process.env.STRIPE_PORTAL_RETURN_URL ||
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/profile`

    const portal = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId!,
      return_url: returnUrl,
    })

    return NextResponse.json({ url: portal.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur' }, { status: 500 })
  }
}


