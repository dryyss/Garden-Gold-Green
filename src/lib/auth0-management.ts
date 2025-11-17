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
        return []
      }
      const errorText = await response.text()
      throw new Error(`Failed to get Auth0 roles: ${errorText}`)
    }

    const roles = await response.json()
    return roles.map((r: any) => r.name || r.id)
  } catch (error) {
    console.error('Erreur lors de la récupération des rôles Auth0:', error)
    throw error
  }
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
 * Récupère les rôles de plusieurs utilisateurs par batch avec limitation de concurrence
 * @param userIds - Tableau d'IDs Auth0
 * @param maxConcurrency - Nombre maximum de requêtes parallèles (défaut: 5)
 * @returns Map avec userId -> roles[]
 */
export async function getAuth0UserRolesBatch(
  userIds: string[],
  maxConcurrency: number = 5
): Promise<Map<string, string[]>> {
  const rolesMap = new Map<string, string[]>()
  
  // Traiter par batch avec limitation de concurrence
  for (let i = 0; i < userIds.length; i += maxConcurrency) {
    const batch = userIds.slice(i, i + maxConcurrency)
    const promises = batch.map(async (userId) => {
      try {
        const roles = await getAuth0UserRoles(userId)
        return { userId, roles }
      } catch (error) {
        console.error(`Erreur lors de la récupération des rôles pour ${userId}:`, error)
        return { userId, roles: [] }
      }
    })
    
    const results = await Promise.all(promises)
    results.forEach(({ userId, roles }) => {
      rolesMap.set(userId, roles)
    })
  }
  
  return rolesMap
}

/**
 * Envoie un email de vérification à un utilisateur Auth0
 * @param userId - L'ID Auth0 de l'utilisateur
 */
export async function sendVerificationEmail(userId: string): Promise<void> {
  try {
    const token = await getManagementToken()
    
    // Utiliser l'endpoint Jobs API pour envoyer l'email de vérification
    const response = await fetch(`https://${AUTH0_DOMAIN}/api/v2/jobs/verification-email`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      
      // Si l'email est déjà vérifié, Auth0 peut retourner une erreur
      if (errorText.includes('already verified') || errorText.includes('email_verified')) {
        throw new Error('Email déjà vérifié')
      }
      
      throw new Error(`Failed to send verification email: ${errorText}`)
    }

    // La réponse peut être vide ou contenir un job_id
    const data = await response.json().catch(() => ({}))
    console.log(`✅ Email de vérification envoyé pour l'utilisateur ${userId}`, data)
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de vérification:', error)
    throw error
  }
}