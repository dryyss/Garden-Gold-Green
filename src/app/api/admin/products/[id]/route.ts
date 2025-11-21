import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-utils'
import { getProductById, getProductBySlug, upsertProduct, deleteProduct } from '@/lib/products-store'
import { prisma } from '@/lib/prisma'

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

      // Calculer les statistiques depuis Prisma
      const orderItems = await prisma.orderItem.findMany({
        where: {
          productId: product.id,
          order: {
            status: {
              in: ['delivered', 'shipped', 'paid']
            }
          }
        }
      })
      
      let totalSales = 0
      let totalRevenue = 0

      orderItems.forEach((item) => {
        totalSales += item.quantity
        totalRevenue += item.priceCents * item.quantity
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
        isNew,
        isOnSale,
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
      if (isNew !== undefined) updateData.isNew = isNew
      if (isOnSale !== undefined) updateData.isOnSale = isOnSale
      
      // Convertir les categoryIds en catégories Prisma
      if (categoryIds !== undefined) {
        if (categoryIds && categoryIds.length > 0) {
          const categories = await prisma.category.findMany({
            where: { id: { in: categoryIds } }
          })
          updateData.categories = categories.map(cat => ({
            name: cat.name,
            slug: cat.slug
          }))
        } else {
          updateData.categories = []
        }
      }
      
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
      const orderItems = await prisma.orderItem.findFirst({
        where: {
          productId: id
        }
      })
      
      const hasOrders = !!orderItems

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

