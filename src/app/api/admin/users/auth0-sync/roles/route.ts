import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-utils'
import { getAllAuth0Roles } from '@/lib/auth0-management'

/**
 * GET - Liste tous les rôles disponibles dans Auth0
 */
export async function GET(request: NextRequest) {
  return requireAdmin(async (request: NextRequest) => {
    try {
      const roles = await getAllAuth0Roles()
      return NextResponse.json({
        success: true,
        roles: roles.map(r => ({ id: r.id, name: r.name }))
      })
    } catch (error: any) {
      console.error('Erreur lors de la récupération des rôles:', error)
      return NextResponse.json(
        { error: error.message || 'Erreur lors de la récupération des rôles' },
        { status: 500 }
      )
    }
  })(request)
}


