import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-utils'

// GET - Récupérer toutes les demandes de retour avec pagination
export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const whereClause: any = {}

    // Filtre par statut
    if (status) {
      whereClause.status = status
    }

    // Filtre par type (refund/exchange)
    if (type) {
      whereClause.type = type
    }

    const [returns, total] = await Promise.all([
      prisma.returnRequest.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          },
          order: {
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
      prisma.returnRequest.count({ where: whereClause })
    ])

    // Calculer les statistiques globales
    const [pendingCount, approvedCount, rejectedCount, completedCount, totalValue] = await Promise.all([
      prisma.returnRequest.count({ where: { status: 'pending' } }),
      prisma.returnRequest.count({ where: { status: 'approved' } }),
      prisma.returnRequest.count({ where: { status: 'rejected' } }),
      prisma.returnRequest.count({ where: { status: 'completed' } }),
      // Calculer la valeur totale des retours en attente
      prisma.returnRequest.findMany({
        where: { status: 'pending' },
        include: { order: true }
      }).then(requests => {
        return requests.reduce((sum, req) => {
          // Pour simplifier, on utilise un pourcentage du total de la commande
          // basé sur le nombre d'items retournés
          return sum + (req.order.totalCents * 0.5) // Approximation
        }, 0)
      })
    ])

    return NextResponse.json({
      success: true,
      returns: returns.map(ret => ({
        id: ret.id,
        status: ret.status,
        type: ret.type,
        reason: ret.reason,
        items: typeof ret.items === 'string' ? JSON.parse(ret.items) : ret.items,
        user: ret.user,
        order: ret.order,
        createdAt: ret.createdAt.toISOString(),
        updatedAt: ret.updatedAt.toISOString()
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      statistics: {
        total,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        completed: completedCount,
        totalValue
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des retours:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
})

