import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-utils'

// GET - Récupérer toutes les promotions
export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active') // Filtrer par actif/inactif
    
    const whereClause: any = {}
    
    if (active !== null) {
      whereClause.isActive = active === 'true'
    }

    const promotions = await prisma.promotion.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      promotions
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des promotions:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
})

// POST - Créer une nouvelle promotion
export const POST = requireAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const {
      code,
      description,
      discountType,
      discountValue,
      minimumAmount,
      maxUses,
      validFrom,
      validUntil,
      isActive,
      applicableProducts,
      applicableCategories
    } = body

    // Validation
    if (!code || !discountType || !discountValue) {
      return NextResponse.json(
        { error: 'Code, type de remise et valeur sont requis' },
        { status: 400 }
      )
    }

    if (discountType !== 'percentage' && discountType !== 'fixed') {
      return NextResponse.json(
        { error: 'Le type de remise doit être "percentage" ou "fixed"' },
        { status: 400 }
      )
    }

    if (discountType === 'percentage' && (discountValue < 0 || discountValue > 100)) {
      return NextResponse.json(
        { error: 'Le pourcentage doit être entre 0 et 100' },
        { status: 400 }
      )
    }

    // Vérifier que le code n'existe pas déjà
    const existingPromo = await prisma.promotion.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (existingPromo) {
      return NextResponse.json(
        { error: 'Ce code promo existe déjà' },
        { status: 400 }
      )
    }

    // Créer la promotion
    const promotion = await prisma.promotion.create({
      data: {
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue: parseInt(discountValue),
        minimumAmount: minimumAmount ? parseInt(minimumAmount) : null,
        maxUses: maxUses ? parseInt(maxUses) : null,
        validFrom: validFrom ? new Date(validFrom) : new Date(),
        validUntil: validUntil ? new Date(validUntil) : null,
        isActive: isActive !== false,
        applicableProducts: applicableProducts ? JSON.stringify(applicableProducts) : null,
        applicableCategories: applicableCategories ? JSON.stringify(applicableCategories) : null
      }
    })

    return NextResponse.json({
      success: true,
      promotion
    })
  } catch (error) {
    console.error('Erreur lors de la création de la promotion:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
})

