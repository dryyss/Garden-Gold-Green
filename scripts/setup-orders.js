#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function setupOrders() {
  console.log('🚀 Configuration du système de commandes...')

  try {
    // Vérifier la connexion à la base de données
    await prisma.$connect()
    console.log('✅ Connexion à la base de données établie')

    // Vérifier les tables nécessaires
    const tables = await prisma.$queryRaw`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name IN ('Order', 'OrderItem', 'User', 'Product')
    `
    
    const tableNames = tables.map(t => t.name)
    const requiredTables = ['Order', 'OrderItem', 'User', 'Product']
    
    const missingTables = requiredTables.filter(table => !tableNames.includes(table))
    
    if (missingTables.length > 0) {
      console.error('❌ Tables manquantes:', missingTables)
      console.log('💡 Exécutez: npx prisma db push')
      process.exit(1)
    }
    
    console.log('✅ Toutes les tables nécessaires sont présentes')

    // Vérifier les commandes existantes
    const orderCount = await prisma.order.count()
    console.log(`📦 ${orderCount} commande(s) trouvée(s) dans la base de données`)

    // Vérifier les utilisateurs
    const userCount = await prisma.user.count()
    console.log(`👥 ${userCount} utilisateur(s) trouvé(s) dans la base de données`)

    // Vérifier les produits
    const productCount = await prisma.product.count()
    console.log(`🛍️ ${productCount} produit(s) trouvé(s) dans la base de données`)

    // Tester la création d'une commande de test
    console.log('🧪 Test de création d\'une commande...')
    
    const testUser = await prisma.user.findFirst()
    if (!testUser) {
      console.log('⚠️ Aucun utilisateur trouvé, création d\'un utilisateur de test...')
      const newUser = await prisma.user.create({
        data: {
          id: 'test-user-' + Date.now(),
          email: 'test@example.com',
          name: 'Utilisateur Test',
          auth0Id: 'test-auth0-id'
        }
      })
      console.log('✅ Utilisateur de test créé:', newUser.id)
    }

    const testProduct = await prisma.product.findFirst()
    if (!testProduct) {
      console.log('⚠️ Aucun produit trouvé, création d\'un produit de test...')
      const newProduct = await prisma.product.create({
        data: {
          id: 'test-product-' + Date.now(),
          name: 'Produit Test',
          description: 'Description du produit test',
          price: 2999, // 29.99€ en centimes
          image: '/logo.png',
          category: 'test',
          inStock: true,
          stockQuantity: 100
        }
      })
      console.log('✅ Produit de test créé:', newProduct.id)
    }

    console.log('✅ Système de commandes configuré avec succès!')
    console.log('\n📋 Résumé:')
    console.log(`- ${await prisma.order.count()} commande(s)`)
    console.log(`- ${await prisma.user.count()} utilisateur(s)`)
    console.log(`- ${await prisma.product.count()} produit(s)`)
    console.log(`- ${await prisma.orderItem.count()} article(s) de commande`)

  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

async function testOrderFlow() {
  console.log('🧪 Test du flux de commande...')

  try {
    await prisma.$connect()

    // Créer un utilisateur de test
    const testUser = await prisma.user.upsert({
      where: { email: 'test-order@example.com' },
      update: {},
      create: {
        id: 'test-order-user-' + Date.now(),
        email: 'test-order@example.com',
        name: 'Test Order User',
        auth0Id: 'test-order-auth0-id'
      }
    })

    // Créer un produit de test
    const testProduct = await prisma.product.upsert({
      where: { id: 'test-order-product' },
      update: {},
      create: {
        id: 'test-order-product',
        name: 'Produit Test Commande',
        description: 'Description du produit test pour commande',
        price: 1999, // 19.99€ en centimes
        image: '/logo.png',
        category: 'test',
        inStock: true,
        stockQuantity: 50
      }
    })

    // Créer une commande de test
    const testOrder = await prisma.order.create({
      data: {
        userId: testUser.id,
        totalCents: 3998, // 39.98€
        currency: 'EUR',
        status: 'pending',
        customerEmail: testUser.email,
        customerName: testUser.name,
        shippingAddress: {
          firstName: 'Test',
          lastName: 'User',
          email: testUser.email,
          address: '123 Rue Test',
          city: 'Paris',
          postalCode: '75001',
          country: 'France'
        },
        items: {
          create: [
            {
              productId: testProduct.id,
              name: testProduct.name,
              priceCents: testProduct.price,
              quantity: 2
            }
          ]
        }
      },
      include: {
        items: true
      }
    })

    console.log('✅ Commande de test créée:', testOrder.id)
    console.log('📦 Articles:', testOrder.items.length)
    console.log('💰 Total:', (testOrder.totalCents / 100).toFixed(2) + '€')

    // Tester la récupération de la commande
    const retrievedOrder = await prisma.order.findUnique({
      where: { id: testOrder.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (retrievedOrder) {
      console.log('✅ Récupération de commande réussie')
    } else {
      console.log('❌ Échec de la récupération de commande')
    }

    // Nettoyer les données de test
    await prisma.order.delete({ where: { id: testOrder.id } })
    await prisma.user.delete({ where: { id: testUser.id } })
    await prisma.product.delete({ where: { id: testProduct.id } })

    console.log('✅ Test du flux de commande réussi!')

  } catch (error) {
    console.error('❌ Erreur lors du test:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Gestion des arguments de ligne de commande
const command = process.argv[2]

switch (command) {
  case 'setup':
    setupOrders()
    break
  case 'test':
    testOrderFlow()
    break
  default:
    console.log('Usage: node scripts/setup-orders.js [setup|test]')
    console.log('  setup - Configurer le système de commandes')
    console.log('  test  - Tester le flux de commande')
    process.exit(1)
}

