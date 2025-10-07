import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seeding...')

  // Créer les catégories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'huiles-cbd' },
      update: {},
      create: {
        name: 'Huiles CBD',
        slug: 'huiles-cbd',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'fleurs-cbd' },
      update: {},
      create: {
        name: 'Fleurs CBD',
        slug: 'fleurs-cbd',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'cosmetiques-cbd' },
      update: {},
      create: {
        name: 'Cosmétiques CBD',
        slug: 'cosmetiques-cbd',
      },
    }),
  ])

  console.log('✅ Catégories créées')

  // Créer les produits
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'huile-cbd-10-relax' },
      update: {},
      create: {
        title: 'Huile CBD 10% - Relax',
        slug: 'huile-cbd-10-relax',
        description: 'Huile de CBD premium à 10% de concentration. Idéale pour la relaxation et le bien-être quotidien. Produit 100% naturel, testé en laboratoire.',
        priceCents: 2990, // 29.90€
        cbdPercent: 10.0,
        sku: 'GG-OL-10',
        stock: 50,
          images: JSON.stringify(['/products/cbd-oil-placeholder.jpg']),
        published: true,
        categories: {
          connect: [{ id: categories[0].id }],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'huile-cbd-20-energy' },
      update: {},
      create: {
        title: 'Huile CBD 20% - Energy',
        slug: 'huile-cbd-20-energy',
        description: 'Huile de CBD à haute concentration (20%) pour un usage intensif. Parfaite pour les utilisateurs expérimentés.',
        priceCents: 4990, // 49.90€
        cbdPercent: 20.0,
        sku: 'GG-OL-20',
        stock: 30,
          images: JSON.stringify(['/products/cbd-oil-placeholder.jpg']),
        published: true,
        categories: {
          connect: [{ id: categories[0].id }],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'fleurs-cbd-amnesia' },
      update: {},
      create: {
        title: 'Fleurs CBD Amnesia Haze',
        slug: 'fleurs-cbd-amnesia',
        description: 'Fleurs de CBD Amnesia Haze, variété premium cultivée en Europe. Goût citronné et effets relaxants.',
        priceCents: 1590, // 15.90€
        cbdPercent: 8.5,
        sku: 'GG-FL-AMN',
        stock: 25,
        images: JSON.stringify(['/products/cbd-oil-placeholder.jpg']),
        published: true,
        categories: {
          connect: [{ id: categories[1].id }],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'creme-cbd-relax' },
      update: {},
      create: {
        title: 'Crème CBD Relax',
        slug: 'creme-cbd-relax',
        description: 'Crème hydratante enrichie au CBD pour une peau douce et apaisée. Formule naturelle avec huiles essentielles.',
        priceCents: 3490, // 34.90€
        cbdPercent: 2.0,
        sku: 'GG-CR-REL',
        stock: 40,
        images: JSON.stringify(['/products/cbd-cream-placeholder.jpg']),
        published: true,
        categories: {
          connect: [{ id: categories[2].id }],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'fleurs-cbd-gorilla' },
      update: {},
      create: {
        title: 'Fleurs CBD Gorilla Glue',
        slug: 'fleurs-cbd-gorilla',
        description: 'Fleurs de CBD Gorilla Glue, variété populaire aux notes terreuses et sucrées. Effets équilibrés.',
        priceCents: 1890, // 18.90€
        cbdPercent: 12.0,
        sku: 'GG-FL-GOR',
        stock: 20,
        images: ['/assets/products/fleurs-gorilla-1.jpg'],
        published: true,
        categories: {
          connect: [{ id: categories[1].id }],
        },
      },
    }),
  ])

  console.log('✅ Produits créés', products.length)

  // Créer les variantes pour certains produits
  await Promise.all([
    prisma.productVariant.create({
      data: {
        title: 'Format 10ml',
        priceCents: 1990,
        stock: 100,
        productId: products[0].id,
      },
    }),
    prisma.productVariant.create({
      data: {
        title: 'Format 30ml',
        priceCents: 2990,
        stock: 50,
        productId: products[0].id,
      },
    }),
  ])

  console.log('✅ Variantes créées')

  // Créer un utilisateur admin (pour les tests)
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gardengoldgreen.com' },
    update: {},
    create: {
      email: 'admin@gardengoldgreen.com',
      name: 'Admin Garden Gold Green',
      role: 'admin',
    },
  })

  // Créer quelques utilisateurs clients
  const customers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'client1@example.com' },
      update: {},
      create: {
        email: 'client1@example.com',
        name: 'Jean Dupont',
        role: 'customer',
      },
    }),
    prisma.user.upsert({
      where: { email: 'client2@example.com' },
      update: {},
      create: {
        email: 'client2@example.com',
        name: 'Marie Martin',
        role: 'customer',
      },
    }),
  ])

  console.log('✅ Utilisateurs créés (1 admin, 2 clients)')

  // Créer quelques commandes d'exemple
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        userId: customers[0].id,
        totalCents: 4580, // 29.90 + 15.90
        status: 'PAID',
        paymentIntentId: 'pi_test_123',
        shippingAddress: {
          name: 'Jean Dupont',
          address: '123 Rue de la Paix',
          city: 'Paris',
          postalCode: '75001',
          country: 'France',
        },
        items: {
          create: [
            {
              productId: products[0].id,
              priceCents: 2990,
              quantity: 1,
            },
            {
              productId: products[2].id,
              priceCents: 1590,
              quantity: 1,
            },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        userId: customers[1].id,
        totalCents: 3490,
        status: 'FULFILLED',
        paymentIntentId: 'pi_test_456',
        shippingAddress: {
          name: 'Marie Martin',
          address: '456 Avenue des Champs',
          city: 'Lyon',
          postalCode: '69001',
          country: 'France',
        },
        items: {
          create: [
            {
              productId: products[3].id,
              priceCents: 3490,
              quantity: 1,
            },
          ],
        },
      },
    }),
  ])

  console.log('✅ Commandes d\'exemple créées', orders.length)

  console.log('🎉 Seeding terminé avec succès!')
  console.log('👤 Admin: admin@gardengoldgreen.com')
  console.log('👥 Clients: client1@example.com, client2@example.com')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
