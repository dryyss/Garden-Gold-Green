import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-utils'
import { getProductById, getProductBySlug, upsertProduct, deleteProduct } from '@/lib/products-store'
import ordersData from '@/data/orders.json'

// GET - Récupérer un produit spécifique depuis le fichier JSON
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(async (request: NextRequest) => {
    try {
      const { id } = await params

      const product = await getProductById(id)

      if (!product) {
        return NextResponse.json(
          { error: 'Produit non trouvé' },
          { status: 404 }
        )
      }

      // Calculer les statistiques depuis orders.json
      const ordersMap = typeof ordersData === 'object' && !Array.isArray(ordersData) 
        ? ordersData as Record<string, any>
        : {}
      
      let totalSales = 0
      let totalRevenue = 0

      Object.values(ordersMap).forEach((order: any) => {
        if (order.status === 'delivered' || order.status === 'shipped') {
          order.items?.forEach((item: any) => {
            if (item.productId === product.id) {
              totalSales += item.quantity || 0
              totalRevenue += (item.priceCents || 0) * (item.quantity || 0)
            }
          })
        }
      })

      return NextResponse.json({
        success: true,
        product: {
          ...product,
          sales: totalSales,
          revenue: totalRevenue,
          images: Array.isArray(product.images) 
            ? product.images 
            : (typeof product.images === 'string' ? JSON.parse(product.images) : [])
        }
      })
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération du produit:', error)
      return NextResponse.json({ 
        error: 'Erreur interne du serveur',
        details: error?.message || 'Une erreur est survenue lors de la récupération du produit'
      }, { status: 500 })
    }
  })(request)
}

// PATCH - Mettre à jour un produit dans le fichier JSON
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(async (request: NextRequest) => {
    try {
      const { id } = await params
      const body = await request.json()
      
      const {
        title,
        slug,
        description,
        priceCents,
        currency,
        cbdPercent,
        sku,
        stock,
        images,
        categoryIds,
        published,
        isFeatured,
        variants
      } = body

      // Vérifier si le produit existe
      const existingProduct = await getProductById(id)

      if (!existingProduct) {
        return NextResponse.json(
          { error: 'Produit non trouvé' },
          { status: 404 }
        )
      }

      // Vérifier si le slug est modifié et s'il existe déjà
      if (slug && slug !== existingProduct.slug) {
        const { getProductBySlug } = await import('@/lib/products-store')
        const slugExists = await getProductBySlug(slug)

        if (slugExists) {
          return NextResponse.json(
            { error: 'Un produit avec ce slug existe déjà' },
            { status: 400 }
          )
        }
      }

      // Préparer les données à mettre à jour
      const updateData: any = {
        id,
        ...existingProduct
      }
      
      if (title !== undefined) updateData.title = title
      if (slug !== undefined) updateData.slug = slug
      if (description !== undefined) updateData.description = description
      if (priceCents !== undefined) updateData.priceCents = parseInt(priceCents)
      if (currency !== undefined) updateData.currency = currency
      if (cbdPercent !== undefined) updateData.cbdPercent = cbdPercent ? parseFloat(cbdPercent) : null
      if (sku !== undefined) updateData.sku = sku
      if (stock !== undefined) updateData.stock = parseInt(stock)
      if (images !== undefined) {
        updateData.images = Array.isArray(images) ? images : (typeof images === 'string' ? [images] : [])
      }
      if (published !== undefined) updateData.published = published
      if (isFeatured !== undefined) updateData.isFeatured = isFeatured
      if (categoryIds !== undefined) updateData.categoryIds = categoryIds
      if (variants !== undefined) {
        updateData.variants = variants.map((variant: any, index: number) => ({
          id: variant.id || `${id}-v${index + 1}`,
          title: variant.title,
          priceCents: Math.round(parseFloat(variant.priceCents) * 100),
          stock: parseInt(variant.stock) || 0
        }))
      }

      // Mettre à jour le produit
      const { upsertProduct } = await import('@/lib/products-store')
      const updatedProduct = await upsertProduct(updateData)

      return NextResponse.json({
        success: true,
        product: {
          ...updatedProduct,
          images: Array.isArray(updatedProduct.images) 
            ? updatedProduct.images 
            : (typeof updatedProduct.images === 'string' ? JSON.parse(updatedProduct.images) : [])
        }
      })
    } catch (error: any) {
      console.error('❌ Erreur lors de la mise à jour du produit:', error)
      return NextResponse.json({ 
        error: 'Erreur interne du serveur',
        details: error?.message || 'Une erreur est survenue lors de la mise à jour du produit'
      }, { status: 500 })
    }
  })(request)
}

// DELETE - Supprimer un produit du fichier JSON
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(async (request: NextRequest) => {
    try {
      const { id } = await params

      // Vérifier si le produit existe
      const product = await getProductById(id)

      if (!product) {
        return NextResponse.json(
          { error: 'Produit non trouvé' },
          { status: 404 }
        )
      }

      // Vérifier si le produit a des commandes associées
      const ordersMap = typeof ordersData === 'object' && !Array.isArray(ordersData) 
        ? ordersData as Record<string, any>
        : {}
      
      let hasOrders = false
      Object.values(ordersMap).forEach((order: any) => {
        if (order.items?.some((item: any) => item.productId === id)) {
          hasOrders = true
        }
      })

      if (hasOrders) {
        return NextResponse.json(
          { error: 'Impossible de supprimer un produit avec des commandes associées' },
          { status: 400 }
        )
      }

      // Supprimer le produit
      const { deleteProduct } = await import('@/lib/products-store')
      const deleted = await deleteProduct(id)

      if (!deleted) {
        return NextResponse.json(
          { error: 'Produit non trouvé' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Produit supprimé avec succès'
      })
    } catch (error: any) {
      console.error('❌ Erreur lors de la suppression du produit:', error)
      return NextResponse.json({ 
        error: 'Erreur interne du serveur',
        details: error?.message || 'Une erreur est survenue lors de la suppression du produit'
      }, { status: 500 })
    }
  })(request)
}

