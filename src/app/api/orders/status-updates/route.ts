import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth0 } from '@/lib/auth0'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession(request)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const userId = session.user.sub
    const body = await request.json()
    const { lastChecked } = body

    // Récupérer les commandes mises à jour depuis la dernière vérification
    const whereClause: any = {
      userId: userId,
    }

    if (lastChecked) {
      whereClause.updatedAt = {
        gt: new Date(lastChecked)
      }
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      select: {
        id: true,
        status: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      updates: orders.map(order => ({
        id: order.id,
        status: order.status,
        updatedAt: order.updatedAt.toISOString()
      }))
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des mises à jour:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

