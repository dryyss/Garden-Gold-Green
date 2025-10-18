import { NextRequest } from 'next/server'

export interface AuthenticatedUser {
  sub: string
  email?: string
  name?: string
}

export async function getAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    // Pour l'instant, nous utilisons un système simple basé sur les headers
    // Dans un vrai projet, vous devriez valider un JWT ou utiliser Auth0 Management API
    
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    
    // Ici, vous devriez valider le token avec Auth0
    // Pour l'instant, nous simulons un utilisateur
    if (token === 'test-token') {
      return {
        sub: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User'
      }
    }

    return null
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error)
    return null
  }
}

export function requireAuth(handler: (request: NextRequest, user: AuthenticatedUser, ...args: any[]) => Promise<Response>) {
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

