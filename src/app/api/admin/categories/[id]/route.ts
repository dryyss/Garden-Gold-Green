import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-utils'

// GET - Récupérer une catégorie spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(async (request: NextRequest) => {
    try {
      const { id } = await params

      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          products: {
            select: {
              id: true,
              title: true,
              priceCents: true,
              stock: true,
              published: true
            }
          }
        }
      })

      if (!category) {
        return NextResponse.json(
          { error: 'Catégorie non trouvée' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        category
      })
    } catch (error) {
      console.error('Erreur lors de la récupération de la catégorie:', error)
      return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
    }
  })(request)
}

// PATCH - Mettre à jour une catégorie
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(async (request: NextRequest) => {
    try {
      const { id } = await params
      const body = await request.json()
      const { name, slug } = body

      const category = await prisma.category.findUnique({
        where: { id }
      })

      if (!category) {
        return NextResponse.json(
          { error: 'Catégorie non trouvée' },
          { status: 404 }
        )
      }

      // Vérifier si le nouveau slug existe déjà (si différent)
      if (slug && slug !== category.slug) {
        const existingCategory = await prisma.category.findUnique({
          where: { slug: slug.toLowerCase().replace(/\s+/g, '-') }
        })

        if (existingCategory) {
          return NextResponse.json(
            { error: 'Une catégorie avec ce slug existe déjà' },
            { status: 400 }
          )
        }
      }

      const updatedCategory = await prisma.category.update({
        where: { id },
        data: {
          name: name || category.name,
          slug: slug ? slug.toLowerCase().replace(/\s+/g, '-') : category.slug
        }
      })

      return NextResponse.json({
        success: true,
        category: updatedCategory
      })
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie:', error)
      return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
    }
  })(request)
}

// DELETE - Supprimer une catégorie
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(async (request: NextRequest) => {
    try {
      const { id } = await params

      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          products: true
        }
      })

      if (!category) {
        return NextResponse.json(
          { error: 'Catégorie non trouvée' },
          { status: 404 }
        )
      }

      // Vérifier s'il y a des produits associés
      if (category.products.length > 0) {
        return NextResponse.json(
          { error: `Impossible de supprimer cette catégorie car elle contient ${category.products.length} produit(s)` },
          { status: 400 }
        )
      }

      await prisma.category.delete({
        where: { id }
      })

      return NextResponse.json({
        success: true,
        message: 'Catégorie supprimée avec succès'
      })
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error)
      return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
    }
  })(request)
}

