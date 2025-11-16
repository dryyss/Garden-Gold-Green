import { prisma } from '@/lib/prisma'

export interface UserRecord {
  id: string
  email?: string
  name?: string
  stripeCustomerId?: string
  createdAt: string
  updatedAt: string
}

// Convertir Prisma User vers UserRecord
function prismaUserToRecord(user: any): UserRecord {
  return {
    id: user.id,
    email: user.email || undefined,
    name: user.name || undefined,
    stripeCustomerId: (user as any).stripeCustomerId || undefined,
    createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: user.updatedAt?.toISOString() || new Date().toISOString()
  }
}

export async function listUsers(): Promise<UserRecord[]> {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return users.map(prismaUserToRecord)
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération des utilisateurs:', error)
    return []
  }
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  try {
    // Chercher par id (utilisé aussi bien pour les utilisateurs locaux que pour Auth0)
    const user = await prisma.user.findUnique({
      where: { id }
    })
    return user ? prismaUserToRecord(user) : null
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération de l\'utilisateur:', error)
    return null
  }
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })
    return user ? prismaUserToRecord(user) : null
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération de l\'utilisateur par email:', error)
    return null
  }
}

export async function upsertUser(user: Omit<UserRecord, 'createdAt' | 'updatedAt'> & Partial<UserRecord>): Promise<UserRecord> {
  try {
    console.log(`🔍 [upsertUser] Début pour utilisateur ${user.id}`)

    // Chercher l'utilisateur existant
    let existing = null
    existing = await prisma.user.findUnique({
      where: { id: user.id }
    })
    // Si pas trouvé, chercher par email
    if (!existing && user.email) {
      existing = await prisma.user.findUnique({
        where: { email: user.email.toLowerCase() }
      })
    }

    console.log(`📋 [upsertUser] Utilisateur existant:`, existing ? 'OUI' : 'NON')

    const userData: any = {
      email: user.email?.toLowerCase() || existing?.email || undefined,
      name: user.name || existing?.name || undefined,
      role: existing?.role || 'customer',
    }

    // Gérer stripeCustomerId (si présent dans le schéma)
    if (user.stripeCustomerId !== undefined) {
      userData.stripeCustomerId = user.stripeCustomerId || null
    }

    let result
    if (existing) {
      // Mettre à jour - toujours utiliser l'id pour le where
      console.log(`📝 [upsertUser] Mise à jour de l'utilisateur ${existing.id}`)
      const updateData = { ...userData }

      try {
        result = await prisma.user.update({
          where: { id: existing.id },
          data: updateData
        })
        
        console.log(`✅ [upsertUser] Utilisateur ${result.id} mis à jour`)
      } catch (updateError: any) {
        // Si l'erreur indique que stripeCustomerId n'est pas reconnu,
        // réessayer sans ce champ
        if (updateError.message?.includes('stripeCustomerId') || 
            updateError.message?.includes('Unknown argument')) {
          console.warn(`⚠️ [upsertUser] stripeCustomerId non reconnu, réessai sans ce champ`)
          const updateDataWithoutStripe = { ...updateData }
          delete updateDataWithoutStripe.stripeCustomerId
          
          result = await prisma.user.update({
            where: { id: existing.id },
            data: updateDataWithoutStripe
          })
          
          console.log(`✅ [upsertUser] Utilisateur ${result.id} mis à jour (sans stripeCustomerId)`)
          console.warn(`⚠️ [upsertUser] Veuillez régénérer le client Prisma: npx prisma generate`)
        } else {
          throw updateError
        }
      }
    } else {
      // Créer
      console.log(`📝 [upsertUser] Création d'un nouvel utilisateur`)
      
      result = await prisma.user.create({
        data: {
          id: user.id,
          ...userData
        }
      })
      
      console.log(`✅ [upsertUser] Utilisateur ${result.id} créé avec succès`)
    }

    return prismaUserToRecord(result)
  } catch (error: any) {
    console.error(`❌ [upsertUser] Erreur lors de la sauvegarde de l'utilisateur ${user.id}:`, error)
    console.error(`❌ [upsertUser] Détails:`, {
      code: error.code,
      message: error.message,
      meta: error.meta
    })
    throw error
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    console.log(`🗑️ [deleteUser] Suppression de l'utilisateur ${id}`)
    
    // Chercher par id (utilisé aussi pour les identifiants Auth0)
    const user = await prisma.user.findUnique({
      where: { id }
    })
    
    if (!user) {
      console.error(`❌ [deleteUser] Utilisateur ${id} non trouvé`)
      return false
    }
    
    await prisma.user.delete({
      where: { id: user.id }
    })
    
    console.log(`✅ [deleteUser] Utilisateur ${id} supprimé avec succès`)
    return true
  } catch (error: any) {
    console.error(`❌ [deleteUser] Erreur suppression utilisateur ${id}:`, error)
    return false
  }
}

// Fonction de compatibilité pour readUsersMap
export async function readUsersMap(): Promise<Record<string, UserRecord>> {
  const users = await listUsers()
  return users.reduce((acc, user) => {
    acc[user.id] = user
    return acc
  }, {} as Record<string, UserRecord>)
}

