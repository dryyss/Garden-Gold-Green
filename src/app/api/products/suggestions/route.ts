import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * API pour obtenir des suggestions de produits basées sur un produit donné
 * Algorithme de suggestion basé sur :
 * - Catégories similaires
 * - Prix similaire (±30%)
 * - Produits en vedette
 * - Produits récents
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const categoryId = searchParams.get('categoryId')
    const categoryName = searchParams.get('category')
    const priceCents = searchParams.get('priceCents')
    const limit = parseInt(searchParams.get('limit') || '4')

    if (!productId && !categoryId && !categoryName && !priceCents) {
      // Si aucun paramètre, retourner les produits en vedette
      const featuredProducts = await prisma.product.findMany({
        where: {
          published: true,
          isFeatured: true,
        },
        include: {
          categories: true,
        },
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      })

      return NextResponse.json({
        success: true,
        products: featuredProducts.map(p => ({
          ...p,
          images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
        })),
      })
    }

    // Récupérer le produit de référence si productId fourni
    let referenceProduct = null
    if (productId) {
      referenceProduct = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          categories: true,
        },
      })
    }

    // Construire la requête de suggestion
    const where: any = {
      published: true,
    }

    // Exclure le produit de référence
    if (productId) {
      where.id = { not: productId }
    }

    // Suggestions basées sur les catégories
    const categoryIds: string[] = []
    if (referenceProduct?.categories) {
      categoryIds.push(...referenceProduct.categories.map(c => c.id))
    } else if (categoryId) {
      categoryIds.push(categoryId)
    } else if (categoryName) {
      const category = await prisma.category.findFirst({
        where: { slug: categoryName },
      })
      if (category) {
        categoryIds.push(category.id)
      }
    }

    // Récupérer les produits similaires
    let suggestions: any[] = []

    // 1. Produits de la même catégorie
    if (categoryIds.length > 0) {
      const sameCategoryProducts = await prisma.product.findMany({
        where: {
          ...where,
          categories: {
            some: {
              id: { in: categoryIds },
            },
          },
        },
        include: {
          categories: true,
        },
        take: limit * 2, // Prendre plus pour avoir du choix
        orderBy: [
          { isFeatured: 'desc' }, // Produits en vedette en premier
          { createdAt: 'desc' },
        ],
      })
      suggestions.push(...sameCategoryProducts)
    }

    // 2. Produits avec prix similaire (±30%)
    if (referenceProduct?.priceCents || priceCents) {
      const refPrice = referenceProduct?.priceCents || parseInt(priceCents!)
      const minPrice = Math.floor(refPrice * 0.7)
      const maxPrice = Math.ceil(refPrice * 1.3)

      const similarPriceProducts = await prisma.product.findMany({
        where: {
          ...where,
          priceCents: {
            gte: minPrice,
            lte: maxPrice,
          },
          // Exclure ceux déjà dans suggestions
          id: {
            notIn: suggestions.map(p => p.id),
          },
        },
        include: {
          categories: true,
        },
        take: limit,
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' },
        ],
      })
      suggestions.push(...similarPriceProducts)
    }

    // 3. Si pas assez de suggestions, ajouter des produits en vedette
    if (suggestions.length < limit) {
      const featuredProducts = await prisma.product.findMany({
        where: {
          ...where,
          isFeatured: true,
          id: {
            notIn: suggestions.map(p => p.id),
          },
        },
        include: {
          categories: true,
        },
        take: limit - suggestions.length,
        orderBy: {
          createdAt: 'desc',
        },
      })
      suggestions.push(...featuredProducts)
    }

    // 4. Si toujours pas assez, ajouter des produits récents
    if (suggestions.length < limit) {
      const recentProducts = await prisma.product.findMany({
        where: {
          ...where,
          id: {
            notIn: suggestions.map(p => p.id),
          },
        },
        include: {
          categories: true,
        },
        take: limit - suggestions.length,
        orderBy: {
          createdAt: 'desc',
        },
      })
      suggestions.push(...recentProducts)
    }

    // Limiter et formater les résultats
    const finalSuggestions = suggestions
      .slice(0, limit)
      .map(product => ({
        ...product,
        images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images,
      }))

    return NextResponse.json({
      success: true,
      products: finalSuggestions,
    })
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération des suggestions:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des suggestions',
        products: [],
      },
      { status: 500 }
    )
  }
}

