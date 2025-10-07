import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Redirection vers Facebook Login
  const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&scope=email,public_profile&response_type=code&state=${Date.now()}`
  
  return NextResponse.redirect(facebookAuthUrl)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Traitement de la réponse de Facebook Login
    const { code, state } = body
    
    if (!code) {
      return NextResponse.json({ error: 'Code d\'autorisation manquant' }, { status: 400 })
    }

    // Échange du code contre un token d'accès
    const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.FACEBOOK_APP_ID!,
        client_secret: process.env.FACEBOOK_APP_SECRET!,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI!,
        code,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      return NextResponse.json({ error: 'Erreur lors de l\'obtention du token' }, { status: 400 })
    }

    // Récupération des informations utilisateur
    const userInfoResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${tokenData.access_token}`)
    const userInfo = await userInfoResponse.json()

    // Création ou mise à jour de l'utilisateur dans votre base de données
    // Ici vous devriez implémenter la logique de création/mise à jour d'utilisateur
    
    return NextResponse.json({ 
      success: true, 
      user: userInfo,
      message: 'Connexion Facebook réussie' 
    })

  } catch (error) {
    console.error('Erreur Facebook Login:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
