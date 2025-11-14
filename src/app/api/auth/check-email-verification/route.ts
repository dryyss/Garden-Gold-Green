import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { getAuth0User } from '@/lib/auth0-management'

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession(request)

    if (!session?.user?.sub) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      )
    }

    const userId = session.user.sub

    let auth0User: Awaited<ReturnType<typeof getAuth0User>> | null = null
    try {
      auth0User = await getAuth0User(userId)
    } catch (error) {
      console.error('❌ Impossible de récupérer les informations Auth0:', error)
      return NextResponse.json(
        { error: 'Impossible de vérifier votre compte' },
        { status: 500 }
      )
    }

    const emailVerified = Boolean(
      auth0User?.email_verified ?? (session.user as any).email_verified ?? false
    )
    const userEmail = auth0User?.email || session.user.email || null

    return NextResponse.json({
      emailVerified,
      email: userEmail,
    })
  } catch (error) {
    console.error('❌ Erreur vérification email:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la vérification de l\'email' },
      { status: 500 }
    )
  }
}

