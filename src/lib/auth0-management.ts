/**
 * Fonctions utilitaires pour interagir avec l'API Management d'Auth0
 * Utilise l'API REST directement car le package 'auth0' n'est pas installé
 */
import { mapToBackofficeRoles } from '@/lib/roles'

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN?.replace('https://', '') || 'dev-1tkaqeynik4yy714.us.auth0.com'
const AUTH0_M2M_CLIENT_ID = process.env.AUTH0_M2M_CLIENT_ID || ''
const AUTH0_M2M_CLIENT_SECRET = process.env.AUTH0_M2M_CLIENT_SECRET || ''
const AUTH0_M2M_AUDIENCE =
  process.env.AUTH0_M2M_AUDIENCE || `https://${AUTH0_DOMAIN}/api/v2/`

// Cache du token d'accès (valide 24h)
let cachedToken: { token: string; expiresAt: number } | null = null

// Cache des rôles utilisateurs (valide 5 minutes)
const rolesCache = new Map<string, { roles: string[]; expiresAt: number }>()
const ROLES_CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/**
 * Fonction utilitaire pour retry avec backoff exponentiel
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error
      
      // Si c'est une erreur 429 (Too Many Requests), on retry avec backoff
      const status = error.status || (error as any).statusCode || 0
      const isRateLimitError = status === 429 || 
                               error.message?.includes('429') || 
                               error.message?.includes('Too Many Requests') ||
                               error.message?.includes('too_many_requests')
      
      if (isRateLimitError && attempt < maxRetries) {
        // Backoff exponentiel plus long pour les rate limits : 2s, 4s, 8s, etc.
        const delay = baseDelay * Math.pow(2, attempt + 1) // Commence à 2s au lieu de 1s
        console.warn(`Rate limit atteint, retry dans ${delay}ms (tentative ${attempt + 1}/${maxRetries + 1})`)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
      
      // Si ce n'est pas une erreur de rate limit ou qu'on a épuisé les retries, on throw
      throw error
    }
  }
  
  throw lastError || new Error('Erreur inconnue lors du retry')
}

/**
 * Limite le nombre de requêtes parallèles avec une queue
 */
async function limitConcurrency<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number = 5
): Promise<T[]> {
  const results: T[] = new Array(tasks.length)
  let currentIndex = 0
  
  async function processNext(): Promise<void> {
    while (currentIndex < tasks.length) {
      const taskIndex = currentIndex++
      try {
        results[taskIndex] = await tasks[taskIndex]()
      } catch (error) {
        // Laisser la tâche gérer l'erreur elle-même
        throw error
      }
    }
  }
  
  // Lancer jusqu'à 'concurrency' workers en parallèle
  const workers = Array(Math.min(concurrency, tasks.length))
    .fill(null)
    .map(() => processNext())
  
  await Promise.all(workers)
  return results
}

/**
 * Obtient un token d'accès pour l'API Management Auth0
 */
async function getManagementToken(): Promise<string> {
  // Vérifier si le token en cache est encore valide (avec 5 min de marge)
  if (cachedToken && cachedToken.expiresAt > Date.now() + 5 * 60 * 1000) {
    return cachedToken.token
  }

  const response = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: AUTH0_M2M_CLIENT_ID,
      client_secret: AUTH0_M2M_CLIENT_SECRET,
      audience: AUTH0_M2M_AUDIENCE,
      grant_type: 'client_credentials',
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to get Auth0 Management token: ${errorText}`)
  }

  const data = await response.json()
  const token = data.access_token
  const expiresIn = data.expires_in || 86400 // 24h par défaut

  // Mettre en cache
  cachedToken = {
    token,
    expiresAt: Date.now() + expiresIn * 1000,
  }

  return token
}

/**
 * Récupère les rôles d'un utilisateur depuis Auth0
 * @param auth0UserId - L'ID Auth0 de l'utilisateur (commence par auth0| ou google-oauth2|)
 */
export async function getAuth0UserRoles(auth0UserId: string): Promise<string[]> {
  // Vérifier le cache
  const cached = rolesCache.get(auth0UserId)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.roles
  }

  try {
    return await retryWithBackoff(async () => {
      try {
        const token = await getManagementToken()
        const response = await fetch(
          `https://${AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(auth0UserId)}/roles`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )

        if (!response.ok) {
          if (response.status === 404) {
            // Utilisateur non trouvé dans Auth0, retourner un tableau vide
            const emptyRoles: string[] = []
            rolesCache.set(auth0UserId, { roles: emptyRoles, expiresAt: Date.now() + ROLES_CACHE_TTL })
            return emptyRoles
          }
          
          // Si erreur 429 (rate limit global), retourner un tableau vide au lieu de throw
          if (response.status === 429) {
            console.warn(`⚠️ Rate limit global Auth0 atteint pour ${auth0UserId}, retour de rôles vides`)
            const emptyRoles: string[] = []
            // Mettre en cache avec un TTL plus court pour éviter de spammer
            rolesCache.set(auth0UserId, { roles: emptyRoles, expiresAt: Date.now() + 60000 }) // 1 minute
            return emptyRoles
          }
          
          const errorText = await response.text()
          const error = new Error(`Failed to get Auth0 roles: ${errorText}`)
          ;(error as any).status = response.status
          throw error
        }

        const roles = await response.json()
        const roleNames = roles.map((r: any) => r.name || r.id)
        
        // Mettre en cache
        rolesCache.set(auth0UserId, { 
          roles: roleNames, 
          expiresAt: Date.now() + ROLES_CACHE_TTL 
        })
        
        return roleNames
      } catch (error: any) {
        // Si c'est une erreur 429 après retry, retourner un tableau vide
        if (error.status === 429 || error.message?.includes('429') || error.message?.includes('too_many_requests')) {
          console.warn(`⚠️ Rate limit Auth0 persistant pour ${auth0UserId}, retour de rôles vides`)
          const emptyRoles: string[] = []
          rolesCache.set(auth0UserId, { roles: emptyRoles, expiresAt: Date.now() + 60000 })
          return emptyRoles
        }
        throw error
      }
    }, 2, 2000) // Réduire à 2 retries max avec 2s de base delay
  } catch (error) {
    console.error('Erreur lors de la récupération des rôles Auth0:', error)
    // En cas d'erreur finale, retourner un tableau vide plutôt que de throw
    const emptyRoles: string[] = []
    rolesCache.set(auth0UserId, { roles: emptyRoles, expiresAt: Date.now() + 60000 })
    return emptyRoles
  }
}

