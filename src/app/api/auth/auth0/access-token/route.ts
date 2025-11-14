import { NextRequest, NextResponse } from 'next/server'
import { getAuth0UserRoles } from '@/lib/auth0-management'

interface Auth0TokensResponse {
  access_token: string
  id_token?: string
  token_type: string
  expires_in: number
}

function buildBaseUrl(): string | null {
  const issuer = process.env.AUTH0_ISSUER_BASE_URL
  const domainFromIssuer = issuer?.replace(/https?:\/\//, '')
  const fallbackDomain =
    process.env.AUTH0_DOMAIN?.replace(/https?:\/\//, '') || domainFromIssuer || ''
  return issuer || (fallbackDomain ? `https://${fallbackDomain}` : null)
}

function pickClientId(): string {
  return (
    process.env.AUTH0_CLIENT_ID ||
    process.env.AUTH0_M2M_CLIENT_ID ||
    ''
  )
}

function pickClientSecret(): string {
  return (
    process.env.AUTH0_CLIENT_SECRET ||
    process.env.AUTH0_M2M_CLIENT_SECRET ||
    ''
  )
}

function pickAudience(baseUrl: string | null): string {
  return (
    process.env.AUTH0_AUDIENCE ||
    process.env.AUTH0_M2M_AUDIENCE ||
    (baseUrl ? `${baseUrl}/api/v2/` : '')
  )
}

export async function GET(request: NextRequest) {
  const baseUrl = buildBaseUrl()
  const clientId = pickClientId()
  const clientSecret = pickClientSecret()
  const audience = pickAudience(baseUrl)
  const url = new URL(request.url)
  const auth0UserId = url.searchParams.get('userId') || url.searchParams.get('auth0UserId')

  const missing: string[] = []
  if (!baseUrl) missing.push('AUTH0_ISSUER_BASE_URL ou AUTH0_DOMAIN')
  if (!clientId) missing.push('AUTH0_CLIENT_ID ou AUTH0_M2M_CLIENT_ID')
  if (!clientSecret) missing.push('AUTH0_CLIENT_SECRET ou AUTH0_M2M_CLIENT_SECRET')

  if (missing.length > 0) {
    console.warn('⚠️ Configuration Auth0 incomplète:', missing)
    return NextResponse.json(
      { error: `Configuration Auth0 incomplète: ${missing.join(', ')}` },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(`${baseUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        audience,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.warn('⚠️ Erreur Auth0 lors de la récupération du token:', error)
      return NextResponse.json(
        { error: `Impossible de récupérer l'access token: ${error}` },
        { status: response.status }
      )
    }

    const data = (await response.json()) as Auth0TokensResponse

    let roles: string[] | null = null

    if (auth0UserId) {
      try {
        roles = await getAuth0UserRoles(auth0UserId)
      } catch (error) {
        console.warn(`⚠️ Impossible de récupérer les rôles Auth0 pour ${auth0UserId}:`, error)
        roles = null
      }
    }

    return NextResponse.json({
      accessToken: data.access_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in,
      roles,
    })
  } catch (error) {
    console.error('❌ Erreur récupération access token Auth0:', error)
    return NextResponse.json(
      { error: 'Erreur interne lors de la récupération du token' },
      { status: 500 }
    )
  }
}

