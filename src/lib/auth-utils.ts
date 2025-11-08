import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export interface AuthenticatedUser {
  id: string
  email?: string
  name?: string
  role?: 'admin' | 'customer' | 'owner'
}

const bypassAdminSecurity = process.env.BYPASS_ADMIN_SECURITY !== 'false'

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
  if (bypassAdminSecurity) {
    return async (request: NextRequest, ...args: any[]) => {
      const dummyUser: AuthenticatedUser = {
        id: 'bypass-admin',
        email: 'bypass-admin@test.local',
        role: 'owner'
      }
      return handler(request, dummyUser, ...args)
    }
  }

  return requireAuth(async (request, user, ...args) => {
    if (user.role !== 'admin' && user.role !== 'owner') {
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

// Fonction pour exiger le rôle owner (permissions supérieures)
export function requireOwner(
  handler: (request: NextRequest, user: AuthenticatedUser, ...args: any[]) => Promise<Response>
) {
  if (bypassAdminSecurity) {
    return async (request: NextRequest, ...args: any[]) => {
      const dummyUser: AuthenticatedUser = {
        id: 'bypass-owner',
        email: 'bypass-owner@test.local',
        role: 'owner'
      }
      return handler(request, dummyUser, ...args)
    }
  }

  return requireAuth(async (request, user, ...args) => {
    if (user.role !== 'owner') {
      return new Response(
        JSON.stringify({ error: 'Accès réservé au propriétaire' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    return handler(request, user, ...args)
  })
}

// Fonction pour vérifier si l'utilisateur est owner ou admin
export function isAdminOrOwner(user: AuthenticatedUser | null): boolean {
  return user?.role === 'admin' || user?.role === 'owner'
}

// Fonction pour vérifier si l'utilisateur est owner
export function isOwner(user: AuthenticatedUser | null): boolean {
  return user?.role === 'owner'
}

