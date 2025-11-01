import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Script pour associer les commandes passées à un userId Auth0
 * Utilisation: tsx scripts/fix-userid-orders.ts <auth0-user-id>
 */
async function fixUserOrders(auth0UserId: string) {
  try {
    console.log(`🔍 Recherche des commandes sans userId...`)
    
    // Trouver toutes les commandes sans userId
    const ordersWithoutUserId = await prisma.order.findMany({
      where: {
        userId: null,
      },
      include: {
        items: true,
      },
    })

    console.log(`📊 Trouvé ${ordersWithoutUserId.length} commandes sans userId`)

    if (ordersWithoutUserId.length === 0) {
      console.log('✅ Aucune commande à corriger')
      return
    }

    // Mettre à jour toutes les commandes avec le userId Auth0
    let updated = 0
    for (const order of ordersWithoutUserId) {
      await prisma.order.update({
        where: { id: order.id },
        data: { userId: auth0UserId },
      })
      updated++
      console.log(`✅ Commande ${order.id} mise à jour`)
    }

    console.log(`\n🎉 ${updated} commandes mises à jour avec userId: ${auth0UserId}`)

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
  console.error('❌ Usage: tsx scripts/fix-userid-orders.ts <auth0-user-id>')
  console.log('\n💡 Votre auth0-user-id est visible dans le menu utilisateur du Header')
  process.exit(1)
}

fixUserOrders(auth0UserId)
  .then(() => {
    console.log('\n✅ Script terminé avec succès')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erreur lors de l\'exécution:', error)
    process.exit(1)
  })

