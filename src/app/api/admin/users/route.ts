import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-utils'
import { getAuth0UserRolesBatch, listAuth0Users } from '@/lib/auth0-management'

// GET - Récupérer tous les utilisateurs avec pagination
export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '25')))
    const search = searchParams.get('search') || undefined
    const roleFilter = searchParams.get('role')?.toLowerCase()

    const auth0Response = await listAuth0Users({
      page,
      perPage: limit,
      search,
    })

    // Récupérer les rôles par batch avec limitation de concurrence pour éviter les erreurs 429
    const userIds = auth0Response.users.map((u) => u.user_id)
    const rolesMap = await getAuth0UserRolesBatch(userIds, 5) // Max 5 requêtes parallèles

    const usersWithRoles = auth0Response.users.map((user) => {
      const roles = rolesMap.get(user.user_id) || []
      const primaryRole = roles[0] || 'customer'
      return {
        auth0Id: user.user_id,
        email: user.email,
        name: user.name || '',
        role: primaryRole,
        createdAt: user.created_at,
        lastLogin: user.last_login || null,
      }
    })

    const filteredUsers = roleFilter
      ? usersWithRoles.filter((u) => u.role.toLowerCase() === roleFilter)
      : usersWithRoles

    // Calcul statistiques commandes depuis Prisma
    const emails = filteredUsers.map((u) => u.email).filter(Boolean)
    let statsMap = new Map<string, { orderCount: number; totalSpent: number }>()

    if (emails.length > 0) {
      try {
        const orderStats = await prisma.order.groupBy({
          by: ['customerEmail'],
          where: {
            customerEmail: { in: emails },
          },
          _count: { _all: true },
          _sum: { totalCents: true },
        })

        statsMap = new Map(
          orderStats.map((stat) => [
            (stat.customerEmail || '').toLowerCase(),
            {
              orderCount: stat._count._all,
              totalSpent: stat._sum.totalCents || 0,
            },
          ])
        )
      } catch (prismaError: any) {
        // Gérer les erreurs de connexion Prisma gracieusement
        console.error('Erreur lors de la récupération des statistiques Prisma:', prismaError)
        // Continuer sans les statistiques plutôt que de faire échouer la requête
        if (prismaError.code === 'P1000' || prismaError.message?.includes('Authentication failed')) {
          console.warn('Connexion à la base de données échouée, statistiques non disponibles')
        }
      }
    }

    const users = filteredUsers.map((user) => {
      const stats = statsMap.get(user.email.toLowerCase()) || {
        orderCount: 0,
        totalSpent: 0,
      }
      return {
        id: user.auth0Id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        orderCount: stats.orderCount,
        totalSpent: stats.totalSpent,
      }
    })

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total: roleFilter ? users.length : auth0Response.total,
        totalPages: roleFilter ? 1 : Math.ceil(auth0Response.total / limit),
      },
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs Auth0:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
})

