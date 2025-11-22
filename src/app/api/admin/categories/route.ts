import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'

// GET - Récupérer toutes les catégories depuis Prisma
export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get('includeProducts') === 'true'
    const includeCount = searchParams.get('includeCount') === 'true'

    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            products: {
              where: {
                published: true
              }
            }
          }
        },
        ...(includeProducts ? {
          products: {
            where: {
              published: true
            }
          }
        } : {})
      }
    })

    // Formater les catégories
    let categoriesWithCount = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      ...(includeCount ? { productCount: category._count.products } : {}),
      ...(includeProducts ? { products: category.products } : {})
    }))

    return NextResponse.json({
      success: true,
      categories: categoriesWithCount
    })
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération des catégories:', error)
    return NextResponse.json({ 
      error: 'Erreur interne du serveur',
      details: error?.message || 'Une erreur est survenue lors de la récupération des catégories'
    }, { status: 500 })
  }
})

// POST - Créer une nouvelle catégorie dans Prisma
export const POST = requireAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { name, slug } = body

    // Validation
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Nom et slug sont requis' },
        { status: 400 }
      )
    }

    // Normaliser le slug
    const finalSlug = slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    // Vérifier si le slug existe déjà dans Prisma
    const existingCategory = await prisma.category.findUnique({
      where: { slug: finalSlug }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Une catégorie avec ce slug existe déjà' },
        { status: 400 }
      )
    }

    // Créer la catégorie dans Prisma
    const category = await prisma.category.create({
      data: {
        name,
        slug: finalSlug
      }
    })

    return NextResponse.json({
      success: true,
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug
      }
    }, { status: 201 })
  } catch (error: any) {
    console.error('❌ Erreur lors de la création de la catégorie:', error)
    return NextResponse.json({ 
      error: 'Erreur interne du serveur',
      details: error?.message || 'Une erreur est survenue lors de la création de la catégorie'
    }, { status: 500 })
  }
})

