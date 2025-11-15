import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-utils'

// GET - Récupérer une demande de retour spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(async (request: NextRequest) => {
    try {
      const { id } = await params

      const returnRequest = await prisma.returnRequest.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          },
          order: {
            include: {
              items: {
                include: {
                  product: {
                    select: {
                      id: true,
                      title: true,
                      images: true
                    }
                  }
                }
              }
            }
          }
        }
      })

      if (!returnRequest) {
        return NextResponse.json(
          { error: 'Demande de retour non trouvée' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        returnRequest: {
          id: returnRequest.id,
          status: returnRequest.status,
          type: returnRequest.type,
          reason: returnRequest.reason,
          items: typeof returnRequest.items === 'string' 
            ? JSON.parse(returnRequest.items) 
            : returnRequest.items,
          user: returnRequest.user,
          order: returnRequest.order,
          createdAt: returnRequest.createdAt.toISOString(),
          updatedAt: returnRequest.updatedAt.toISOString()
        }
      })
    } catch (error) {
      console.error('Erreur lors de la récupération du retour:', error)
      return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
    }
  })(request)
}

// PATCH - Mettre à jour le statut d'une demande de retour
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(async (request: NextRequest) => {
    try {
      const { id } = await params
      const body = await request.json()
      const { status } = body

      if (!status || !['pending', 'approved', 'rejected', 'completed'].includes(status)) {
        return NextResponse.json(
          { error: 'Statut invalide. Doit être: pending, approved, rejected, ou completed' },
          { status: 400 }
        )
      }

      // Mettre à jour la demande de retour
      const returnRequest = await prisma.returnRequest.update({
        where: { id },
        data: { status },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          },
          order: true
        }
      })

      // Si approuvé, marquer les items comme retournés
      if (status === 'approved') {
        const itemIds = typeof returnRequest.items === 'string' 
          ? JSON.parse(returnRequest.items) 
          : returnRequest.items

        await prisma.orderItem.updateMany({
          where: {
            id: { in: itemIds }
          },
          data: {
            status: 'returned'
          }
        })

        // Si c'est un remboursement, on pourrait ici appeler Stripe pour le remboursement
        // TODO: Implémenter le remboursement Stripe si nécessaire
      }

      // Si rejeté ou complété, marquer les items comme non retournables
      if (status === 'rejected' || status === 'completed') {
        const itemIds = typeof returnRequest.items === 'string' 
          ? JSON.parse(returnRequest.items) 
          : returnRequest.items

        await prisma.orderItem.updateMany({
          where: {
            id: { in: itemIds },
            status: 'return_requested'
          },
          data: {
            status: status === 'completed' ? 'returned' : 'ordered'
          }
        })
      }

      return NextResponse.json({
        success: true,
        returnRequest: {
          id: returnRequest.id,
          status: returnRequest.status,
          type: returnRequest.type,
          reason: returnRequest.reason,
          items: typeof returnRequest.items === 'string' 
            ? JSON.parse(returnRequest.items) 
            : returnRequest.items,
          user: returnRequest.user,
          order: returnRequest.order,
          createdAt: returnRequest.createdAt.toISOString(),
          updatedAt: returnRequest.updatedAt.toISOString()
        }
      })
    } catch (error) {
      console.error('Erreur lors de la mise à jour du retour:', error)
      return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
    }
  })(request)
}

// DELETE - Supprimer une demande de retour (seulement si pending)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(async (request: NextRequest) => {
    try {
      const { id } = await params

      // Vérifier que le retour est en pending
      const returnRequest = await prisma.returnRequest.findUnique({
        where: { id }
      })

      if (!returnRequest) {
        return NextResponse.json(
          { error: 'Demande de retour non trouvée' },
          { status: 404 }
        )
      }

      if (returnRequest.status !== 'pending') {
        return NextResponse.json(
          { error: 'Impossible de supprimer une demande de retour qui n\'est pas en attente' },
          { status: 400 }
        )
      }

      // Réinitialiser le statut des items
      const itemIds = typeof returnRequest.items === 'string' 
        ? JSON.parse(returnRequest.items) 
        : returnRequest.items

      await prisma.orderItem.updateMany({
        where: { id: { in: itemIds } },
        data: { status: 'ordered' }
      })

      // Supprimer la demande de retour
      await prisma.returnRequest.delete({
        where: { id }
      })

      return NextResponse.json({
        success: true,
        message: 'Demande de retour supprimée avec succès'
      })
    } catch (error) {
      console.error('Erreur lors de la suppression du retour:', error)
      return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
    }
  })(request)
}

