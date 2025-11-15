import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-utils'
import categoriesData from '@/data/categories.json'
import { listProducts } from '@/lib/products-store'

// GET - Récupérer toutes les catégories depuis le fichier JSON
export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get('includeProducts') === 'true'
    const includeCount = searchParams.get('includeCount') === 'true'

    const categories = [...categoriesData]

    // Ajouter le nombre de produits si demandé
    let categoriesWithCount = categories
    if (includeCount) {
      const products = await listProducts()
      categoriesWithCount = categories.map((category) => {
        const productCount = products.filter((product: any) => 
          product.published && 
          product.categories?.some((cat: any) => cat.slug === category.slug)
        ).length
        
        return {
          ...category,
          productCount
        }
      })
    }

    // Ajouter les produits si demandé
    if (includeProducts) {
      const products = await listProducts()
      categoriesWithCount = categories.map((category) => {
        const categoryProducts = products.filter((product: any) =>
          product.published &&
          product.categories?.some((cat: any) => cat.slug === category.slug)
        )
        
        return {
          ...category,
          products: categoryProducts
        }
      })
    }

    return NextResponse.json({
      success: true,
      categories: categoriesWithCount
    })
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération des catégories:', error)
    return NextResponse.json({ 
      error: 'Erreur interne du serveur',
      details: error?.message || 'Une erreur est survenue lors de la récupération des catégories'
    }, { status: 500 })
  }
})

// POST - Créer une nouvelle catégorie
// Note: Avec les fichiers JSON, les nouvelles catégories ne sont pas persistées.
// Pour ajouter une catégorie de manière permanente, modifiez directement categories.json
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

    // Vérifier si le slug existe déjà dans le fichier JSON
    const existingCategory = categoriesData.find(
      (cat: any) => cat.slug === slug.toLowerCase().replace(/\s+/g, '-')
    )

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Une catégorie avec ce slug existe déjà' },
        { status: 400 }
      )
    }

    // Générer un ID unique
    const newId = `cat-${slug.toLowerCase().replace(/\s+/g, '-')}`
    const finalSlug = slug.toLowerCase().replace(/\s+/g, '-')

    // Créer la catégorie (en mémoire uniquement, pas persistée)
    const category = {
      id: newId,
      name,
      slug: finalSlug
    }

    // Note: Pour persister, il faudrait écrire dans categories.json
    // Ceci nécessiterait des permissions système et n'est pas recommandé en production
    console.warn('⚠️ Nouvelle catégorie créée en mémoire uniquement. Pour la persister, modifiez categories.json manuellement.')

    return NextResponse.json({
      success: true,
      category,
      warning: 'La catégorie a été créée en mémoire uniquement. Pour la persister, modifiez categories.json manuellement.'
    }, { status: 201 })
  } catch (error: any) {
    console.error('❌ Erreur lors de la création de la catégorie:', error)
    return NextResponse.json({ 
      error: 'Erreur interne du serveur',
      details: error?.message || 'Une erreur est survenue lors de la création de la catégorie'
    }, { status: 500 })
  }
})

