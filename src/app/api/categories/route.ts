import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Route publique pour récupérer toutes les catégories
export async function GET() {
  try {
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
        }
      }
    })

    // Formater les catégories avec le nombre de produits
    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      productCount: category._count.products
    }))

    return NextResponse.json({
      success: true,
      categories: formattedCategories
    })
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération des catégories:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur interne du serveur',
        categories: []
      },
      { status: 500 }
    )
  }
}

