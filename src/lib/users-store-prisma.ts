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
    // Chercher par id (cuid) ou par auth0Id
    let user = await prisma.user.findUnique({
      where: { id }
    })

    // Si pas trouvé par id, chercher par auth0Id
    if (!user) {
      user = await prisma.user.findUnique({
        where: { auth0Id: id }
      })
    }

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
    
    // Déterminer si c'est un auth0Id ou un id normal
    const isAuth0Id = user.id.startsWith('auth0|') || user.id.startsWith('google-oauth2|')
    
    // Chercher l'utilisateur existant
    let existing = null
    if (isAuth0Id) {
      existing = await prisma.user.findUnique({
        where: { auth0Id: user.id }
      })
      // Si pas trouvé, chercher par email
      if (!existing && user.email) {
        existing = await prisma.user.findUnique({
          where: { email: user.email.toLowerCase() }
        })
      }
    } else {
      existing = await prisma.user.findUnique({
        where: { id: user.id }
      })
    }

    console.log(`📋 [upsertUser] Utilisateur existant:`, existing ? 'OUI' : 'NON')

    const userData: any = {
      email: user.email?.toLowerCase() || existing?.email || undefined,
      name: user.name || existing?.name || undefined,
      role: existing?.role || 'customer',
    }

    // Gérer auth0Id
    if (isAuth0Id) {
      userData.auth0Id = user.id
      // Si on a un email mais pas d'id, générer un id
      if (!existing) {
        userData.id = undefined // Prisma générera un cuid
      }
    } else {
      userData.id = user.id
    }

    // Gérer stripeCustomerId (si présent dans le schéma)
    if (user.stripeCustomerId !== undefined) {
      userData.stripeCustomerId = user.stripeCustomerId || null
    }

    let result
    if (existing) {
      // Mettre à jour - toujours utiliser l'id pour le where
      console.log(`📝 [upsertUser] Mise à jour de l'utilisateur ${existing.id}`)
      
      // Ne pas inclure auth0Id dans le data si l'utilisateur existe déjà
      const updateData = { ...userData }
      if (existing.auth0Id && isAuth0Id) {
        delete updateData.auth0Id
      }
      
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
      
      // Si c'est un auth0Id, on ne met pas d'id (Prisma génère)
      if (isAuth0Id) {
        delete userData.id
      }
      
      result = await prisma.user.create({
        data: userData
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
    
    // Chercher par id ou auth0Id
    const isAuth0Id = id.startsWith('auth0|') || id.startsWith('google-oauth2|')
    
    let user = null
    if (isAuth0Id) {
      user = await prisma.user.findUnique({
        where: { auth0Id: id }
      })
    } else {
      user = await prisma.user.findUnique({
        where: { id }
      })
    }
    
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

