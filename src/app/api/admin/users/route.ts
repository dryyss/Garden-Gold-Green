import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '@/lib/auth-utils'
import { createAuth0User, deleteAuth0User } from '@/lib/auth0-management'

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

// POST - Créer un nouvel utilisateur (Prisma + Auth0)
export const POST = requireAdmin(async (request: NextRequest) => {
  let createdAuth0UserId: string | null = null

  try {
    const body = await request.json()
    const { email, name, password, role = 'customer' } = body

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 })
    }

    if (!['customer', 'admin', 'owner'].includes(role)) {
      return NextResponse.json({ error: 'Rôle invalide' }, { status: 400 })
    }

    // Vérifier si l'utilisateur existe déjà
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 409 }
      )
    }

    // Créer l'utilisateur dans Auth0
    const auth0User = await createAuth0User({
      email,
      password,
      name,
      role,
    })
    createdAuth0UserId = auth0User.user_id

    // Créer l'utilisateur dans Prisma
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role,
        auth0Id: auth0User.user_id,
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error('Erreur lors de la création utilisateur:', error)

    if (createdAuth0UserId) {
      try {
        await deleteAuth0User(createdAuth0UserId)
      } catch (cleanupError) {
        console.error('Erreur lors du rollback Auth0:', cleanupError)
      }
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création de l’utilisateur' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
})

