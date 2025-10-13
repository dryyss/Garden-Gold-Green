const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient();

async function setupSubscriptions() {
  console.log('🚀 Configuration du système d\'abonnements...\n');

  try {
    // 1. Générer le client Prisma avec les nouveaux modèles
    console.log('📦 Génération du client Prisma...');
    const { execSync } = require('child_process');
    execSync('npx prisma generate', { stdio: 'inherit' });

    // 2. Appliquer les migrations
    console.log('\n🔄 Application des migrations...');
    execSync('npx prisma db push', { stdio: 'inherit' });

    // 3. Créer les plans d'abonnement par défaut
    console.log('\n📋 Création des plans d\'abonnement...');
    execSync('node scripts/create-subscription-plans.js create', { stdio: 'inherit' });

    // 4. Vérifier que tout fonctionne
    console.log('\n✅ Vérification de la configuration...');
    
    const planCount = await prisma.subscriptionPlan.count();
    const productCount = await prisma.product.count();
    
    console.log(`   - Produits dans la base: ${productCount}`);
    console.log(`   - Plans d'abonnement créés: ${planCount}`);

    if (planCount > 0) {
      console.log('\n🎉 Configuration terminée avec succès !');
      console.log('\n📊 Résumé des fonctionnalités ajoutées:');
      console.log('   ✅ Modèles de base de données pour les abonnements');
      console.log('   ✅ Plans d\'abonnement hebdomadaires, mensuels et annuels');
      console.log('   ✅ Système de remises automatiques');
      console.log('   ✅ Gestion des livraisons programmées');
      console.log('   ✅ Interface utilisateur complète');
      console.log('   ✅ API REST pour la gestion des abonnements');
      
      console.log('\n🔗 Pages disponibles:');
      console.log('   - /subscriptions : Gestion des abonnements utilisateur');
      console.log('   - /products/[slug] : Onglet abonnements sur les produits');
      
      console.log('\n🛠️  Commandes utiles:');
      console.log('   - node scripts/create-subscription-plans.js list    : Voir tous les plans');
      console.log('   - node scripts/create-subscription-plans.js reset   : Supprimer tous les plans');
      console.log('   - npx prisma studio                               : Interface de gestion de la DB');
    } else {
      console.log('\n⚠️  Aucun plan d\'abonnement créé. Vérifiez que des produits existent.');
    }

  } catch (error) {
    console.error('\n❌ Erreur lors de la configuration:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Fonction pour tester les abonnements
async function testSubscriptions() {
  console.log('\n🧪 Test du système d\'abonnements...');
  
  try {
    // Récupérer un produit avec des plans
    const productWithPlans = await prisma.product.findFirst({
      include: {
        subscriptionPlans: true
      }
    });

    if (!productWithPlans) {
      console.log('   ⚠️  Aucun produit avec plans trouvé');
      return;
    }

    console.log(`   📦 Produit test: ${productWithPlans.title}`);
    console.log(`   📋 Plans disponibles: ${productWithPlans.subscriptionPlans.length}`);

    // Afficher les détails des plans
    productWithPlans.subscriptionPlans.forEach((plan, index) => {
      console.log(`   ${index + 1}. ${plan.name}`);
      console.log(`      - Prix: ${plan.priceCents / 100}€ (${plan.discount || 0}% de remise)`);
      console.log(`      - Intervalle: ${plan.interval} (${plan.intervalCount}x)`);
    });

    console.log('\n✅ Test terminé avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Fonction pour créer un exemple d'abonnement
async function createExampleSubscription() {
  console.log('\n👤 Création d\'un exemple d\'abonnement...');
  
  try {
    // Trouver un utilisateur ou en créer un
    let user = await prisma.user.findFirst();
    
    if (!user) {
      console.log('   👤 Création d\'un utilisateur de test...');
      user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Utilisateur Test',
          role: 'customer'
        }
      });
    }

    // Trouver un plan d'abonnement
    const plan = await prisma.subscriptionPlan.findFirst();
    
    if (!plan) {
      console.log('   ⚠️  Aucun plan d\'abonnement trouvé');
      return;
    }

    // Créer un abonnement de test
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: nextMonth,
        nextBillingDate: nextMonth,
        quantity: 1,
        shippingAddress: JSON.stringify({
          firstName: 'Jean',
          lastName: 'Dupont',
          address1: '123 Rue de la Paix',
          city: 'Paris',
          postalCode: '75001',
          country: 'France'
        })
      },
      include: {
        plan: {
          include: {
            product: {
              select: {
                title: true
              }
            }
          }
        }
      }
    });

    // Créer une livraison programmée
    await prisma.subscriptionDelivery.create({
      data: {
        subscriptionId: subscription.id,
        scheduledDate: nextMonth
      }
    });

    console.log(`   ✅ Abonnement créé: ${subscription.plan.product.title}`);
    console.log(`   📅 Prochaine livraison: ${nextMonth.toLocaleDateString('fr-FR')}`);

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'exemple:', error);
  }
}

// Exécution du script
async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'setup':
      await setupSubscriptions();
      break;
    case 'test':
      await testSubscriptions();
      break;
    case 'example':
      await createExampleSubscription();
      break;
    case 'full':
      await setupSubscriptions();
      await testSubscriptions();
      await createExampleSubscription();
      break;
    default:
      console.log('🚀 Système d\'abonnements pour Garden Gold Green\n');
      console.log('Usage:');
      console.log('  node scripts/setup-subscriptions.js setup   - Configuration complète');
      console.log('  node scripts/setup-subscriptions.js test    - Test du système');
      console.log('  node scripts/setup-subscriptions.js example - Créer un exemple');
      console.log('  node scripts/setup-subscriptions.js full    - Configuration + test + exemple');
      break;
  }
}

main().catch(console.error);
