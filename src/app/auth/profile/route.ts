import { auth0 } from '@/lib/auth0'
import { NextRequest, NextResponse } from 'next/server'

// Route pour récupérer le profil utilisateur
// Redirige vers l'API Auth0 standard
export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession(request)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: {
        sub: session.user.sub,
        email: session.user.email,
        name: session.user.name,
        nickname: session.user.nickname,
        picture: session.user.picture,
        email_verified: (session.user as any).email_verified,
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


