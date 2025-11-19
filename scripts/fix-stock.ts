import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixStock() {
  try {
    console.log('🔧 Correction du stock des produits...\n')
    
    // Récupérer tous les produits avec leurs variantes
    const products = await prisma.product.findMany({
      include: {
        variants: true
      }
    })
    
    let updatedCount = 0
    
    for (const product of products) {
      // Calculer le stock total (produit + variantes)
      const variantsStock = product.variants.reduce((sum, v) => sum + v.stock, 0)
      const totalStock = product.stock + variantsStock
      
      // Si le stock total est 0, mettre à jour le stock du produit
      if (totalStock === 0) {
        const newStock = Math.floor(Math.random() * 50) + 30 // Stock entre 30 et 80
        await prisma.product.update({
          where: { id: product.id },
          data: { stock: newStock }
        })
        console.log(`   ✅ ${product.title}: stock mis à ${newStock}`)
        updatedCount++
      }
    }
    
    console.log(`\n✅ ${updatedCount} produits mis à jour avec du stock!`)
    console.log(`📊 Total produits: ${products.length}`)
    
    // Vérifier le résultat
    const productsAfter = await prisma.product.findMany({
      include: {
        variants: true
      }
    })
    
    const productsWithStock = productsAfter.filter(p => {
      const variantsStock = p.variants.reduce((sum, v) => sum + v.stock, 0)
      return (p.stock + variantsStock) > 0
    })
    
    const productsWithoutStock = productsAfter.filter(p => {
      const variantsStock = p.variants.reduce((sum, v) => sum + v.stock, 0)
      return (p.stock + variantsStock) === 0
    })
    
    console.log(`\n📦 Résultat final:`)
    console.log(`   ✅ Produits en stock: ${productsWithStock.length}`)
    console.log(`   ❌ Produits en rupture: ${productsWithoutStock.length}`)
    
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixStock()

