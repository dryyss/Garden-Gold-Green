import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-utils'

// GET - Récupérer les statistiques de stock
export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const alertLevel = parseInt(searchParams.get('alertLevel') || '10')
    const category = searchParams.get('category')

    const whereClause: any = {}

    if (category) {
      whereClause.categories = {
        some: {
          slug: category
        }
      }
    }

    // Récupérer tous les produits
    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        categories: true,
        variants: true
      },
      orderBy: { stock: 'asc' }
    })

    // Calculer les statistiques
    const lowStockProducts = products.filter(p => p.stock <= alertLevel && p.stock > 0)
    const outOfStockProducts = products.filter(p => p.stock === 0)
    const totalValue = products.reduce((sum, p) => sum + (p.priceCents * p.stock), 0)
    const totalUnits = products.reduce((sum, p) => sum + p.stock, 0)

    // Produits avec variants
    const productsWithVariants = products.map(product => {
      const variantStock = product.variants.reduce((sum, v) => sum + v.stock, 0)
      const totalProductStock = product.stock + variantStock
      
      return {
        ...product,
        variantStock,
        totalStock: totalProductStock,
        images: typeof product.images === 'string' 
          ? JSON.parse(product.images) 
          : product.images
      }
    })

    return NextResponse.json({
      success: true,
      stock: {
        summary: {
          totalProducts: products.length,
          totalUnits,
          totalValueInCents: totalValue,
          totalValueInEuros: (totalValue / 100).toFixed(2),
          lowStockCount: lowStockProducts.length,
          outOfStockCount: outOfStockProducts.length
        },
        products: productsWithVariants,
        alerts: {
          lowStock: lowStockProducts.map(p => ({
            id: p.id,
            title: p.title,
            stock: p.stock,
            priceCents: p.priceCents
          })),
          outOfStock: outOfStockProducts.map(p => ({
            id: p.id,
            title: p.title,
            stock: p.stock,
            priceCents: p.priceCents
          }))
        }
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération du stock:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
})

// PATCH - Mettre à jour le stock d'un ou plusieurs produits
export const PATCH = requireAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { updates } = body // Array of { productId, stock }

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { error: 'Tableau de mises à jour requis' },
        { status: 400 }
      )
    }

    // Valider les données
    for (const update of updates) {
      if (!update.productId || update.stock === undefined) {
        return NextResponse.json(
          { error: 'productId et stock sont requis pour chaque mise à jour' },
          { status: 400 }
        )
      }

      if (isNaN(parseInt(update.stock))) {
        return NextResponse.json(
          { error: 'Le stock doit être un nombre' },
          { status: 400 }
        )
      }
    }

    // Mettre à jour les stocks
    const updatedProducts = await Promise.all(
      updates.map(async (update: { productId: string; stock: number }) => {
        const product = await prisma.product.update({
          where: { id: update.productId },
          data: { stock: parseInt(update.stock) },
          include: {
            categories: true
          }
        })

        return {
          id: product.id,
          title: product.title,
          stock: product.stock,
          images: typeof product.images === 'string' 
            ? JSON.parse(product.images) 
            : product.images
        }
      })
    )

    return NextResponse.json({
      success: true,
      message: `${updatedProducts.length} produit(s) mis à jour`,
      products: updatedProducts
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du stock:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
})

