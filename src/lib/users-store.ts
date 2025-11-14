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
async function prismaUserToRecord(user: any): Promise<UserRecord> {
  // Récupérer stripeCustomerId via SQL direct si nécessaire (pour les anciens clients Prisma)
  let stripeCustomerId = user.stripeCustomerId
  if (!stripeCustomerId) {
    try {
      const result = await prisma.$queryRawUnsafe<Array<{ stripeCustomerId: string | null }>>(
        `SELECT "stripeCustomerId" FROM "User" WHERE id = $1`,
        user.id
      )
      if (result && result.length > 0) {
        stripeCustomerId = result[0].stripeCustomerId || undefined
      }
    } catch (e) {
      // Si la colonne n'existe pas, c'est normal
      stripeCustomerId = undefined
    }
  }
  
  return {
    id: user.id,
    email: user.email || undefined,
    name: user.name || undefined,
    stripeCustomerId: stripeCustomerId || undefined,
    createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: user.updatedAt?.toISOString() || new Date().toISOString()
  }
}

export async function listUsers(): Promise<UserRecord[]> {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return Promise.all(users.map(prismaUserToRecord))
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération des utilisateurs:', error)
    return []
  }
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  try {
    console.log(`🔍 [getUserById] Recherche utilisateur ${id}`)
    
    // L'ID est maintenant directement l'auth0Id
    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (user) {
      console.log(`✅ [getUserById] Utilisateur trouvé: ${user.email}`)
    } else {
      console.log(`❌ [getUserById] Utilisateur ${id} non trouvé`)
    }

    return user ? await prismaUserToRecord(user) : null
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
    return user ? await prismaUserToRecord(user) : null
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération de l\'utilisateur par email:', error)
    return null
  }
}

export async function upsertUser(user: Omit<UserRecord, 'createdAt' | 'updatedAt'> & Partial<UserRecord>): Promise<UserRecord> {
  try {
    console.log(`🔍 [upsertUser] Début pour utilisateur ${user.id}`)
    console.log(`📧 [upsertUser] Email: ${user.email}`)
    
    // L'ID est maintenant directement l'auth0Id
    // Chercher l'utilisateur existant par ID (auth0Id)
    let existing = await prisma.user.findUnique({
      where: { id: user.id }
    })
    
    // Si pas trouvé, chercher par email (pour migration des anciens utilisateurs)
    if (!existing && user.email) {
      existing = await prisma.user.findUnique({
        where: { email: user.email.toLowerCase() }
      })
      // Si trouvé par email mais avec un ID différent, on ne peut pas le mettre à jour
      // car l'ID est la clé primaire. On créera un nouvel utilisateur avec l'auth0Id.
      if (existing && existing.id !== user.id) {
        console.warn(`⚠️ [upsertUser] Utilisateur trouvé par email avec un ID différent (${existing.id}), création d'un nouvel utilisateur`)
        existing = null
      }
    }

    console.log(`📋 [upsertUser] Utilisateur existant:`, existing ? `OUI (${existing.email})` : 'NON')

    const userData: any = {
      id: user.id, // L'ID est directement l'auth0Id
      email: user.email?.toLowerCase() || existing?.email || undefined,
      name: user.name || existing?.name || undefined,
      role: existing?.role || 'customer',
      updatedAt: new Date() // Toujours mettre à jour updatedAt
    }

    // Gérer stripeCustomerId (seulement si le champ existe dans le schéma)
    // Vérifier si le champ existe en testant avec une requête SQL directe
    // Pour l'instant, on le met dans userData et on gérera l'erreur si nécessaire
    if (user.stripeCustomerId !== undefined) {
      // Essayer d'ajouter stripeCustomerId, mais ne pas échouer si le champ n'existe pas encore
      try {
        userData.stripeCustomerId = user.stripeCustomerId || null
      } catch (e) {
        // Le champ n'existe pas encore dans le schéma Prisma
        console.warn('⚠️ [upsertUser] stripeCustomerId ignoré (champ non disponible dans le schéma Prisma)')
      }
    }

    let result
    if (existing) {
      // Mettre à jour - toujours utiliser l'id pour le where
      console.log(`📝 [upsertUser] Mise à jour de l'utilisateur ${existing.id}`)
      
      // Ne pas inclure l'ID dans le data de mise à jour (c'est la clé primaire)
      const updateData = { ...userData }
      delete updateData.id
      
      // Retirer stripeCustomerId temporairement si le client Prisma ne le reconnaît pas
      const stripeCustomerIdValue = updateData.stripeCustomerId
      delete updateData.stripeCustomerId
      
      try {
        result = await prisma.user.update({
          where: { id: existing.id },
          data: updateData
        })
        
        // Mettre à jour stripeCustomerId via SQL direct si nécessaire
        if (stripeCustomerIdValue !== undefined) {
          try {
            await prisma.$executeRawUnsafe(
              `UPDATE "User" SET "stripeCustomerId" = $1 WHERE id = $2`,
              stripeCustomerIdValue || null,
              existing.id
            )
            console.log(`✅ [upsertUser] stripeCustomerId mis à jour via SQL direct`)
          } catch (sqlError: any) {
            // Si la colonne n'existe pas encore, c'est normal
            if (sqlError.message?.includes('column "stripeCustomerId"') || sqlError.code === '42703') {
              console.warn('⚠️ [upsertUser] Colonne stripeCustomerId non disponible (régénérez le client Prisma)')
            } else {
              console.warn('⚠️ [upsertUser] Erreur SQL pour stripeCustomerId:', sqlError.message)
            }
          }
        }
        
        console.log(`✅ [upsertUser] Utilisateur ${result.id} mis à jour avec succès`)
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
      console.log(`📝 [upsertUser] Création d'un nouvel utilisateur avec ID: ${user.id}`)
      
      try {
        result = await prisma.user.create({
          data: userData // L'ID est directement l'auth0Id
        })
        
        console.log(`✅ [upsertUser] Utilisateur ${result.id} créé avec succès (email: ${result.email})`)
      } catch (createError: any) {
        console.error(`❌ [upsertUser] Erreur lors de la création Prisma:`, createError)
        console.error(`❌ [upsertUser] Détails:`, {
          code: createError.code,
          message: createError.message,
          meta: createError.meta
        })
        throw createError
      }
    }

    return await prismaUserToRecord(result)
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
