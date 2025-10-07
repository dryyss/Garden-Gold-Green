import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Redirection vers Google OAuth
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20email%20profile&state=${Date.now()}`
  
  return NextResponse.redirect(googleAuthUrl)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Traitement de la réponse de Google OAuth
    const { code, state } = body
    
    if (!code) {
      return NextResponse.json({ error: 'Code d\'autorisation manquant' }, { status: 400 })
    }

    // Échange du code contre un token d'accès
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      return NextResponse.json({ error: 'Erreur lors de l\'obtention du token' }, { status: 400 })
    }

    // Récupération des informations utilisateur
    const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`)
    const userInfo = await userInfoResponse.json()

    // Création ou mise à jour de l'utilisateur dans votre base de données
    // Ici vous devriez implémenter la logique de création/mise à jour d'utilisateur
    
    return NextResponse.json({ 
      success: true, 
      user: userInfo,
      message: 'Connexion Google réussie' 
    })

  } catch (error) {
    console.error('Erreur Google OAuth:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  // Redirection vers Google OAuth
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20email%20profile&state=${Date.now()}`
  
  return NextResponse.redirect(googleAuthUrl)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Traitement de la réponse de Google OAuth
    const { code, state } = body
    
    if (!code) {
      return NextResponse.json({ error: 'Code d\'autorisation manquant' }, { status: 400 })
    }

    // Échange du code contre un token d'accès
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      return NextResponse.json({ error: 'Erreur lors de l\'obtention du token' }, { status: 400 })
    }

    // Récupération des informations utilisateur
    const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`)
    const userInfo = await userInfoResponse.json()

    // Création ou mise à jour de l'utilisateur dans votre base de données
    // Ici vous devriez implémenter la logique de création/mise à jour d'utilisateur
    
    return NextResponse.json({ 
      success: true, 
      user: userInfo,
      message: 'Connexion Google réussie' 
    })

  } catch (error) {
    console.error('Erreur Google OAuth:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
