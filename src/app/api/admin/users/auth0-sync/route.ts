import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, isOwner, getAuthenticatedUser } from '@/lib/auth-utils'
import { getAuth0UserRoles, assignSingleRole, getAllAuth0Roles } from '@/lib/auth0-management'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@auth0/nextjs-auth0'

const prisma = new PrismaClient()

/**
 * GET - Lire les rôles d'un utilisateur depuis Auth0
 * Query params: ?userId=... ou ?email=...
 */
export async function GET(request: NextRequest) {
  return requireAdmin(async (request: NextRequest) => {
    try {
      const { searchParams } = new URL(request.url)
      const userId = searchParams.get('userId')
      const email = searchParams.get('email')

      if (!userId && !email) {
        return NextResponse.json(
          { error: 'userId ou email requis' },
          { status: 400 }
        )
      }

      // Trouver l'utilisateur Auth0
      let auth0UserId: string | null = null

      if (userId) {
        // Si userId ressemble à un Auth0 ID (contient |)
        if (userId.includes('|')) {
          auth0UserId = userId
        } else {
          // Sinon, chercher dans Prisma
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true }
          })
          if (!user) {
            return NextResponse.json(
              { error: 'Utilisateur non trouvé' },
              { status: 404 }
            )
          }
          // Note: Pour trouver l'Auth0 ID depuis l'email, il faudrait utiliser l'API Auth0
          // Pour simplifier, on retourne une erreur
          return NextResponse.json(
            { error: 'Auth0 ID non disponible. Utilisez l\'email ou stockez l\'Auth0 ID dans Prisma.' },
            { status: 400 }
          )
        }
      } else if (email) {
        // Chercher l'utilisateur Auth0 par email
        // Note: L'API Auth0 Management ne permet pas de rechercher directement par email
        // Il faudrait utiliser l'API Search ou stocker l'Auth0 ID dans Prisma
        return NextResponse.json(
          { error: 'Recherche par email non implémentée. Utilisez userId avec l\'Auth0 ID.' },
          { status: 400 }
        )
      }

      if (!auth0UserId) {
        return NextResponse.json(
          { error: 'Auth0 user ID non trouvé' },
          { status: 404 }
        )
      }

      // Récupérer les rôles depuis Auth0
      const roles = await getAuth0UserRoles(auth0UserId)

      return NextResponse.json({
        success: true,
        auth0UserId,
        roles,
        message: 'Rôles récupérés depuis Auth0'
      })
    } catch (error: any) {
      console.error('Erreur lors de la lecture des rôles Auth0:', error)
      return NextResponse.json(
        { error: error.message || 'Erreur lors de la lecture des rôles' },
        { status: 500 }
      )
    } finally {
      await prisma.$disconnect()
    }
  })(request)
}

/**
 * POST - Synchroniser les rôles Auth0 avec Prisma
 * Body: { userId: string, role: string }
 */
export async function POST(request: NextRequest) {
  return requireAdmin(async (request: NextRequest) => {
    try {
      const currentUser = await getAuthenticatedUser(request)
      const isOwnerUser = currentUser && isOwner(currentUser)

      if (!isOwnerUser) {
        return NextResponse.json(
          { error: 'Seul le propriétaire peut synchroniser les rôles avec Auth0' },
          { status: 403 }
        )
      }

      const body = await request.json()
      const { userId, role } = body

      if (!userId || !role) {
        return NextResponse.json(
          { error: 'userId et role requis' },
          { status: 400 }
        )
      }

      // Valider le rôle
      if (!['admin', 'customer', 'owner'].includes(role)) {
        return NextResponse.json(
          { error: 'Rôle invalide' },
          { status: 400 }
        )
      }

      // Trouver l'Auth0 ID
      let auth0UserId: string | null = null

      if (userId.includes('|')) {
        auth0UserId = userId
      } else {
        // Chercher dans Prisma
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { email: true }
        })

        if (!user) {
          return NextResponse.json(
            { error: 'Utilisateur non trouvé dans Prisma' },
            { status: 404 }
          )
        }

        // Note: Il faudrait stocker l'Auth0 ID dans Prisma pour pouvoir le récupérer
        return NextResponse.json(
          { error: 'Auth0 ID non disponible. Assurez-vous que l\'Auth0 user ID est stocké dans Prisma.' },
          { status: 400 }
        )
      }

      // Mettre à jour dans Auth0
      await assignSingleRole(auth0UserId, role)

      // Mettre à jour dans Prisma
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role },
        select: {
          id: true,
          email: true,
          name: true,
          role: true
        }
      })

      return NextResponse.json({
        success: true,
        user: updatedUser,
        message: 'Rôle synchronisé avec succès entre Auth0 et Prisma'
      })
    } catch (error: any) {
      console.error('Erreur lors de la synchronisation:', error)
      return NextResponse.json(
        { error: error.message || 'Erreur lors de la synchronisation' },
        { status: 500 }
      )
    } finally {
      await prisma.$disconnect()
    }
  })(request)
}

/**
 * GET - Liste tous les rôles disponibles dans Auth0
 */
export async function GET_ROLES(request: NextRequest) {
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





