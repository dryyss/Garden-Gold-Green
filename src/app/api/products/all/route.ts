import { NextResponse } from 'next/server'
import { listProducts } from '@/lib/products-store'

// Route pour récupérer tous les produits (pour les pages client)
export async function GET() {
  try {
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

