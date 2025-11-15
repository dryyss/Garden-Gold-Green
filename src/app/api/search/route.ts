import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Cache les résultats de recherche pendant 30 secondes
export const revalidate = 30

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')

    if (!query.trim()) {
      return NextResponse.json({ results: [] })
    }

    // Construction de la requête de recherche
    const searchQuery = {
      where: {
        published: true,
        AND: [
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' as const } },
              { description: { contains: query, mode: 'insensitive' as const } },
            ],
          },
        ],
      },
      include: {
        categories: true,
      },
      take: limit,
    }

    // Filtrer par catégorie si spécifiée
    if (category) {
      searchQuery.where.AND.push({
        categories: {
          some: {
            slug: category,
          },
        },
      } as any)
    }

    const products = await prisma.product.findMany(searchQuery)

    // Formater les résultats
    const results = products.map(product => ({
      id: product.id,
      name: product.title,
      slug: product.slug,
      description: product.description || '',
      price: product.priceCents / 100,
      image: JSON.parse(product.images || '[]')[0] || '/products/default.svg',
      categories: product.categories.map(cat => cat.name),
      cbdPercent: product.cbdPercent,
    }))

    return NextResponse.json({ results })
  } catch (error) {
    console.error('❌ Erreur recherche:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la recherche' },
      { status: 500 }
    )
  }
}







