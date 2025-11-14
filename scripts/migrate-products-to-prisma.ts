#!/usr/bin/env tsx
/**
 * Script de migration : Importe les produits depuis products.json vers Prisma PostgreSQL
 * 
 * Usage: tsx scripts/migrate-products-to-prisma.ts
 */

import { PrismaClient } from '@prisma/client'
import productsData from '../src/data/products.json'
import categoriesData from '../src/data/categories.json'
import path from 'path'

const prisma = new PrismaClient()

interface ProductRecord {
  id: string
  title: string
  slug: string
  description?: string
  priceCents: number
  currency: string
  cbdPercent?: number | null
  sku?: string
  stock: number
  images: string[] | string
  published: boolean
  isFeatured?: boolean
  categories?: Array<{ name: string; slug: string }>
  variants?: Array<{
    id?: string
    title?: string
    weight?: number
    unit?: string
    priceCents?: number | string
    stock?: number | string
    sku?: string
    isDefault?: boolean
  }>
}

async function migrateProducts() {
  console.log('🚀 Début de la migration des produits vers Prisma...\n')

  try {
    // Vérifier la connexion
    await prisma.$connect()
    console.log('✅ Connexion à la base de données établie\n')

    const products = productsData as ProductRecord[]
    console.log(`📦 ${products.length} produits à migrer\n`)

    // Créer les catégories d'abord
    console.log('📂 Création des catégories...')
    const categoryMap = new Map<string, string>() // slug -> id

    for (const cat of categoriesData as Array<{ id: string; name: string; slug: string }>) {
      const existing = await prisma.category.findUnique({
        where: { slug: cat.slug }
      })

      if (!existing) {
        const created = await prisma.category.create({
          data: {
            id: cat.id,
            name: cat.name,
            slug: cat.slug
          }
        })
        categoryMap.set(cat.slug, created.id)
        console.log(`  ✅ Catégorie créée: ${cat.name}`)
      } else {
        categoryMap.set(cat.slug, existing.id)
        console.log(`  ⏭️  Catégorie existante: ${cat.name}`)
      }
    }
    console.log('')

    // Migrer les produits
    let successCount = 0
    let skipCount = 0
    let errorCount = 0

    for (const product of products) {
      try {
        // Vérifier si le produit existe déjà (par ID ou slug)
        const existingById = await prisma.product.findUnique({
          where: { id: product.id }
        })

        const existingBySlug = await prisma.product.findUnique({
          where: { slug: product.slug }
        })

        if (existingById) {
          console.log(`⏭️  Produit ${product.id} déjà existant: ${product.title}`)
          skipCount++
          continue
        }

        if (existingBySlug) {
          console.log(`⚠️  Produit ${product.id} a un slug déjà utilisé: ${product.slug}, modification du slug`)
          // Modifier le slug pour éviter le conflit
          product.slug = `${product.slug}-${product.id}`
        }

        // Convertir les images en JSON string
        const imagesJson = Array.isArray(product.images)
          ? JSON.stringify(product.images)
          : typeof product.images === 'string'
          ? JSON.stringify([product.images])
          : JSON.stringify([])

        // Créer le produit
        const createdProduct = await prisma.product.create({
          data: {
            id: product.id,
            title: product.title,
            slug: product.slug,
            description: product.description || null,
            priceCents: product.priceCents,
            currency: product.currency || 'EUR',
            cbdPercent: product.cbdPercent ?? null,
            sku: product.sku || null,
            stock: product.stock || 0,
            images: imagesJson,
            published: product.published !== false,
            isFeatured: product.isFeatured || false,
            categories: {
              connect: (product.categories || []).map(cat => ({
                slug: cat.slug
              })).filter(cat => categoryMap.has(cat.slug))
            }
          }
        })

        // Créer les variantes si elles existent
        if (product.variants && product.variants.length > 0) {
          for (const variant of product.variants) {
            await prisma.productVariant.create({
              data: {
                id: variant.id || `${product.id}-${variant.title || 'default'}`,
                title: variant.title || product.title,
                priceCents: typeof variant.priceCents === 'string'
                  ? parseInt(variant.priceCents)
                  : variant.priceCents || product.priceCents,
                stock: typeof variant.stock === 'string'
                  ? parseInt(variant.stock)
                  : variant.stock || 0,
                productId: createdProduct.id
              }
            })
          }
        }

        successCount++
        if (successCount % 10 === 0) {
          console.log(`  ✅ ${successCount} produits migrés...`)
        }
      } catch (error: any) {
        console.error(`  ❌ Erreur pour le produit ${product.id}:`, error.message)
        errorCount++
      }
    }

    console.log('\n📊 Résumé de la migration:')
    console.log(`  ✅ ${successCount} produits migrés avec succès`)
    console.log(`  ⏭️  ${skipCount} produits déjà existants`)
    console.log(`  ❌ ${errorCount} erreurs`)
    console.log(`\n✅ Migration terminée!`)

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter la migration
migrateProducts()
  .catch((error) => {
    console.error('❌ Erreur fatale:', error)
    process.exit(1)
  })

