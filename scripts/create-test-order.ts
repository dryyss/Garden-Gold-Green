import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Script pour créer une commande de test
 * Usage: tsx scripts/create-test-order.ts <auth0-user-id>
 */
async function createTestOrder(auth0UserId: string) {
  try {
    console.log(`🔍 Récupération des produits...`)
    
    // Récupérer les 3 premiers produits
    const products = await prisma.product.findMany({
      take: 3,
      select: {
        id: true,
        title: true,
        priceCents: true,
      }
    })

    if (products.length === 0) {
      console.error('❌ Aucun produit trouvé dans la base de données')
      console.log('💡 Exécutez d\'abord: npx tsx prisma/seed.ts')
      return
    }

    console.log(`📦 Produits trouvés: ${products.length}`)

    // Générer un numéro de commande plus lisible
    const orderNumber = `CMD-${Date.now().toString().slice(-8)}`

    // Calculer le total
    const totalCents = products.reduce((sum, p) => sum + p.priceCents, 0)

    // Créer la commande de test
    console.log(`\n🛒 Création de la commande de test...`)
    const order = await prisma.order.create({
      data: {
        id: orderNumber, // Utiliser notre numéro personnalisé
        userId: auth0UserId,
        totalCents,
        currency: 'EUR',
        status: 'paid',
        customerEmail: 'test@example.com',
        customerName: 'Utilisateur Test',
        customerPhone: '+33778823840',
        shippingAddress: {
          firstName: 'Utilisateur',
          lastName: 'Test',
          email: 'test@example.com',
          phone: '+33778823840',
          address: '123 Rue de Test',
          city: 'Paris',
          postalCode: '75001',
          country: 'France'
        },
        items: {
          create: products.map((product, index) => ({
            productId: product.id,
            name: product.title,
            quantity: index + 1,
            priceCents: product.priceCents,
          }))
        }
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                images: true,
              }
            }
          }
        }
      }
    })

    console.log(`\n✅ Commande créée avec succès !`)
    console.log(`📝 Numéro de commande: ${order.id}`)
    console.log(`💰 Total: ${(order.totalCents / 100).toFixed(2)} €`)
    console.log(`📦 Articles: ${order.items.length}`)
    console.log(`\n👤 Vous pouvez maintenant voir cette commande dans votre historique !`)

  } catch (error) {
    console.error('❌ Erreur:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Exécution du script
const auth0UserId = process.argv[2]

if (!auth0UserId) {
  console.error('❌ Usage: tsx scripts/create-test-order.ts <auth0-user-id>')
  console.log('\n💡 Votre auth0-user-id est visible dans le menu utilisateur du Header')
  console.log('💡 Format: auth0|xxxxxxxxxxxx')
  process.exit(1)
}

createTestOrder(auth0UserId)
  .then(() => {
    console.log('\n✅ Script terminé avec succès')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erreur lors de l\'exécution:', error)
    process.exit(1)
  })

