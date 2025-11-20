import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { listProducts } from '@/lib/products-store'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '12')

    // Récupérer les produits les plus vendus depuis les commandes livrées/expédiées/payées
    const topProductsQuery = await prisma.$queryRaw<Array<{
      productId: string
      totalSales: bigint
    }>>`
      SELECT 
        "productId",
        SUM("quantity")::bigint as "totalSales"
      FROM "OrderItem"
      INNER JOIN "Order" ON "OrderItem"."orderId" = "Order"."id"
      WHERE "Order"."status" IN ('delivered', 'shipped', 'paid')
      GROUP BY "productId"
      ORDER BY "totalSales" DESC
      LIMIT ${limit * 2}
    `

    // Convertir en map pour faciliter la recherche
    const salesMap = new Map<string, number>()
    topProductsQuery.forEach((item) => {
      salesMap.set(item.productId, Number(item.totalSales))
    })

    // Récupérer tous les produits publiés
    const allProducts = await listProducts()
    const publishedProducts = allProducts.filter(p => p.published)

    // Trier les produits par nombre de ventes
    const productsWithSales = publishedProducts
      .map(product => ({
        product,
        sales: salesMap.get(product.id) || 0
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, limit)

    // Si on n'a pas assez de produits avec des ventes, compléter avec les plus récents
    if (productsWithSales.length < limit) {
      const bestSellerIds = new Set(productsWithSales.map(p => p.product.id))
      const recentProducts = publishedProducts
        .filter(p => !bestSellerIds.has(p.id))
        .sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime()
          const dateB = new Date(b.createdAt || 0).getTime()
          return dateB - dateA
        })
        .slice(0, limit - productsWithSales.length)
        .map(product => ({
          product,
          sales: 0
        }))

      productsWithSales.push(...recentProducts)
    }

    return NextResponse.json({
      success: true,
      products: productsWithSales.map(({ product }) => product),
      sales: productsWithSales.map(({ product, sales }) => ({
        productId: product.id,
        sales
      }))
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des best sellers:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des best sellers' },
      { status: 500 }
    )
  }
}

