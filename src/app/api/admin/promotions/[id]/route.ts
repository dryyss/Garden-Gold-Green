import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth0 } from '@/lib/auth0'
import { getAuth0UserRoles } from '@/lib/auth0-management'
import { mapToBackofficeRoles } from '@/lib/roles'

// Helper pour vérifier les droits admin avec Auth0
async function checkAdminAccess(request: NextRequest) {
  try {
    const session = await auth0.getSession(request)
    if (!session?.user?.sub) {
      return { authorized: false, error: 'Non authentifié' }
    }

    const roles = await getAuth0UserRoles(session.user.sub)
    const backofficeRoles = mapToBackofficeRoles(roles)
    const isAdmin = backofficeRoles.includes('admin') || backofficeRoles.includes('owner')

    if (!isAdmin) {
      return { authorized: false, error: 'Accès non autorisé' }
    }

    return { authorized: true }
  } catch (error) {
    console.error('Erreur vérification admin:', error)
    return { authorized: false, error: 'Erreur de vérification' }
  }
}

// GET - Récupérer une promotion spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessCheck = await checkAdminAccess(request)
  if (!accessCheck.authorized) {
    return NextResponse.json(
      { error: accessCheck.error || 'Accès non autorisé' },
      { status: accessCheck.error === 'Non authentifié' ? 401 : 403 }
    )
  }

  try {
    const { id } = await params

    const promotion = await prisma.promotion.findUnique({
      where: { id }
    })

    if (!promotion) {
      return NextResponse.json(
        { error: 'Promotion non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      promotion
    })
  } catch (error) {
    console.error('Erreur lors de la récupération de la promotion:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

// PATCH - Mettre à jour une promotion
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessCheck = await checkAdminAccess(request)
  if (!accessCheck.authorized) {
    return NextResponse.json(
      { error: accessCheck.error || 'Accès non autorisé' },
      { status: accessCheck.error === 'Non authentifié' ? 401 : 403 }
    )
  }

  try {
    const { id } = await params
    const body = await request.json()

    const promotion = await prisma.promotion.findUnique({
      where: { id }
    })

    if (!promotion) {
      return NextResponse.json(
        { error: 'Promotion non trouvée' },
        { status: 404 }
      )
    }

    // Préparer les données à mettre à jour
    const updateData: any = {}

    if (body.description !== undefined) updateData.description = body.description
    if (body.discountType) updateData.discountType = body.discountType
    if (body.discountValue !== undefined) updateData.discountValue = parseInt(body.discountValue)
    if (body.minimumAmount !== undefined) updateData.minimumAmount = body.minimumAmount ? parseInt(body.minimumAmount) : null
    if (body.maxUses !== undefined) updateData.maxUses = body.maxUses ? parseInt(body.maxUses) : null
    if (body.validFrom) updateData.validFrom = new Date(body.validFrom)
    if (body.validUntil !== undefined) updateData.validUntil = body.validUntil ? new Date(body.validUntil) : null
    if (body.isActive !== undefined) updateData.isActive = body.isActive
    if (body.applicableProducts !== undefined) updateData.applicableProducts = body.applicableProducts ? JSON.stringify(body.applicableProducts) : null
    if (body.applicableCategories !== undefined) updateData.applicableCategories = body.applicableCategories ? JSON.stringify(body.applicableCategories) : null

    const updatedPromotion = await prisma.promotion.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      promotion: updatedPromotion
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la promotion:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer une promotion
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessCheck = await checkAdminAccess(request)
  if (!accessCheck.authorized) {
    return NextResponse.json(
      { error: accessCheck.error || 'Accès non autorisé' },
      { status: accessCheck.error === 'Non authentifié' ? 401 : 403 }
    )
  }

  try {
    const { id } = await params

    const promotion = await prisma.promotion.findUnique({
      where: { id }
    })

    if (!promotion) {
      return NextResponse.json(
        { error: 'Promotion non trouvée' },
        { status: 404 }
      )
    }

    await prisma.promotion.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Promotion supprimée avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de la suppression de la promotion:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

