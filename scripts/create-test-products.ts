/**
 * Script pour créer des produits de test dans la base de données
 * Usage: npx tsx scripts/create-test-products.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTestProducts() {
  console.log('🚀 Création de produits de test...\n')

  try {
    // 1. Créer des catégories
    console.log('1️⃣ Création des catégories...')
    
    const category1 = await prisma.category.upsert({
      where: { slug: 'huiles-cbd' },
      update: {},
      create: {
        name: 'Huiles CBD',
        slug: 'huiles-cbd',
      },
    })
    console.log(`   ✅ ${category1.name}`)

    const category2 = await prisma.category.upsert({
      where: { slug: 'fleurs-cbd' },
      update: {},
      create: {
        name: 'Fleurs CBD',
        slug: 'fleurs-cbd',
      },
    })
    console.log(`   ✅ ${category2.name}`)

    const category3 = await prisma.category.upsert({
      where: { slug: 'cosmetiques-cbd' },
      update: {},
      create: {
        name: 'Cosmétiques CBD',
        slug: 'cosmetiques-cbd',
      },
    })
    console.log(`   ✅ ${category3.name}\n`)

    // 2. Créer des produits
    console.log('2️⃣ Création des produits...')

    const products = [
      {
        title: 'Huile CBD 10% Premium',
        slug: 'huile-cbd-10-premium',
        description: 'Huile CBD de qualité supérieure à 10% de concentration. Idéale pour la relaxation et le bien-être quotidien.',
        priceCents: 4999, // 49.99€
        cbdPercent: 10,
        stock: 100,
        categoryId: category1.id,
        images: ['/logo.png'],
      },
      {
        title: 'Huile CBD 20% Forte',
        slug: 'huile-cbd-20-forte',
        description: 'Huile CBD à haute concentration (20%) pour un usage intensif. Parfaite pour les utilisateurs expérimentés.',
        priceCents: 7999, // 79.99€
        cbdPercent: 20,
        stock: 50,
        categoryId: category1.id,
        images: ['/logo2.png'],
      },
      {
        title: 'Fleurs CBD Amnesia Haze',
        slug: 'fleurs-cbd-amnesia-haze',
        description: 'Fleurs CBD premium de variété Amnesia Haze. Goût citronné et effets relaxants.',
        priceCents: 2999, // 29.99€
        cbdPercent: 15,
        stock: 75,
        categoryId: category2.id,
        images: ['/logo.png'],
      },
      {
        title: 'Crème CBD Relaxante',
        slug: 'creme-cbd-relaxante',
        description: 'Crème topique au CBD pour application locale. Aide à soulager les tensions musculaires.',
        priceCents: 3499, // 34.99€
        cbdPercent: 5,
        stock: 60,
        categoryId: category3.id,
        images: ['/logo2.png'],
      },
      {
        title: 'Gommes CBD 25mg',
        slug: 'gommes-cbd-25mg',
        description: 'Gommes au CBD avec 25mg par pièce. Goût fruité et dosage précis.',
        priceCents: 2499, // 24.99€
        cbdPercent: 2.5,
        stock: 120,
        categoryId: category1.id,
        images: ['/logo.png'],
      },
    ]

    for (const productData of products) {
      const { categoryId, images, ...productInfo } = productData
      
      const product = await prisma.product.upsert({
        where: { slug: productData.slug },
        update: {
          ...productInfo,
          images: JSON.stringify(images),
        },
        create: {
          ...productInfo,
          images: JSON.stringify(images),
          published: true,
          isFeatured: productData.slug === 'huile-cbd-10-premium',
          categories: {
            connect: { id: categoryId },
          },
        },
      })
      
      console.log(`   ✅ ${product.title} (${product.priceCents / 100}€)`)
    }

    console.log('\n✅ Produits de test créés avec succès!')
    console.log(`\n📊 Résumé:`)
    console.log(`   - Catégories: 3`)
    console.log(`   - Produits: ${products.length}`)
    console.log(`\n💡 Vous pouvez maintenant tester l'application!`)

  } catch (error: any) {
    console.error('❌ Erreur lors de la création des produits:', error)
    
    if (error.code === 'P1001') {
      console.error('\n💡 La base de données n\'est pas accessible.')
      console.error('   Vérifiez que DATABASE_URL est correctement configurée.')
    } else if (error.code === 'P2021') {
      console.error('\n💡 Les tables n\'existent pas dans la base de données.')
      console.error('   Exécutez d\'abord les migrations Prisma:')
      console.error('   npx prisma migrate deploy')
      console.error('   ou')
      console.error('   npx prisma db push')
    }
  } finally {
    await prisma.$disconnect()
  }
}

createTestProducts()

