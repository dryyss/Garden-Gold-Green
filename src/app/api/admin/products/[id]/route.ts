import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '@/lib/auth-utils'

const prisma = new PrismaClient()

// GET - Récupérer un produit spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(async (request: NextRequest) => {
    try {
      const { id } = await params

      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          categories: true,
          variants: true,
          orderItems: {
            where: {
              order: {
                status: { in: ['delivered', 'shipped'] }
              }
            },
            include: {
              order: true
            }
          }
        }
      })

      if (!product) {
        return NextResponse.json(
          { error: 'Produit non trouvé' },
          { status: 404 }
        )
      }

      // Calculer les statistiques
      const totalSales = product.orderItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalRevenue = product.orderItems.reduce(
        (sum, item) => sum + item.priceCents * item.quantity,
        0
      )

      return NextResponse.json({
        success: true,
        product: {
          ...product,
          sales: totalSales,
          revenue: totalRevenue,
          images: typeof product.images === 'string' 
            ? JSON.parse(product.images) 
            : product.images
        }
      })
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error)
      return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
    } finally {
      await prisma.$disconnect()
    }
  })(request)
}

// PATCH - Mettre à jour un produit
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
        isFeatured
      } = body

      // Vérifier si le produit existe
      const existingProduct = await prisma.product.findUnique({
        where: { id }
      })

      if (!existingProduct) {
        return NextResponse.json(
          { error: 'Produit non trouvé' },
          { status: 404 }
        )
      }

      // Vérifier si le slug est modifié et s'il existe déjà
      if (slug && slug !== existingProduct.slug) {
        const slugExists = await prisma.product.findUnique({
          where: { slug }
        })

        if (slugExists) {
          return NextResponse.json(
            { error: 'Un produit avec ce slug existe déjà' },
            { status: 400 }
          )
        }
      }

      // Préparer les données à mettre à jour
      const updateData: any = {}
      
      if (title !== undefined) updateData.title = title
      if (slug !== undefined) updateData.slug = slug
      if (description !== undefined) updateData.description = description
      if (priceCents !== undefined) updateData.priceCents = parseInt(priceCents)
      if (currency !== undefined) updateData.currency = currency
      if (cbdPercent !== undefined) updateData.cbdPercent = cbdPercent ? parseFloat(cbdPercent) : null
      if (sku !== undefined) updateData.sku = sku
      if (stock !== undefined) updateData.stock = parseInt(stock)
      if (images !== undefined) {
        updateData.images = typeof images === 'string' 
          ? images 
          : JSON.stringify(images)
      }
      if (published !== undefined) updateData.published = published
      if (isFeatured !== undefined) updateData.isFeatured = isFeatured

      // Mettre à jour le produit
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          ...updateData,
          ...(categoryIds !== undefined && {
            categories: categoryIds.length > 0 ? {
              set: categoryIds.map((catId: string) => ({ id: catId }))
            } : {
              set: []
            }
          })
        },
        include: {
          categories: true,
          variants: true
        }
      })

      return NextResponse.json({
        success: true,
        product: {
          ...updatedProduct,
          images: typeof updatedProduct.images === 'string' 
            ? JSON.parse(updatedProduct.images) 
            : updatedProduct.images
        }
      })
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error)
      return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
    } finally {
      await prisma.$disconnect()
    }
  })(request)
}

// DELETE - Supprimer un produit
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(async (request: NextRequest) => {
    try {
      const { id } = await params

      // Vérifier si le produit existe
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          orderItems: true
        }
      })

      if (!product) {
        return NextResponse.json(
          { error: 'Produit non trouvé' },
          { status: 404 }
        )
      }

      // Ne pas permettre la suppression si le produit a des commandes
      if (product.orderItems.length > 0) {
        return NextResponse.json(
          { error: 'Impossible de supprimer un produit avec des commandes associées' },
          { status: 400 }
        )
      }

      // Supprimer le produit
      await prisma.product.delete({
        where: { id }
      })

      return NextResponse.json({
        success: true,
        message: 'Produit supprimé avec succès'
      })
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error)
      return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
    } finally {
      await prisma.$disconnect()
    }
  })(request)
}