/**
 * Récupère les rôles de plusieurs utilisateurs avec limitation de concurrence
 * @param auth0UserIds - Liste des IDs Auth0
 * @param concurrency - Nombre maximum de requêtes parallèles (défaut: 5)
 */
export async function getAuth0UserRolesBatch(
  auth0UserIds: string[],
  concurrency: number = 3 // Réduire la concurrence par défaut pour éviter les rate limits
): Promise<Map<string, string[]>> {
  const tasks = auth0UserIds.map((userId) => async () => {
    try {
      const roles = await getAuth0UserRoles(userId)
      return { userId, roles }
    } catch (error) {
      console.warn(`Impossible de récupérer les rôles pour ${userId}:`, error)
      return { userId, roles: [] }
    }
  })

  const results = await limitConcurrency(tasks, concurrency)
  return new Map(results.map((r) => [r.userId, r.roles]))
}

/**
 * Récupère tous les rôles disponibles dans Auth0
 */
export async function getAllAuth0Roles(): Promise<Array<{ id: string; name: string }>> {
  try {
    const token = await getManagementToken()
    const response = await fetch(`https://${AUTH0_DOMAIN}/api/v2/roles`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to get Auth0 roles: ${errorText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Erreur lors de la récupération de tous les rôles Auth0:', error)
    throw error
  }
}

/**
 * Trouve l'ID d'un rôle par son nom
 */
export async function getRoleIdByName(roleName: string): Promise<string | null> {
  const normalized = mapToBackofficeRoles(roleName)[0]
  if (!normalized) return null
  const roles = await getAllAuth0Roles()
  const role = roles.find((r) => r.name.toLowerCase() === normalized)
  return role?.id || null
}

/**
 * Met à jour les rôles d'un utilisateur dans Auth0
 * @param auth0UserId - L'ID Auth0 de l'utilisateur
 * @param roleNames - Liste des noms de rôles à assigner (ex: ['admin', 'customer'])
 */
export async function updateAuth0UserRoles(
  auth0UserId: string,
  roleNames: string[]
): Promise<void> {
  try {
    const token = await getManagementToken()

    // 1. Récupérer les IDs des rôles
    const allRoles = await getAllAuth0Roles()
    const roleIds: string[] = []

    for (const roleName of roleNames) {
      const normalized = mapToBackofficeRoles(roleName)[0]
      if (!normalized) {
        console.warn(`⚠️ Rôle "${roleName}" non reconnu`)
        continue
      }
      const role = allRoles.find((r) => r.name.toLowerCase() === normalized)
      if (role) {
        roleIds.push(role.id)
      } else {
        console.warn(`⚠️ Rôle "${roleName}" non trouvé dans Auth0`)
      }
    }

    if (roleIds.length === 0) {
      throw new Error('Aucun rôle valide trouvé')
    }

    // 2. Récupérer les rôles actuels
    const currentRoles = await getAuth0UserRoles(auth0UserId)
    const currentRoleIds = await Promise.all(
      currentRoles.map((name) => getRoleIdByName(name))
    )
    const validCurrentRoleIds = currentRoleIds.filter((id) => id !== null) as string[]

    // 3. Retirer tous les rôles actuels
    if (validCurrentRoleIds.length > 0) {
      const removeResponse = await fetch(
        `https://${AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(auth0UserId)}/roles`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roles: validCurrentRoleIds,
          }),
        }
      )

      if (!removeResponse.ok) {
        const errorText = await removeResponse.text()
        throw new Error(`Failed to remove roles: ${errorText}`)
      }
    }

    // 4. Assigner les nouveaux rôles
    const assignResponse = await fetch(
      `https://${AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(auth0UserId)}/roles`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roles: roleIds,
        }),
      }
    )

    if (!assignResponse.ok) {
      const errorText = await assignResponse.text()
      throw new Error(`Failed to assign roles: ${errorText}`)
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour des rôles Auth0:', error)
    throw error
  }
}

