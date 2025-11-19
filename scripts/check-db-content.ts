import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkContent() {
  try {
    const productCount = await prisma.product.count()
    const categoryCount = await prisma.category.count()
    const userCount = await prisma.user.count()
    const orderCount = await prisma.order.count()
    
    console.log('📊 Contenu de la base de données:')
    console.log(`   ✅ ${productCount} produits`)
    console.log(`   ✅ ${categoryCount} catégories`)
    console.log(`   ✅ ${userCount} utilisateurs`)
    console.log(`   ✅ ${orderCount} commandes`)
    
    // Afficher quelques exemples de produits
    const sampleProducts = await prisma.product.findMany({
      take: 5,
      include: {
        categories: true
      }
    })
    
    console.log('\n📦 Exemples de produits:')
    sampleProducts.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.title} - ${p.priceCents / 100}€ (${p.cbdPercent}% CBD)`)
    })
    
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkContent()

