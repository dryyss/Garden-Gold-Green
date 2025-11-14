#!/usr/bin/env tsx
/**
 * Script principal de migration : Migre toutes les données JSON vers Prisma PostgreSQL
 * 
 * Usage: tsx scripts/migrate-all-to-prisma.ts
 * 
 * Ordre d'exécution:
 * 1. Catégories et Produits
 * 2. Utilisateurs
 * 3. Commandes
 */

import { execSync } from 'child_process'
import path from 'path'

console.log('🚀 Migration complète vers Prisma PostgreSQL\n')
console.log('⚠️  Assurez-vous que:')
console.log('  1. DATABASE_URL est configuré dans .env')
console.log('  2. La base de données PostgreSQL est accessible')
console.log('  3. Les migrations Prisma sont à jour (npx prisma db push)\n')

const scripts = [
  { name: 'Produits et Catégories', file: 'migrate-products-to-prisma.ts' },
  { name: 'Utilisateurs', file: 'migrate-users-to-prisma.ts' },
  { name: 'Commandes', file: 'migrate-orders-to-prisma.ts' }
]

async function runMigration(scriptName: string, scriptFile: string) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`📦 Migration: ${scriptName}`)
  console.log(`${'='.repeat(60)}\n`)

  try {
    execSync(`tsx scripts/${scriptFile}`, {
      stdio: 'inherit',
      cwd: process.cwd()
    })
    console.log(`\n✅ ${scriptName} - Migration terminée avec succès\n`)
  } catch (error) {
    console.error(`\n❌ ${scriptName} - Erreur lors de la migration\n`)
    throw error
  }
}

async function main() {
  try {
    // Vérifier que Prisma est configuré
    console.log('🔍 Vérification de la configuration Prisma...\n')
    execSync('npx prisma generate', { stdio: 'inherit' })
    console.log('✅ Prisma client généré\n')

    // Exécuter les migrations dans l'ordre
    for (const script of scripts) {
      await runMigration(script.name, script.file)
    }

    console.log('\n' + '='.repeat(60))
    console.log('✅ MIGRATION COMPLÈTE TERMINÉE!')
    console.log('='.repeat(60))
    console.log('\n📝 Prochaines étapes:')
    console.log('  1. Vérifier les données dans Prisma Studio: npx prisma studio')
    console.log('  2. Modifier les imports dans le code pour utiliser Prisma')
    console.log('  3. Tester les routes API')
    console.log('  4. Supprimer les fichiers JSON (optionnel)\n')

  } catch (error) {
    console.error('\n❌ Erreur lors de la migration:', error)
    process.exit(1)
  }
}

main()

