import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateUserIds() {
  try {
    console.log('🔄 Vérification de la structure de la base de données...')
    
    // Vérifier si la colonne auth0Id existe
    const checkColumn = await prisma.$queryRawUnsafe<Array<{ exists: boolean }>>(
      `SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'User' 
        AND column_name = 'auth0Id'
      ) as exists`
    )
    
    const auth0IdExists = checkColumn[0]?.exists || false
    
    if (!auth0IdExists) {
      console.log('✅ La colonne auth0Id n\'existe pas - la migration a déjà été effectuée ou n\'est pas nécessaire')
      console.log('✅ Vérification des utilisateurs existants...')
      
      // Vérifier les utilisateurs existants
      const users = await prisma.user.findMany({
        select: { id: true, email: true }
      })
      
      console.log(`📋 ${users.length} utilisateur(s) trouvé(s)`)
      users.forEach(user => {
        const isAuth0Id = user.id.startsWith('auth0|') || user.id.startsWith('google-oauth2|')
        console.log(`  - ${user.email}: ${user.id} ${isAuth0Id ? '✅ (auth0Id)' : '⚠️ (ID Prisma)'}`)
      })
      
      console.log('✅ Migration terminée - pas de migration nécessaire')
      return
    }
    
    console.log('🔄 Migration des IDs utilisateurs...')
    
    // Récupérer tous les utilisateurs avec un auth0Id
    const users = await prisma.$queryRawUnsafe<Array<{ id: string; auth0Id: string | null; email: string }>>(
      `SELECT id, "auth0Id", email FROM "User" WHERE "auth0Id" IS NOT NULL`
    )
    
    console.log(`📋 ${users.length} utilisateur(s) avec auth0Id trouvé(s)`)
    
    for (const user of users) {
      if (!user.auth0Id) continue
      
      console.log(`🔄 Migration de ${user.email}: ${user.id} -> ${user.auth0Id}`)
      
      // Vérifier si un utilisateur avec cet auth0Id existe déjà
      const existing = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
        `SELECT id FROM "User" WHERE id = $1`,
        user.auth0Id
      )
      
      if (existing.length > 0) {
        console.log(`⚠️  Utilisateur avec ID ${user.auth0Id} existe déjà, fusion des données...`)
        // Fusionner les données si nécessaire
        // Pour l'instant, on skip
        continue
      }
      
      // Mettre à jour les commandes pour utiliser le nouvel ID
      await prisma.$executeRawUnsafe(
        `UPDATE "Order" SET "userId" = $1 WHERE "userId" = $2`,
        user.auth0Id,
        user.id
      )
      
      // Mettre à jour les commentaires
      await prisma.$executeRawUnsafe(
        `UPDATE "Comment" SET "userId" = $1 WHERE "userId" = $2`,
        user.auth0Id,
        user.id
      )
      
      // Mettre à jour les retours
      await prisma.$executeRawUnsafe(
        `UPDATE "ReturnRequest" SET "userId" = $1 WHERE "userId" = $2`,
        user.auth0Id,
        user.id
      )
      
      // Mettre à jour les abonnements
      await prisma.$executeRawUnsafe(
        `UPDATE "Subscription" SET "userId" = $1 WHERE "userId" = $2`,
        user.auth0Id,
        user.id
      )
      
      // Mettre à jour l'ID de l'utilisateur
      await prisma.$executeRawUnsafe(
        `UPDATE "User" SET id = $1 WHERE id = $2`,
        user.auth0Id,
        user.id
      )
      
      console.log(`✅ Utilisateur ${user.email} migré avec succès`)
    }
    
    console.log('✅ Migration terminée !')
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

migrateUserIds()

