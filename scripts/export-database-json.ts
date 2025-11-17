/**
 * Script pour exporter la base de données en JSON via Prisma
 * Utile si pg_dump n'est pas disponible
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function exportDatabase() {
  try {
    console.log('🔄 Début de l\'export de la base de données en JSON...')

    // Créer le dossier backups s'il n'existe pas
    const backupDir = path.join(process.cwd(), 'backups')
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const backupFile = path.join(backupDir, `backup-${timestamp}.json`)

    console.log('📊 Récupération des utilisateurs...')
    const users = await prisma.user.findMany()

    console.log('📦 Récupération des produits...')
    const products = await prisma.product.findMany()

    console.log('🛒 Récupération des commandes...')
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
    })

    console.log('📁 Récupération des catégories...')
    const categories = await prisma.category.findMany()

    console.log('💳 Récupération des abonnements...')
    const subscriptions = await prisma.subscription.findMany()

    console.log('📝 Récupération des commentaires...')
    const comments = await prisma.comment.findMany()

    console.log('🔄 Récupération des demandes de retour...')
    const returns = await prisma.returnRequest.findMany()

    // Compiler toutes les données
    const data = {
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        totalRecords: {
          users: users.length,
          products: products.length,
          orders: orders.length,
          categories: categories.length,
          subscriptions: subscriptions.length,
          comments: comments.length,
          returns: returns.length,
        },
      },
      users,
      products,
      orders,
      categories,
      subscriptions,
      comments,
      returns,
    }

    // Sauvegarder en JSON
    fs.writeFileSync(backupFile, JSON.stringify(data, null, 2), 'utf-8')

    console.log(`\n✅ Backup créé avec succès!`)
    console.log(`📁 Fichier: ${backupFile}`)
    console.log(`📊 Statistiques:`)
    console.log(`   - Utilisateurs: ${users.length}`)
    console.log(`   - Produits: ${products.length}`)
    console.log(`   - Commandes: ${orders.length}`)
    console.log(`   - Catégories: ${categories.length}`)
    console.log(`   - Abonnements: ${subscriptions.length}`)
    console.log(`   - Commentaires: ${comments.length}`)
    console.log(`   - Retours: ${returns.length}`)

    // Créer aussi un fichier de résumé
    const summaryFile = path.join(backupDir, `summary-${timestamp}.txt`)
    const summary = `Backup de la base de données - ${new Date().toLocaleString('fr-FR')}

Statistiques:
- Utilisateurs: ${users.length}
- Produits: ${products.length}
- Commandes: ${orders.length}
- Catégories: ${categories.length}
- Abonnements: ${subscriptions.length}
- Commentaires: ${comments.length}
- Retours: ${returns.length}

Fichier de backup: ${backupFile}
`
    fs.writeFileSync(summaryFile, summary)
    console.log(`\n📄 Résumé sauvegardé: ${summaryFile}`)
  } catch (error) {
    console.error('❌ Erreur lors de l\'export:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter le script
exportDatabase()
  .then(() => {
    console.log('\n✅ Export terminé avec succès!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erreur:', error)
    process.exit(1)
  })

