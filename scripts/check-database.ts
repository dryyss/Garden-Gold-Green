/**
 * Script de diagnostic pour vérifier l'état de la base de données
 * Usage: npx tsx scripts/check-database.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})

async function checkDatabase() {
  console.log('🔍 Vérification de la base de données...\n')

  try {
    // 1. Vérifier la connexion
    console.log('1️⃣ Test de connexion...')
    await prisma.$connect()
    console.log('✅ Connexion à la base de données réussie\n')

    // 2. Vérifier les tables
    console.log('2️⃣ Vérification des tables...')
    
    // Compter les produits
    const productCount = await prisma.product.count()
    console.log(`   📦 Produits: ${productCount}`)
    
    // Compter les catégories
    const categoryCount = await prisma.category.count()
    console.log(`   🏷️  Catégories: ${categoryCount}`)
    
    // Compter les utilisateurs
    const userCount = await prisma.user.count()
    console.log(`   👤 Utilisateurs: ${userCount}`)
    
    // Compter les commandes
    const orderCount = await prisma.order.count()
    console.log(`   🛒 Commandes: ${orderCount}\n`)

    // 3. Afficher quelques produits
    if (productCount > 0) {
      console.log('3️⃣ Aperçu des produits:')
      const products = await prisma.product.findMany({
        take: 5,
        include: {
          categories: true,
        },
      })
      
      products.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.title} (${product.slug})`)
        console.log(`      Prix: ${product.priceCents / 100}€`)
        console.log(`      Stock: ${product.stock}`)
        console.log(`      Publié: ${product.published ? 'Oui' : 'Non'}`)
        console.log(`      Catégories: ${product.categories.map(c => c.name).join(', ') || 'Aucune'}`)
        console.log('')
      })
    } else {
      console.log('⚠️  Aucun produit trouvé dans la base de données')
      console.log('   💡 Vous devez créer des produits ou importer des données\n')
    }

    // 4. Vérifier les catégories
    if (categoryCount > 0) {
      console.log('4️⃣ Catégories disponibles:')
      const categories = await prisma.category.findMany({
        take: 10,
      })
      
      categories.forEach((category) => {
        console.log(`   - ${category.name} (${category.slug})`)
      })
      console.log('')
    }

    // 5. Vérifier la configuration
    console.log('5️⃣ Configuration:')
    console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Définie' : '❌ Non définie'}`)
    if (process.env.DATABASE_URL) {
      const url = new URL(process.env.DATABASE_URL)
      console.log(`   Host: ${url.hostname}`)
      console.log(`   Database: ${url.pathname.replace('/', '')}`)
    }
    console.log('')

  } catch (error: any) {
    console.error('❌ Erreur lors de la vérification:', error)
    
    if (error.code === 'P1001') {
      console.error('\n💡 La base de données n\'est pas accessible.')
      console.error('   Vérifiez que:')
      console.error('   1. DATABASE_URL est correctement configurée')
      console.error('   2. La base de données PostgreSQL est démarrée')
      console.error('   3. Les credentials sont corrects')
    } else if (error.code === 'P2021') {
      console.error('\n💡 La table n\'existe pas dans la base de données.')
      console.error('   Exécutez les migrations Prisma:')
      console.error('   npx prisma migrate deploy')
    }
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()




