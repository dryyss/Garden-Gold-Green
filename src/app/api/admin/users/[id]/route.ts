import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin, isOwner, getAuthenticatedUser } from '@/lib/auth-utils'
import { assignSingleRole } from '@/lib/auth0-management'
import { mapToBackofficeRoles } from '@/lib/roles'

// GET - Récupérer un utilisateur spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(async (request: NextRequest) => {
    try {
      const { id } = await params

      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          orders: {
            select: {
              id: true,
              totalCents: true,
              status: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      })

      if (!user) {
        return NextResponse.json(
          { error: 'Utilisateur non trouvé' },
          { status: 404 }
        )
      }

      const orderCount = user.orders.length
      const totalSpent = user.orders
        .filter(order => ['paid', 'shipped', 'delivered'].includes(order.status))
        .reduce((sum, order) => sum + order.totalCents, 0)

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          orderCount,
          totalSpent,
          recentOrders: user.orders,
          createdAt: user.createdAt.toISOString()
        }
      })
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error)
      return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
    }
  })(request)
}

// PATCH - Mettre à jour un utilisateur (principalement pour changer le rôle)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(async (request: NextRequest) => {
    try {
      const { id } = await params
      const body = await request.json()
      const { role, name } = body

      // Vérifier si l'utilisateur existe
      const existingUser = await prisma.user.findUnique({
        where: { id }
      })

      if (!existingUser) {
        return NextResponse.json(
          { error: 'Utilisateur non trouvé' },
          { status: 404 }
        )
      }

      // Récupérer l'utilisateur actuel pour vérifier ses permissions
      const currentUser = await getAuthenticatedUser(request)
      const isOwnerUser = currentUser && isOwner(currentUser)

      // Ne pas permettre de supprimer le dernier admin (sauf pour owner)
      const normalizedRole = role ? mapToBackofficeRoles(role)[0] : undefined

      if (
        normalizedRole === 'customer' &&
        existingUser.role === 'admin' &&
        !isOwnerUser
      ) {
        const adminCount = await prisma.user.count({
          where: { role: 'admin' }
        })

        if (adminCount === 1) {
          return NextResponse.json(
            { error: 'Impossible de supprimer le dernier administrateur' },
            { status: 400 }
          )
        }
      }

      // Owner peut modifier les rôles admin, mais pas les supprimer complètement si c'est le dernier
      if (
        isOwnerUser &&
        normalizedRole === 'customer' &&
        existingUser.role === 'admin'
      ) {
        const adminCount = await prisma.user.count({
          where: { role: 'admin' }
        })
        const ownerCount = await prisma.user.count({
          where: { role: 'owner' }
        })
        
        // Si c'est le dernier admin et qu'il n'y a pas d'owner, ne pas permettre
        if (adminCount === 1 && ownerCount === 0) {
          return NextResponse.json(
            { error: 'Impossible de supprimer le dernier administrateur. Créez un owner d\'abord.' },
            { status: 400 }
          )
        }
      }

      // Valider le rôle
      if (role && !normalizedRole) {
        return NextResponse.json(
          { error: 'Rôle invalide' },
          { status: 400 }
        )
      }

      // Seul owner peut créer/modifier un owner
      if (normalizedRole === 'owner' && !isOwnerUser) {
        return NextResponse.json(
          { error: 'Seul le propriétaire peut créer ou modifier un owner' },
          { status: 403 }
        )
      }

      // Mettre à jour l'utilisateur dans Prisma
      const updateData: any = {}
      if (normalizedRole) updateData.role = normalizedRole
      if (name !== undefined) updateData.name = name

      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
        }
      })

      // Synchroniser avec Auth0 si le rôle a changé
      if (normalizedRole && normalizedRole !== existingUser.role) {
        try {
          // Trouver l'Auth0 user ID depuis l'email
          // Note: L'ID Prisma peut être différent de l'Auth0 ID
          // On essaie de trouver l'utilisateur Auth0 par email
          const email = existingUser.email

          // Option 1: Si l'ID Prisma est l'Auth0 ID (sub)
          let auth0UserId: string | null = null

          // Vérifier si l'ID ressemble à un Auth0 ID (commence par auth0|, google-oauth2|, etc.)
          if (id.includes('|')) {
            auth0UserId = id
          } else {
            // Si ce n'est pas un Auth0 ID, on doit trouver l'utilisateur Auth0 par email
            // Pour cela, on peut utiliser l'API Auth0 Management pour rechercher par email
            // Mais pour simplifier, on va supposer que l'email dans Prisma correspond à Auth0
            // Dans un vrai projet, vous devriez stocker l'Auth0 ID dans Prisma
            console.warn('⚠️ ID Prisma ne semble pas être un Auth0 ID. Synchronisation Auth0 peut échouer.')
            console.warn('💡 Solution: Stockez l\'Auth0 user ID (sub) dans la table User lors de la création')
          }

          // Si on a un Auth0 ID, synchroniser
          if (auth0UserId) {
            await assignSingleRole(auth0UserId, normalizedRole)
            console.log(`✅ Rôle ${normalizedRole} synchronisé avec Auth0 pour ${email}`)
          } else {
            console.warn(`⚠️ Impossible de synchroniser Auth0: ID non trouvé pour ${email}`)
            // Ne pas faire échouer la requête, on continue quand même
          }
        } catch (auth0Error) {
          console.error('❌ Erreur lors de la synchronisation Auth0:', auth0Error)
          // Ne pas faire échouer la requête si Auth0 échoue
          // Le rôle est quand même mis à jour dans Prisma
          // On peut retourner un avertissement
          return NextResponse.json({
            success: true,
            user: updatedUser,
            message: 'Utilisateur mis à jour avec succès dans la base de données',
            warning: 'La synchronisation avec Auth0 a échoué. Le rôle sera mis à jour à la prochaine connexion.'
          })
        }
      }

      return NextResponse.json({
        success: true,
        user: updatedUser,
        message: 'Utilisateur mis à jour avec succès'
      })
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error)
      return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
    }
  })(request)
}

