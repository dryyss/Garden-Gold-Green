import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkStock() {
  try {
    // Vérifier les produits avec stock 0
    const productsWithZeroStock = await prisma.product.findMany({
      where: {
        stock: 0
      },
      include: {
        variants: true
      },
      take: 10
    })
    
    console.log(`📊 Produits avec stock = 0: ${productsWithZeroStock.length}`)
    
    if (productsWithZeroStock.length > 0) {
      console.log('\n🔴 Exemples de produits en rupture:')
      productsWithZeroStock.slice(0, 5).forEach((p) => {
        const variantsStock = p.variants.reduce((sum, v) => sum + v.stock, 0)
        const totalStock = p.stock + variantsStock
        console.log(`   - ${p.title}: stock=${p.stock}, variantes=${variantsStock}, total=${totalStock}`)
      })
    }
    
    // Vérifier tous les produits
    const allProducts = await prisma.product.findMany({
      include: {
        variants: true
      }
    })
    
    const productsWithStock = allProducts.filter(p => {
      const variantsStock = p.variants.reduce((sum, v) => sum + v.stock, 0)
      return (p.stock + variantsStock) > 0
    })
    
    const productsWithoutStock = allProducts.filter(p => {
      const variantsStock = p.variants.reduce((sum, v) => sum + v.stock, 0)
      return (p.stock + variantsStock) === 0
    })
    
    console.log(`\n📦 Statistiques globales:`)
    console.log(`   ✅ Produits en stock: ${productsWithStock.length}`)
    console.log(`   ❌ Produits en rupture: ${productsWithoutStock.length}`)
    console.log(`   📊 Total produits: ${allProducts.length}`)
    
    // Mettre à jour le stock pour quelques produits
    if (productsWithoutStock.length > 0) {
      console.log(`\n💡 Solution: Mettre à jour le stock des produits...`)
      
      // Mettre à jour 10 produits aléatoirement avec du stock
      const productsToUpdate = productsWithoutStock.slice(0, 10)
      
      for (const product of productsToUpdate) {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            stock: Math.floor(Math.random() * 50) + 20 // Stock entre 20 et 70
          }
        })
        console.log(`   ✅ ${product.title}: stock mis à jour`)
      }
      
      console.log(`\n✅ ${productsToUpdate.length} produits mis à jour avec du stock!`)
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkStock()

