const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSubscriptionPlans() {
  console.log('🔄 Création des plans d\'abonnement...');

  try {
    // Récupérer tous les produits
    const products = await prisma.product.findMany({
      where: { published: true }
    });

    console.log(`📦 Trouvé ${products.length} produits`);

    for (const product of products) {
      console.log(`\n📦 Traitement du produit: ${product.title}`);
      
      // Vérifier si des plans existent déjà pour ce produit
      const existingPlans = await prisma.subscriptionPlan.findMany({
        where: { productId: product.id }
      });

      if (existingPlans.length > 0) {
        console.log(`  ⏭️  Plans déjà existants (${existingPlans.length}), passage au suivant`);
        continue;
      }

      // Créer les 3 plans d'abonnement pour chaque produit
      const plans = [
        {
          name: `Pack Hebdomadaire - ${product.title}`,
          description: `Recevez ${product.title} chaque semaine avec 5% de remise`,
          interval: 'weekly',
          intervalCount: 1,
          priceCents: Math.round(product.priceCents * 0.95), // 5% de remise
          discount: 5.0,
          productId: product.id,
          isActive: true
        },
        {
          name: `Pack Mensuel - ${product.title}`,
          description: `Recevez ${product.title} chaque mois avec 10% de remise`,
          interval: 'monthly',
          intervalCount: 1,
          priceCents: Math.round(product.priceCents * 0.90), // 10% de remise
          discount: 10.0,
          productId: product.id,
          isActive: true
        },
        {
          name: `Pack Annuel - ${product.title}`,
          description: `Recevez ${product.title} chaque mois pendant un an avec 15% de remise`,
          interval: 'monthly',
          intervalCount: 1,
          priceCents: Math.round(product.priceCents * 0.85), // 15% de remise
          discount: 15.0,
          productId: product.id,
          isActive: true
        }
      ];

      // Créer les plans dans la base de données
      for (const planData of plans) {
        const plan = await prisma.subscriptionPlan.create({
          data: planData
        });
        console.log(`  ✅ Créé: ${plan.name} (${plan.priceCents / 100}€ - ${plan.discount}% de remise)`);
      }
    }

    console.log('\n🎉 Tous les plans d\'abonnement ont été créés avec succès !');
    
    // Afficher un résumé
    const totalPlans = await prisma.subscriptionPlan.count();
    console.log(`\n📊 Résumé:`);
    console.log(`   - Total des plans créés: ${totalPlans}`);
    console.log(`   - Produits avec abonnements: ${products.length}`);

  } catch (error) {
    console.error('❌ Erreur lors de la création des plans:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Fonction pour créer des plans personnalisés pour des produits spécifiques
async function createCustomPlans() {
  console.log('\n🔧 Création de plans personnalisés...');
  
  try {
    // Exemple de plans personnalisés pour des produits premium
    const customPlans = [
      {
        productTitle: '3G Gold Standard CBD Oil 10%', // Recherche par titre
        plans: [
          {
            name: 'Pack Premium Hebdomadaire',
            description: 'Pack premium avec livraison express',
            interval: 'weekly',
            intervalCount: 1,
            priceCents: 3500, // Prix fixe
            discount: 8.0,
            isActive: true
          }
        ]
      }
    ];

    for (const customPlan of customPlans) {
      const product = await prisma.product.findFirst({
        where: { title: { contains: customPlan.productTitle } }
      });

      if (!product) {
        console.log(`  ⚠️  Produit non trouvé: ${customPlan.productTitle}`);
        continue;
      }

      for (const planData of customPlan.plans) {
        await prisma.subscriptionPlan.create({
          data: {
            ...planData,
            productId: product.id
          }
        });
        console.log(`  ✅ Plan personnalisé créé: ${planData.name}`);
      }
    }

  } catch (error) {
    console.error('❌ Erreur lors de la création des plans personnalisés:', error);
  }
}

// Fonction pour lister tous les plans
async function listPlans() {
  console.log('\n📋 Liste des plans d\'abonnement:');
  
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      include: {
        product: {
          select: {
            title: true,
            priceCents: true
          }
        }
      },
      orderBy: [
        { product: { title: 'asc' } },
        { interval: 'asc' }
      ]
    });

    plans.forEach(plan => {
      const originalPrice = plan.product.priceCents;
      const savings = originalPrice - plan.priceCents;
      const savingsPercent = ((savings / originalPrice) * 100).toFixed(1);
      
      console.log(`\n  📦 ${plan.product.title}`);
      console.log(`     ${plan.name}`);
      console.log(`     Prix: ${plan.priceCents / 100}€ (au lieu de ${originalPrice / 100}€)`);
      console.log(`     Économies: ${savings / 100}€ (${savingsPercent}%)`);
      console.log(`     Fréquence: ${plan.interval} (${plan.intervalCount}x)`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des plans:', error);
  }
}

// Exécution du script
async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'create':
      await createSubscriptionPlans();
      await createCustomPlans();
      break;
    case 'list':
      await listPlans();
      break;
    case 'reset':
      console.log('🗑️  Suppression de tous les plans...');
      await prisma.subscriptionPlan.deleteMany();
      console.log('✅ Tous les plans ont été supprimés');
      break;
    default:
      console.log('Usage:');
      console.log('  node create-subscription-plans.js create  - Créer tous les plans');
      console.log('  node create-subscription-plans.js list    - Lister tous les plans');
      console.log('  node create-subscription-plans.js reset   - Supprimer tous les plans');
  }
}

main().catch(console.error);
