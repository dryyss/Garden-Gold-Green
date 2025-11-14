#!/usr/bin/env tsx
/**
 * Script de migration : Importe les utilisateurs depuis users.json vers Prisma PostgreSQL
 * 
 * Usage: tsx scripts/migrate-users-to-prisma.ts
 */

import { PrismaClient } from '@prisma/client'
import usersData from '../src/data/users.json'

const prisma = new PrismaClient()

interface UserRecord {
  id: string // auth0Id
  email?: string
  name?: string
  stripeCustomerId?: string
  createdAt: string
  updatedAt: string
}

async function migrateUsers() {
  console.log('🚀 Début de la migration des utilisateurs vers Prisma...\n')

  try {
    // Vérifier la connexion
    await prisma.$connect()
    console.log('✅ Connexion à la base de données établie\n')

    // users.json est un objet, pas un tableau
    const usersMap = usersData as Record<string, UserRecord>
    const users = Object.values(usersMap)
    
    console.log(`👥 ${users.length} utilisateurs à migrer\n`)

    let successCount = 0
    let skipCount = 0
    let errorCount = 0

    for (const user of users) {
      try {
        // Vérifier si l'utilisateur existe déjà par auth0Id
        const existingByAuth0 = await prisma.user.findUnique({
          where: { auth0Id: user.id }
        })

        if (existingByAuth0) {
          // Mettre à jour si nécessaire
          if (user.stripeCustomerId && !existingByAuth0.password) {
            // On peut mettre à jour le stripeCustomerId si besoin
            // Mais on ne peut pas mettre à jour directement car il n'y a pas ce champ dans le schema
            console.log(`⏭️  Utilisateur ${user.id} déjà existant (auth0Id)`)
          } else {
            console.log(`⏭️  Utilisateur ${user.id} déjà existant (auth0Id)`)
          }
          skipCount++
          continue
        }

        // Vérifier si l'utilisateur existe par email
        let existingByEmail = null
        if (user.email) {
          existingByEmail = await prisma.user.findUnique({
            where: { email: user.email }
          })
        }

        if (existingByEmail) {
          // Mettre à jour l'auth0Id si manquant
          if (!existingByEmail.auth0Id) {
            await prisma.user.update({
              where: { id: existingByEmail.id },
              data: {
                auth0Id: user.id
              }
            })
            console.log(`  ✅ Auth0Id ajouté à l'utilisateur existant: ${user.email}`)
          }
          skipCount++
          continue
        }

        // Créer un nouvel utilisateur
        if (!user.email) {
          console.log(`  ⚠️  Utilisateur ${user.id} sans email, ignoré`)
          skipCount++
          continue
        }

        // Générer un ID Prisma (cuid)
        const createdUser = await prisma.user.create({
          data: {
            email: user.email,
            name: user.name || null,
            auth0Id: user.id,
            role: 'customer',
            createdAt: new Date(user.createdAt)
          }
        })

        successCount++
        console.log(`  ✅ Utilisateur créé: ${user.email}`)

      } catch (error: any) {
        console.error(`  ❌ Erreur pour l'utilisateur ${user.id}:`, error.message)
        errorCount++
      }
    }

    console.log('\n📊 Résumé de la migration:')
    console.log(`  ✅ ${successCount} utilisateurs migrés avec succès`)
    console.log(`  ⏭️  ${skipCount} utilisateurs déjà existants ou ignorés`)
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
migrateUsers()
  .catch((error) => {
    console.error('❌ Erreur fatale:', error)
    process.exit(1)
  })

