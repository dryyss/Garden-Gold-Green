export type BackofficeRole = 'owner' | 'admin' | 'customer'
export type FrontRole = 'owner' | 'admin' | 'user'

const ROLE_PRIORITY: BackofficeRole[] = ['owner', 'admin', 'customer']

const ROLE_NAMESPACES = () =>
  process.env.NEXT_PUBLIC_AUTH0_ROLE_NAMESPACE?.replace(/\/+$/, '') ||
  'https://gardengoldgreen.com'

function normalizeRoleName(input: unknown): BackofficeRole | undefined {
  if (typeof input !== 'string') return undefined
  const value = input.trim().toLowerCase()
  if (!value) return undefined
  if (value === 'owner') return 'owner'
  if (value === 'admin') return 'admin'
  if (value === 'customer' || value === 'user' || value === 'client') return 'customer'
  return undefined
}

export function mapToBackofficeRoles(values: unknown): BackofficeRole[] {
  if (!values) return []
  const list = Array.isArray(values) ? values : [values]
  const normalized = list
    .map(normalizeRoleName)
    .filter((role): role is BackofficeRole => role !== undefined)

  return Array.from(new Set(normalized))
}

export function resolvePrimaryRole(
  primary: unknown,
  fallbackRoles: unknown
): BackofficeRole | undefined {
  const candidates: BackofficeRole[] = []

  const normalizedPrimary = normalizeRoleName(primary)
  if (normalizedPrimary) {
    candidates.push(normalizedPrimary)
  }

  const normalizedFallback = mapToBackofficeRoles(fallbackRoles)
  candidates.push(...normalizedFallback)

  const deduped = Array.from(new Set(candidates))

  for (const role of ROLE_PRIORITY) {
    if (deduped.includes(role)) {
      return role
    }
  }

  return deduped[0]
}

export function toFrontRole(role: BackofficeRole | undefined): FrontRole {
  if (role === 'owner') return 'owner'
  if (role === 'admin') return 'admin'
  return 'user'
}

export function isOwnerRole(role: BackofficeRole | undefined): boolean {
  return role === 'owner'
}

export function isAdminRole(role: BackofficeRole | undefined): boolean {
  return role === 'owner' || role === 'admin'
}

export function extractRolesFromAuth0User(
  auth0User: Record<string, any> | null | undefined
): {
  roles: BackofficeRole[]
  primaryRole: BackofficeRole | undefined
} {
  if (!auth0User) {
    return { roles: [], primaryRole: undefined }
  }

  const namespace = ROLE_NAMESPACES()
  const rolesClaimKey = `${namespace}/roles`
  const roleClaimKey = `${namespace}/role`

  const rolesFromClaim = mapToBackofficeRoles(auth0User[rolesClaimKey])
  const primaryFromClaim = normalizeRoleName(auth0User[roleClaimKey])
  const rolesFromAuthorization = mapToBackofficeRoles(auth0User.authorization?.roles)

  const combinedRoles = Array.from(
    new Set([...rolesFromClaim, ...rolesFromAuthorization])
  )
  const primaryRole = resolvePrimaryRole(primaryFromClaim, combinedRoles)

  return {
    roles: combinedRoles,
    primaryRole,
  }
}

export function mergeBackofficeRoles(
  current: BackofficeRole | undefined,
  incoming: unknown
): BackofficeRole | undefined {
  const nextRoles = mapToBackofficeRoles(incoming)
  const nextPrimary = resolvePrimaryRole(undefined, nextRoles)
  const mergedList = Array.from(
    new Set([current, nextPrimary].filter((r): r is BackofficeRole => Boolean(r)))
  )

  return resolvePrimaryRole(undefined, mergedList)
}









