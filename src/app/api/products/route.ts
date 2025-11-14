import { NextRequest, NextResponse } from 'next/server'
import { listProducts, getProductBySlug } from '@/lib/products-store'

// GET - Récupérer tous les produits ou un produit par slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (slug) {
      // Récupérer un produit par slug
      const product = await getProductBySlug(slug)
      if (!product) {
        return NextResponse.json(
          { error: 'Produit non trouvé' },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        product
      })
    }

    // Récupérer tous les produits
    const products = await listProducts()
    return NextResponse.json({
      success: true,
      products
    })
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération des produits:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur', products: [] },
      { status: 500 }
    )
  }
}

