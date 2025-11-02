import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '@/lib/auth-utils'

const prisma = new PrismaClient()

export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month' // month, year, all
    const comparePeriod = searchParams.get('comparePeriod') === 'true'

    // Calculer les dates pour la période courante
    const now = new Date()
    let startDate: Date
    const endDate: Date = now

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      case 'all':
      default:
        startDate = new Date(0) // Début de l'époque Unix
        break
    }

    // Statistiques des commandes
    const [
      totalOrders,
      deliveredOrders,
      pendingOrders,
      totalRevenue,
      totalCustomers,
      totalProducts,
      ordersData,
      revenueByDay
    ] = await Promise.all([
      // Total des commandes
      prisma.order.count({
        where: { createdAt: { gte: startDate, lte: endDate } }
      }),
      // Commandes livrées
      prisma.order.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: { in: ['delivered', 'shipped'] }
        }
      }),
      // Commandes en attente
      prisma.order.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: 'pending'
        }
      }),
      // Revenus totaux (commandes payées, expédiées ou livrées)
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: { in: ['paid', 'shipped', 'delivered'] }
        },
        _sum: { totalCents: true }
      }),
      // Nombre total de clients
      prisma.user.count(),
      // Nombre total de produits
      prisma.product.count(),
      // Données des commandes pour les statistiques
      prisma.order.findMany({
        where: { createdAt: { gte: startDate, lte: endDate } },
        select: {
          id: true,
          status: true,
          totalCents: true,
          createdAt: true,
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  isFeatured: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      // Revenus par jour (pour les graphiques)
      prisma.order.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: { in: ['paid', 'shipped', 'delivered'] }
        },
        select: {
          totalCents: true,
          createdAt: true
        }
      })
    ])

    // Calculer les revenus totaux
    const revenueTotal = totalRevenue._sum.totalCents || 0

    // Calculer les statistiques de produits en vedette
    const featuredProducts = await prisma.product.findMany({
      where: { isFeatured: true },
      include: {
        orderItems: {
          where: {
            order: {
              createdAt: { gte: startDate, lte: endDate },
              status: { in: ['delivered', 'shipped'] }
            }
          }
        }
      }
    })

    const featuredProductsStats = featuredProducts.map(product => {
      const sales = product.orderItems.reduce((sum, item) => sum + item.quantity, 0)
      const revenue = product.orderItems.reduce(
        (sum, item) => sum + item.priceCents * item.quantity,
        0
      )

      return {
        id: product.id,
        title: product.title,
        sales,
        revenue
      }
    })

    // Produits les plus vendus
    const topProducts = await prisma.product.findMany({
      include: {
        orderItems: {
          where: {
            order: {
              createdAt: { gte: startDate, lte: endDate },
              status: { in: ['delivered', 'shipped'] }
            }
          }
        }
      },
      orderBy: {
        orderItems: {
          _count: 'desc'
        }
      },
      take: 10
    })

    const topProductsStats = topProducts.map(product => {
      const sales = product.orderItems.reduce((sum, item) => sum + item.quantity, 0)
      const revenue = product.orderItems.reduce(
        (sum, item) => sum + item.priceCents * item.quantity,
        0
      )

      return {
        id: product.id,
        title: product.title,
        sales,
        revenue
      }
    }).sort((a, b) => b.sales - a.sales)

    // Statistiques de comparaison (période précédente)
    let comparisonStats: any = null
    if (comparePeriod && period !== 'all') {
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      const previousStartDate = new Date(startDate.getTime() - daysDiff * 24 * 60 * 60 * 1000)
      const previousEndDate = startDate

      const previousRevenue = await prisma.order.aggregate({
        where: {
          createdAt: { gte: previousStartDate, lt: previousEndDate },
          status: { in: ['paid', 'shipped', 'delivered'] }
        },
        _sum: { totalCents: true }
      })

      const previousOrders = await prisma.order.count({
        where: { createdAt: { gte: previousStartDate, lt: previousEndDate } }
      })

      const prevRevenue = previousRevenue._sum.totalCents || 0
      const revenueChange = prevRevenue > 0 
        ? ((revenueTotal - prevRevenue) / prevRevenue) * 100 
        : 0
      
      const ordersChange = previousOrders > 0
        ? ((totalOrders - previousOrders) / previousOrders) * 100
        : 0

      comparisonStats = {
        revenueChange: Number(revenueChange.toFixed(2)),
        ordersChange: Number(ordersChange.toFixed(2))
      }
    }

    // Grouper les revenus par jour
    const revenueByDayMap: Record<string, number> = {}
    revenueByDay.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0]
      if (!revenueByDayMap[date]) {
        revenueByDayMap[date] = 0
      }
      revenueByDayMap[date] += order.totalCents
    })

    const revenueByDayArray = Object.entries(revenueByDayMap)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return NextResponse.json({
      success: true,
      statistics: {
        overview: {
          totalRevenue,
          totalRevenueInCents: revenueTotal,
          totalRevenueInEuros: (revenueTotal / 100).toFixed(2),
          totalOrders,
          deliveredOrders,
          pendingOrders,
          totalCustomers,
          totalProducts
        },
        comparison: comparisonStats,
        products: {
          featured: featuredProductsStats,
          topSelling: topProductsStats
        },
        revenueByDay: revenueByDayArray
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
})

