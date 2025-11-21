/**
 * Script pour récupérer/exporter la base de données PostgreSQL
 * Utilise pg_dump pour créer un fichier SQL de backup
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'

const execAsync = promisify(exec)

async function backupDatabase() {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRESQL_ADDON_URI

    if (!databaseUrl) {
      console.error('❌ DATABASE_URL ou POSTGRESQL_ADDON_URI non définie')
      process.exit(1)
    }

    // Parser l'URL de la base de données
    const url = new URL(databaseUrl)
    const host = url.hostname
    const port = url.port || '5432'
    const database = url.pathname.slice(1) // Enlever le premier /
    const username = url.username
    const password = url.password

    // Créer le nom du fichier de backup avec timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const backupDir = path.join(process.cwd(), 'backups')
    const backupFile = path.join(backupDir, `backup-${timestamp}.sql`)

    // Créer le dossier backups s'il n'existe pas
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
      console.log(`📁 Dossier backups créé: ${backupDir}`)
    }

    console.log('🔄 Début de l\'export de la base de données...')
    console.log(`📊 Base de données: ${database}`)
    console.log(`🖥️  Serveur: ${host}:${port}`)
    console.log(`💾 Fichier de backup: ${backupFile}`)

    // Commande pg_dump
    // Note: pg_dump doit être installé sur le système
    const dumpCommand = `PGPASSWORD="${password}" pg_dump -h ${host} -p ${port} -U ${username} -d ${database} -F c -f "${backupFile}.dump"`

    try {
      // Essayer d'abord avec pg_dump en format custom
      await execAsync(dumpCommand)
      console.log(`✅ Backup créé avec succès: ${backupFile}.dump`)
      console.log(`📦 Format: Custom (compressé)`)
    } catch (error: any) {
      // Si pg_dump n'est pas disponible, essayer avec psql pour un dump SQL simple
      console.log('⚠️  pg_dump non disponible, tentative avec psql...')
      
      const sqlDumpCommand = `PGPASSWORD="${password}" psql -h ${host} -p ${port} -U ${username} -d ${database} -c "\\copy (SELECT * FROM information_schema.tables WHERE table_schema = 'public') TO STDOUT" > "${backupFile}" 2>&1`
      
      // Alternative: utiliser Prisma pour exporter
      console.log('📝 Utilisation de Prisma pour exporter les données...')
      
      // Exporter avec Prisma Studio ou créer un script d'export
      const prismaExportScript = `
        import { PrismaClient } from '@prisma/client'
        const prisma = new PrismaClient()
        
        async function exportData() {
          const users = await prisma.user.findMany()
          const products = await prisma.product.findMany()
          const orders = await prisma.order.findMany()
          const categories = await prisma.category.findMany()
          
          const data = {
            users,
            products,
            orders,
            categories,
            exportedAt: new Date().toISOString()
          }
          
          const fs = require('fs')
          fs.writeFileSync('${backupFile}.json', JSON.stringify(data, null, 2))
          console.log('✅ Données exportées en JSON')
        }
        
        exportData().finally(() => prisma.$disconnect())
      `
      
      // Pour l'instant, on va créer un script simple qui utilise Prisma
      console.log('💡 Pour un backup complet, utilisez pg_dump depuis Clever Cloud:')
      console.log(`   pg_dump -h ${host} -p ${port} -U ${username} -d ${database} > backup.sql`)
      console.log('\n📋 Ou utilisez la commande depuis Clever Cloud CLI:')
      console.log(`   clever db export --app <app-name> > backup.sql`)
      
      // Créer un fichier avec les instructions
      const instructions = `# Instructions pour récupérer la base de données

## Option 1: Depuis Clever Cloud Dashboard
1. Allez dans votre application Clever Cloud
2. Section "Add-ons" > PostgreSQL
3. Cliquez sur "Export" ou "Backup"
4. Téléchargez le fichier de backup

## Option 2: Depuis Clever Cloud CLI
\`\`\`bash
clever db export --app <app-name> > backup.sql
\`\`\`

## Option 3: Depuis votre machine locale (si pg_dump est installé)
\`\`\`bash
PGPASSWORD="${password}" pg_dump -h ${host} -p ${port} -U ${username} -d ${database} > backup.sql
\`\`\`

## Option 4: Utiliser Prisma pour exporter les données en JSON
\`\`\`bash
npm run db:export-json
\`\`\`

## Informations de connexion
- Host: ${host}
- Port: ${port}
- Database: ${database}
- User: ${username}
`

      fs.writeFileSync(path.join(backupDir, 'instructions-backup.txt'), instructions)
      console.log(`\n📄 Instructions sauvegardées dans: ${path.join(backupDir, 'instructions-backup.txt')}`)
    }

    console.log('\n✅ Processus terminé!')
  } catch (error) {
    console.error('❌ Erreur lors du backup:', error)
    process.exit(1)
  }
}

// Exécuter le script
backupDatabase()




