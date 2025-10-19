import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export interface AuthenticatedUser {
  id: string
  email?: string
  name?: string
  role?: 'admin' | 'customer'
}

function extractBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  return authHeader.substring(7)
}

export async function getAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const token = extractBearerToken(request)
    if (!token) return null

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key') as any

    // Le token généré par /api/auth/login contient { userId, email, role }
    return {
      id: decoded.userId || decoded.sub || '',
      email: decoded.email,
      name: decoded.name,
      role: decoded.role
    }
  } catch (error) {
    console.error('Erreur lors de la validation du token:', error)
    return null
  }
}

export function requireAuth(
  handler: (request: NextRequest, user: AuthenticatedUser, ...args: any[]) => Promise<Response>
) {
  return async (request: NextRequest, ...args: any[]) => {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Non authentifié' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    return handler(request, user, ...args)
  }
}

export function requireAdmin(
  handler: (request: NextRequest, user: AuthenticatedUser, ...args: any[]) => Promise<Response>
) {
  return requireAuth(async (request, user, ...args) => {
    if (user.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Accès non autorisé' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    return handler(request, user, ...args)
  })
}

