import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '@/lib/auth-utils'

const prisma = new PrismaClient()

// GET - Récupérer tous les utilisateurs avec pagination
export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit
    const search = searchParams.get('search')
    const role = searchParams.get('role')

    const whereClause: any = {}

    // Recherche par email ou nom
    if (search) {
      whereClause.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Filtre par rôle
    if (role) {
      whereClause.role = role
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        include: {
          orders: {
            select: {
              id: true,
              totalCents: true,
              status: true,
              createdAt: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.user.count({ where: whereClause })
    ])

    // Calculer les statistiques pour chaque utilisateur
    const usersWithStats = users.map(user => {
      const orderCount = user.orders.length
      const totalSpent = user.orders
        .filter(order => ['paid', 'shipped', 'delivered'].includes(order.status))
        .reduce((sum, order) => sum + order.totalCents, 0)

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        orderCount,
        totalSpent,
        createdAt: user.createdAt.toISOString()
      }
    })

    return NextResponse.json({
      success: true,
      users: usersWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
})

