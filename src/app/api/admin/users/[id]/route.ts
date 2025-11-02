import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '@/lib/auth-utils'

const prisma = new PrismaClient()

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
    } finally {
      await prisma.$disconnect()
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

      // Ne pas permettre de supprimer le dernier admin
      if (role === 'customer' && existingUser.role === 'admin') {
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

      // Valider le rôle
      if (role && !['admin', 'customer'].includes(role)) {
        return NextResponse.json(
          { error: 'Rôle invalide' },
          { status: 400 }
        )
      }

      // Mettre à jour l'utilisateur
      const updateData: any = {}
      if (role) updateData.role = role
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

      return NextResponse.json({
        success: true,
        user: updatedUser,
        message: 'Utilisateur mis à jour avec succès'
      })
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error)
      return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
    } finally {
      await prisma.$disconnect()
    }
  })(request)
}

