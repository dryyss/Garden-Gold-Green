#!/usr/bin/env tsx
/**
 * Script de migration : Importe les commandes depuis orders.json vers Prisma PostgreSQL
 * 
 * Usage: tsx scripts/migrate-orders-to-prisma.ts
 */

import { PrismaClient, Prisma } from '@prisma/client'
import ordersData from '../src/data/orders.json'
import path from 'path'

const prisma = new PrismaClient()

interface OrderItemRecord {
  productId: string
  name: string
  priceCents: number | null
  quantity: number
  image?: string
}

interface OrderRecord {
  id: string
  userId?: string | null
  status: string
  totalCents: number
  currency: string
  items: OrderItemRecord[]
  createdAt: string
  updatedAt: string
  deliveredAt?: string | null
  subtotalCents?: number | null
  shippingCents?: number | null
  taxCents?: number | null
  discountCents?: number | null
  customerEmail?: string
  customerName?: string
  customerPhone?: string
  shippingAddress?: Record<string, unknown>
  billingAddress?: Record<string, unknown>
  stripeSessionId?: string
  paymentIntentId?: string | { id?: string }
  receiptUrl?: string | null
  invoicePdf?: string | null
  trackingNumber?: string | null
  carrier?: string | null
  carrierTrackingUrl?: string | null
  shippingStatus?: string | null
  shippedAt?: string | null
  estimatedDeliveryDate?: string | null
  shippingHistory?: Array<{
    date: string
    status: string
    message?: string
  }>
  shippingInfo?: {
    carrier?: string | null
    trackingNumber?: string | null
    trackingUrl?: string | null
    status?: string | null
    shippedAt?: string | null
    deliveredAt?: string | null
    estimatedDeliveryDate?: string | null
    history?: Array<{
      date: string
      status: string
      message?: string
    }>
  } | null
  metadata?: Record<string, unknown>
}

async function migrateOrders() {
  console.log('🚀 Début de la migration des commandes vers Prisma...\n')

  try {
    // Vérifier la connexion
    await prisma.$connect()
    console.log('✅ Connexion à la base de données établie\n')

    // orders.json est un objet, pas un tableau
    const ordersMap = ordersData as unknown as Record<string, OrderRecord>
    const orders = Object.values(ordersMap)
    
    console.log(`📦 ${orders.length} commandes à migrer\n`)

    let successCount = 0
    let skipCount = 0
    let errorCount = 0

    for (const order of orders) {
      try {
        // Vérifier si la commande existe déjà
        const existing = await prisma.order.findUnique({
          where: { id: order.id }
        })

        if (existing) {
          console.log(`⏭️  Commande ${order.id} déjà existante`)
          skipCount++
          continue
        }

        // Trouver ou créer l'utilisateur si userId est fourni
        let userId = order.userId || null
        if (userId && userId.startsWith('auth0|')) {
          // Chercher l'utilisateur par id (qui stocke l'auth0Id)
          const user = await prisma.user.findUnique({
            where: { id: userId }
          })
          if (user) {
            userId = user.id
          } else if (order.customerEmail) {
            // Créer un utilisateur si l'email existe mais pas l'utilisateur
            const existingUserByEmail = await prisma.user.findUnique({
              where: { email: order.customerEmail }
            })
            if (existingUserByEmail) {
              userId = existingUserByEmail.id
            }
          }
        }

        // Préparer shippingInfo
        const shippingInfo = order.shippingInfo || (order.trackingNumber || order.carrier ? {
          carrier: order.carrier || null,
          trackingNumber: order.trackingNumber || null,
          trackingUrl: order.carrierTrackingUrl || null,
          status: order.shippingStatus || null,
          shippedAt: order.shippedAt || null,
          deliveredAt: order.deliveredAt || null,
          estimatedDeliveryDate: order.estimatedDeliveryDate || null,
          history: order.shippingHistory || []
        } : undefined)

        // Vérifier que tous les produits existent avant de créer la commande
        const itemsToCreate = []
        for (const item of order.items) {
          // Vérifier si le produit existe
          const product = await prisma.product.findUnique({
            where: { id: item.productId }
          })

          if (!product) {
            console.log(`  ⚠️  Produit ${item.productId} non trouvé pour la commande ${order.id}, ignoré`)
            continue
          }

          // Utiliser le prix du produit si priceCents est null
          const priceCents = item.priceCents || product.priceCents || 0

          itemsToCreate.push({
            productId: item.productId,
            name: item.name,
            priceCents: priceCents,
            quantity: item.quantity,
            status: 'ordered'
          })
        }

        // Ne créer la commande que si elle a au moins un item valide
        if (itemsToCreate.length === 0) {
          console.log(`  ⚠️  Commande ${order.id} ignorée (aucun produit valide)`)
          errorCount++
          continue
        }

        // Créer la commande
        const createdOrder = await prisma.order.create({
          data: {
            id: order.id,
            userId: userId,
            totalCents: order.totalCents,
            currency: order.currency || 'EUR',
            status: order.status || 'pending',
            subtotalCents: order.subtotalCents || null,
            shippingCents: order.shippingCents || null,
            taxCents: order.taxCents || null,
            discountCents: order.discountCents || null,
            customerEmail: order.customerEmail || null,
            customerName: order.customerName || null,
            customerPhone: order.customerPhone || null,
            shippingAddress: order.shippingAddress ? (order.shippingAddress as Prisma.InputJsonValue) : undefined,
            billingAddress: order.billingAddress ? (order.billingAddress as Prisma.InputJsonValue) : undefined,
            stripeSessionId: order.stripeSessionId || null,
            paymentIntentId: typeof order.paymentIntentId === 'string'
              ? order.paymentIntentId
              : order.paymentIntentId && typeof order.paymentIntentId === 'object'
                ? order.paymentIntentId.id ?? null
                : null,
            receiptUrl: order.receiptUrl || null,
            invoicePdf: order.invoicePdf || null,
            shippingInfo: shippingInfo ? (shippingInfo as Prisma.InputJsonValue) : undefined,
            metadata: order.metadata ? (order.metadata as Prisma.InputJsonValue) : undefined,
            deliveredAt: order.deliveredAt ? new Date(order.deliveredAt) : null,
            createdAt: new Date(order.createdAt),
            updatedAt: new Date(order.updatedAt),
            items: {
              create: itemsToCreate
            }
          }
        })

        successCount++
        if (successCount % 10 === 0) {
          console.log(`  ✅ ${successCount} commandes migrées...`)
        }
      } catch (error: any) {
        console.error(`  ❌ Erreur pour la commande ${order.id}:`, error.message)
        errorCount++
      }
    }

    console.log('\n📊 Résumé de la migration:')
    console.log(`  ✅ ${successCount} commandes migrées avec succès`)
    console.log(`  ⏭️  ${skipCount} commandes déjà existantes`)
    console.log(`  ❌ ${errorCount} erreurs`)
    console.log(`\n✅ Migration terminée!`)

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter la migration
migrateOrders()
  .catch((error) => {
    console.error('❌ Erreur fatale:', error)
    process.exit(1)
  })

