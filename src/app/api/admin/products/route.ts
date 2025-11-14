import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-utils'
import { filterProducts, listProducts, getProductBySlug, upsertProduct } from '@/lib/products-store'
import { prisma } from '@/lib/prisma'

// GET - Récupérer tous les produits avec pagination et filtres depuis le fichier JSON
export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const published = searchParams.get('published')
    const lowStock = searchParams.get('lowStock') === 'true'

    // Filtrer les produits
    let products = await filterProducts({
      search: search || undefined,
      category: category || undefined,
      featured: featured !== null ? featured === 'true' : undefined,
      published: published !== null ? published === 'true' : undefined,
      lowStock: lowStock || undefined,
    })

    // Trier par date de création (plus récent en premier)
    products = products.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime()
      const dateB = new Date(b.createdAt || 0).getTime()
      return dateB - dateA
    })

    // Calculer les statistiques de ventes pour chaque produit depuis Prisma
    const orders = await prisma.order.findMany({
      where: {
        status: {
          in: ['delivered', 'shipped', 'paid']
        }
      },
      include: {
        items: true
      }
    })
    
    // Créer un map des statistiques par produit
    const statsMap = new Map<string, { sales: number; revenue: number }>()
    
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const existing = statsMap.get(item.productId) || { sales: 0, revenue: 0 }
        statsMap.set(item.productId, {
          sales: existing.sales + item.quantity,
          revenue: existing.revenue + (item.priceCents * item.quantity)
        })
      })
    })
    
    const productsWithStats = products.map((product) => {
      const stats = statsMap.get(product.id) || { sales: 0, revenue: 0 }
      return {
        ...product,
        sales: stats.sales,
        revenue: stats.revenue,
        // S'assurer que les images sont un tableau
        images: Array.isArray(product.images) 
          ? product.images 
          : (typeof product.images === 'string' ? JSON.parse(product.images) : [])
      }
    })

    // Pagination
    const total = productsWithStats.length
    const skip = (page - 1) * limit
    const paginatedProducts = productsWithStats.slice(skip, skip + limit)

    return NextResponse.json({
      success: true,
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération des produits admin:', error)
    return NextResponse.json({ 
      error: 'Erreur interne du serveur',
      details: error?.message || 'Une erreur est survenue lors de la récupération des produits'
    }, { status: 500 })
  }
})

// POST - Créer un nouveau produit dans le fichier JSON
export const POST = requireAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      description,
      priceCents,
      currency = 'EUR',
      cbdPercent,
      sku,
      stock,
      images,
      categoryIds = [],
      published = true,
      isFeatured = false,
      variants = []
    } = body

    // Validation
    if (!title || !slug || !priceCents) {
      return NextResponse.json(
        { error: 'Titre, slug et prix sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si le slug existe déjà
    const existingProduct = await getProductBySlug(slug)
    if (existingProduct) {
      return NextResponse.json(
        { error: 'Un produit avec ce slug existe déjà' },
        { status: 400 }
      )
    }

    // Générer un ID unique
    const products = await listProducts()
    const maxId = Math.max(...products.map(p => parseInt(p.id) || 0), 0)
    const newId = String(maxId + 1)

    // Créer le produit avec ses variants
    const product = await upsertProduct({
      id: newId,
      title,
      slug,
      description: description || '',
      priceCents: parseInt(priceCents),
      currency,
      cbdPercent: cbdPercent ? parseFloat(cbdPercent) : null,
      sku: sku || undefined,
      stock: stock ? parseInt(stock) : 0,
      images: Array.isArray(images) ? images : (typeof images === 'string' ? [images] : []),
      published,
      isFeatured,
      categoryIds: categoryIds,
      variants: variants.map((variant: any) => ({
        id: `${newId}-v${variants.indexOf(variant) + 1}`,
        title: variant.title,
        priceCents: Math.round(parseFloat(variant.priceCents) * 100),
        stock: parseInt(variant.stock) || 0
      }))
    })

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        images: Array.isArray(product.images) 
          ? product.images 
          : (typeof product.images === 'string' ? JSON.parse(product.images) : [])
      }
    }, { status: 201 })
  } catch (error: any) {
    console.error('❌ Erreur lors de la création du produit:', error)
    return NextResponse.json(
      { 
        error: 'Erreur interne du serveur',
        details: error?.message || 'Une erreur est survenue lors de la création du produit'
      },
      { status: 500 }
    )
  }
})

