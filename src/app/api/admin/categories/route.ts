import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '@/lib/auth-utils'

const prisma = new PrismaClient()

// GET - Récupérer toutes les catégories
export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get('includeProducts') === 'true'
    const includeCount = searchParams.get('includeCount') === 'true'

    const categories = await prisma.category.findMany({
      include: includeProducts ? {
        products: true
      } : undefined,
      orderBy: { name: 'asc' }
    })

    // Ajouter le nombre de produits si demandé
    let categoriesWithCount = categories
    if (includeCount) {
      categoriesWithCount = await Promise.all(
        categories.map(async (category) => {
          const productCount = await prisma.product.count({
            where: {
              categories: {
                some: {
                  id: category.id
                }
              }
            }
          })
          return {
            ...category,
            productCount
          }
        })
      )
    }

    return NextResponse.json({
      success: true,
      categories: categoriesWithCount
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
})

// POST - Créer une nouvelle catégorie
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

    // Vérifier si le slug existe déjà
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Une catégorie avec ce slug existe déjà' },
        { status: 400 }
      )
    }

    // Créer la catégorie
    const category = await prisma.category.create({
      data: {
        name,
        slug: slug.toLowerCase().replace(/\s+/g, '-')
      }
    })

    return NextResponse.json({
      success: true,
      category
    }, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
})

