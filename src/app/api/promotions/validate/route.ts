import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth0 } from '@/lib/auth0'

// Cache la validation pendant 10 secondes (les codes promo ne changent pas souvent)
export const revalidate = 10

// POST - Valider un code promo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, cartTotal, productIds } = body

    if (!code) {
      return NextResponse.json(
        { error: 'Code promo requis' },
        { status: 400 }
      )
    }

    // Récupérer l'utilisateur connecté (optionnel - pour vérifier l'utilisation par utilisateur)
    let userId: string | null = null
    try {
      const session = await auth0.getSession(request)
      userId = session?.user?.sub || null
    } catch (error) {
      // Si l'utilisateur n'est pas connecté, on continue quand même (pour les codes sans limite par utilisateur)
      console.log('Utilisateur non connecté pour validation code promo')
    }

    // Rechercher la promotion
    const promotion = await prisma.promotion.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (!promotion) {
      return NextResponse.json(
        { error: 'Code promo invalide' },
        { status: 404 }
      )
    }

    // Vérifications
    const now = new Date()

    // 1. Promotion active ?
    if (!promotion.isActive) {
      return NextResponse.json(
        { error: 'Cette promotion n\'est plus active' },
        { status: 400 }
      )
    }

    // 2. Date de validité
    if (promotion.validFrom && new Date(promotion.validFrom) > now) {
      return NextResponse.json(
        { error: 'Cette promotion n\'est pas encore active' },
        { status: 400 }
      )
    }

    if (promotion.validUntil && new Date(promotion.validUntil) < now) {
      return NextResponse.json(
        { error: 'Cette promotion a expiré' },
        { status: 400 }
      )
    }

    // 3. Nombre d'utilisations maximum (global)
    if (promotion.maxUses && promotion.usedCount >= promotion.maxUses) {
      return NextResponse.json(
        { error: 'Cette promotion a atteint son nombre maximum d\'utilisations' },
        { status: 400 }
      )
    }

    // 3.5. Vérifier si l'utilisateur a déjà utilisé ce code promo
    if (userId && promotion.maxUses) {
      // Chercher dans les commandes de l'utilisateur si ce code a déjà été utilisé
      const userOrders = await prisma.order.findMany({
        where: {
          userId: userId,
          status: {
            in: ['paid', 'processing', 'shipped', 'delivered']
          }
        },
        select: {
          metadata: true
        }
      })

      // Vérifier si le code promo est dans les métadonnées d'une commande
      const hasUsedCode = userOrders.some(order => {
        const metadata = order.metadata as any
        return metadata?.promoCode === code.toUpperCase()
      })

      if (hasUsedCode) {
        return NextResponse.json(
          { error: 'Vous avez déjà utilisé ce code promo' },
          { status: 400 }
        )
      }
    }

    // 4. Montant minimum
    if (promotion.minimumAmount && cartTotal < promotion.minimumAmount) {
      return NextResponse.json(
        { 
          error: `Montant minimum de ${(promotion.minimumAmount / 100).toFixed(2)}€ requis pour utiliser ce code` 
        },
        { status: 400 }
      )
    }

    // 5. Produits applicables
    if (promotion.applicableProducts) {
      const applicableProductIds = JSON.parse(promotion.applicableProducts)
      const hasApplicableProduct = productIds?.some((id: string) => applicableProductIds.includes(id))
      
      if (!hasApplicableProduct) {
        return NextResponse.json(
          { error: 'Ce code promo ne s\'applique pas aux produits de votre panier' },
          { status: 400 }
        )
      }
    }

    // Calculer la remise
    let discountAmount = 0
    if (promotion.discountType === 'percentage') {
      discountAmount = Math.floor((cartTotal * promotion.discountValue) / 100)
    } else if (promotion.discountType === 'fixed') {
      discountAmount = promotion.discountValue
    }

    // Ne pas permettre une remise supérieure au total
    if (discountAmount > cartTotal) {
      discountAmount = cartTotal
    }

    return NextResponse.json({
      success: true,
      promotion: {
        id: promotion.id,
        code: promotion.code,
        description: promotion.description,
        discountType: promotion.discountType,
        discountValue: promotion.discountValue
      },
      discountAmount,
      newTotal: cartTotal - discountAmount
    })
  } catch (error) {
    console.error('Erreur lors de la validation du code promo:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