/**
 * Assigne un seul rôle à un utilisateur (remplace tous les autres)
 */
export async function assignSingleRole(auth0UserId: string, roleName: string): Promise<void> {
  await updateAuth0UserRoles(auth0UserId, [roleName])
}


export interface CreateAuth0UserOptions {
  email: string
  password?: string
  name?: string
  role?: 'customer' | 'admin' | 'owner'
  metadata?: Record<string, any>
}

/**
 * Crée un utilisateur dans Auth0 via l'API Management
 * Retourne l'objet utilisateur Auth0
 */
export async function createAuth0User(options: CreateAuth0UserOptions): Promise<any> {
  const token = await getManagementToken()

  const payload: any = {
    email: options.email,
    name: options.name,
    connection: 'Username-Password-Authentication',
    email_verified: false,
    verify_email: false,
    user_metadata: options.metadata || {},
  }

  if (options.password) {
    payload.password = options.password
  } else {
    // Générer un mot de passe aléatoire si non fourni (obligatoire pour la connexion DB)
    payload.password = `Ggg-${Math.random().toString(36).slice(2, 10)}A!`
  }

  const response = await fetch(`https://${AUTH0_DOMAIN}/api/v2/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to create Auth0 user: ${errorText}`)
  }

  const user = await response.json()

  if (options.role) {
    await assignSingleRole(user.user_id, options.role)
  }

  return user
}

export async function deleteAuth0User(auth0UserId: string): Promise<void> {
  const token = await getManagementToken()
  const response = await fetch(`https://${AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(auth0UserId)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to delete Auth0 user: ${errorText}`)
  }
}

interface Auth0UserRaw {
  user_id: string
  email?: string
  name?: string
  nickname?: string
  created_at: string
  last_login?: string
  logins_count?: number
}

export interface Auth0UserDetails extends Auth0UserRaw {
  email_verified?: boolean
  phone_number?: string
  phone_verified?: boolean
  user_metadata?: Record<string, any>
  app_metadata?: Record<string, any>
}

export async function getAuth0User(auth0UserId: string): Promise<Auth0UserDetails | null> {
  if (!auth0UserId) {
    throw new Error('Auth0 user id requis pour getAuth0User')
  }

  const token = await getManagementToken()
  const response = await fetch(
    `https://${AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(auth0UserId)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to get Auth0 user: ${errorText}`)
  }

  return (await response.json()) as Auth0UserDetails
}

export interface ListAuth0UsersOptions {
  page?: number
  perPage?: number
  search?: string
}

export interface Auth0UserSummary {
  user_id: string
  email: string
  name?: string
  created_at: string
  last_login?: string
  logins_count?: number
}

export async function listAuth0Users(
  options: ListAuth0UsersOptions = {}
): Promise<{ users: Auth0UserSummary[]; total: number; page: number; perPage: number }> {
  const token = await getManagementToken()
  const page = Math.max(1, options.page ?? 1)
  const perPage = Math.max(1, Math.min(100, options.perPage ?? 25))

  const params = new URLSearchParams({
    page: String(page - 1),
    per_page: String(perPage),
    include_totals: 'true',
    sort: 'created_at:-1',
    search_engine: 'v3',
  })

  if (options.search) {
    const query = options.search.trim()
    params.set('q', `email:*${query}* OR name:*${query}* OR nickname:*${query}*`)
  }

  const response = await fetch(`https://${AUTH0_DOMAIN}/api/v2/users?${params.toString()}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to list Auth0 users: ${errorText}`)
  }

  const data = await response.json()
  const users: Auth0UserRaw[] = data.users || data || []
  const total = data.total ?? users.length

  return {
    users: users
      .filter((user) => !!user.email)
      .map((user) => ({
        user_id: user.user_id,
        email: user.email as string,
        name: user.name || user.nickname,
        created_at: user.created_at,
        last_login: user.last_login,
        logins_count: user.logins_count,
      })),
    total,
    page,
    perPage,
  }
}

/**
 * Renvoie un email de vérification à un utilisateur Auth0
 * @param auth0UserId - L'ID Auth0 de l'utilisateur
 */
export async function sendVerificationEmail(auth0UserId: string): Promise<void> {
  try {
    const token = await getManagementToken()
    
    const response = await fetch(`https://${AUTH0_DOMAIN}/api/v2/jobs/verification-email`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: auth0UserId,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to send verification email: ${errorText}`)
    }

    const job = await response.json()
    console.log(`✅ Email de vérification envoyé pour l'utilisateur ${auth0UserId}, job ID: ${job.id}`)
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email de vérification:', error)
    throw error
  }
}