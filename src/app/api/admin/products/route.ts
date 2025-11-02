import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '@/lib/auth-utils'

const prisma = new PrismaClient()

// GET - Récupérer tous les produits avec pagination et filtres
export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const published = searchParams.get('published')
    const lowStock = searchParams.get('lowStock') === 'true'

    const whereClause: any = {}

    // Recherche par titre
    if (search) {
      whereClause.title = {
        contains: search,
        mode: 'insensitive'
      }
    }

    // Filtre par catégorie
    if (category) {
      whereClause.categories = {
        some: {
          slug: category
        }
      }
    }

    // Filtre par featured
    if (featured !== null) {
      whereClause.isFeatured = featured === 'true'
    }

    // Filtre par published
    if (published !== null) {
      whereClause.published = published === 'true'
    }

    // Filtre stock faible
    if (lowStock) {
      whereClause.stock = {
        lte: 10
      }
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          categories: true,
          variants: true,
          orderItems: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.product.count({ where: whereClause })
    ])

    // Calculer les statistiques de ventes pour chaque produit
    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        // Compter les commandes livrées pour ce produit
        const orderItems = await prisma.orderItem.findMany({
          where: {
            productId: product.id,
            order: {
              status: { in: ['delivered', 'shipped'] }
            }
          },
          include: {
            order: true
          }
        })

        const totalSales = orderItems.reduce((sum, item) => sum + item.quantity, 0)
        const totalRevenue = orderItems.reduce(
          (sum, item) => sum + item.priceCents * item.quantity,
          0
        )

        return {
          ...product,
          sales: totalSales,
          revenue: totalRevenue,
          // Calculer les images
          images: typeof product.images === 'string' 
            ? JSON.parse(product.images) 
            : product.images
        }
      })
    )

    return NextResponse.json({
      success: true,
      products: productsWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des produits admin:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
})

// POST - Créer un nouveau produit
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
      isFeatured = false
    } = body

    // Validation
    if (!title || !slug || !priceCents) {
      return NextResponse.json(
        { error: 'Titre, slug et prix sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si le slug existe déjà
    const existingProduct = await prisma.product.findUnique({
      where: { slug }
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Un produit avec ce slug existe déjà' },
        { status: 400 }
      )
    }

    // Créer le produit
    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        priceCents: parseInt(priceCents),
        currency,
        cbdPercent: cbdPercent ? parseFloat(cbdPercent) : null,
        sku,
        stock: stock ? parseInt(stock) : 0,
        images: typeof images === 'string' ? images : JSON.stringify(images),
        published,
        isFeatured,
        categories: categoryIds.length > 0 ? {
          connect: categoryIds.map((id: string) => ({ id }))
        } : undefined
      },
      include: {
        categories: true
      }
    })

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
})

