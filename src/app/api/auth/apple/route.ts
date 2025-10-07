import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Redirection vers Apple Sign In
  const appleAuthUrl = `https://appleid.apple.com/auth/authorize?client_id=${process.env.APPLE_CLIENT_ID}&redirect_uri=${process.env.APPLE_REDIRECT_URI}&response_type=code&scope=name%20email&state=${Date.now()}`
  
  return NextResponse.redirect(appleAuthUrl)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Traitement de la réponse d'Apple Sign In
    const { code, state } = body
    
    if (!code) {
      return NextResponse.json({ error: 'Code d\'autorisation manquant' }, { status: 400 })
    }

    // Échange du code contre un token d'accès
    const tokenResponse = await fetch('https://appleid.apple.com/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.APPLE_CLIENT_ID!,
        client_secret: process.env.APPLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.APPLE_REDIRECT_URI!,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      return NextResponse.json({ error: 'Erreur lors de l\'obtention du token' }, { status: 400 })
    }

    // Récupération des informations utilisateur
    const userInfoResponse = await fetch('https://appleid.apple.com/auth/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    })

    const userInfo = await userInfoResponse.json()

    // Création ou mise à jour de l'utilisateur dans votre base de données
    // Ici vous devriez implémenter la logique de création/mise à jour d'utilisateur
    
    return NextResponse.json({ 
      success: true, 
      user: userInfo,
      message: 'Connexion Apple réussie' 
    })

  } catch (error) {
    console.error('Erreur Apple Sign In:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
