'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/navigation'
import {
  extractRolesFromAuth0User,
  isAdminRole,
  isOwnerRole,
  toFrontRole,
  type BackofficeRole,
  type FrontRole,
} from '@/lib/roles'

interface User {
  id: string
  email: string
  name: string
  firstName: string
  lastName: string
  phone?: string
  role: FrontRole
  backofficeRole: BackofficeRole
  roles: FrontRole[]
  address?: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  picture?: string
  createdAt: string
  updatedAt: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const Auth0Context = createContext<{
  state: AuthState
  logout: () => void
  isAdmin: () => boolean
  isOwner: () => boolean
  isAdminOrOwner: () => boolean
} | null>(null)

export function Auth0Provider({ children }: { children: React.ReactNode }) {
  const { user: auth0User, error: auth0Error, isLoading: auth0Loading } = useUser()
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    if (auth0Loading) {
      setState(prev => ({ ...prev, isLoading: true }))
      return
    }

    if (auth0Error) {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: auth0Error.message,
      })
      return
    }

    if (auth0User) {
      const namespace = process.env.NEXT_PUBLIC_AUTH0_ROLE_NAMESPACE || 'https://gardengoldgreen.com'
      const rolesClaimKey = `${namespace}/roles`
      const roleClaimKey = `${namespace}/role`

      if (process.env.NODE_ENV !== 'production') {
        console.log('🔐 Auth0 user payload:', auth0User)
        console.log('🔐 Namespace:', namespace)
        console.log('🔐 Claims roles:', auth0User[rolesClaimKey])
        console.log('🔐 Claim role:', auth0User[roleClaimKey])
        console.log('🔐 Authorization roles:', auth0User.authorization?.roles)
        console.log('🔐 All user keys:', Object.keys(auth0User))
      }

      const firstName =
        auth0User.given_name || auth0User.name?.split(' ')[0] || ''
      const lastName =
        auth0User.family_name ||
        auth0User.name?.split(' ').slice(1).join(' ') ||
        ''
      const name =
        `${firstName} ${lastName}`.trim() ||
        auth0User.name ||
        auth0User.email ||
        ''

      const { roles: backofficeRoles, primaryRole } = extractRolesFromAuth0User(
        auth0User as Record<string, unknown>
      )

      const effectivePrimaryRole: BackofficeRole = primaryRole || 'customer'
      const role = toFrontRole(effectivePrimaryRole)
      const roles =
        backofficeRoles.length > 0
          ? Array.from(new Set(backofficeRoles.map(toFrontRole)))
          : [role]

      if (process.env.NODE_ENV !== 'production') {
        console.log('🔐 Rôles finaux:', {
          backofficeRoles,
          primaryRole: effectivePrimaryRole,
          frontRole: role,
          roles,
        })
      }

      const user: User = {
        id: auth0User.sub || '',
        email: auth0User.email || '',
        name,
        firstName,
        lastName,
        role,
        backofficeRole: effectivePrimaryRole,
        roles,
        picture: auth0User.picture,
        createdAt: auth0User.created_at || new Date().toISOString(),
        updatedAt: auth0User.updated_at || new Date().toISOString(),
      }

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })

      // Fallback: Si aucun rôle trouvé dans les claims, récupérer depuis l'API
      if (backofficeRoles.length === 0 && auth0User.sub) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('⚠️ Aucun rôle trouvé dans les claims, récupération depuis API...')
        }
        
        fetch('/api/auth/user-roles')
          .then(async (response) => {
            if (response.ok) {
              const data = await response.json()
              if (data.success && data.roles && data.roles.length > 0) {
                if (process.env.NODE_ENV !== 'production') {
                  console.log('✅ Rôles récupérés depuis API:', data.roles)
                }
                const mappedRoles = data.roles
                  .map((r: string) => {
                    const normalized = r.trim().toLowerCase()
                    if (normalized === 'owner') return 'owner' as BackofficeRole
                    if (normalized === 'admin') return 'admin' as BackofficeRole
                    return 'customer' as BackofficeRole
                  })
                  .filter((r: BackofficeRole) => r !== 'customer')
                
                const newBackofficeRoles = mappedRoles.length > 0 ? mappedRoles : ['customer']
                const newPrimaryRole = newBackofficeRoles.includes('owner') 
                  ? 'owner' 
                  : newBackofficeRoles.includes('admin') 
                    ? 'admin' 
                    : 'customer'
                
                const newRole = toFrontRole(newPrimaryRole)
                const newRoles: FrontRole[] = newBackofficeRoles.length > 0
                  ? (Array.from(new Set(newBackofficeRoles.map(toFrontRole))) as FrontRole[])
                  : [newRole]

                setState(prev => ({
                  ...prev,
                  user: prev.user ? {
                    ...prev.user,
                    role: newRole,
                    backofficeRole: newPrimaryRole,
                    roles: newRoles,
                  } : null,
                }))
              }
            } else {
              const errorText = await response.text()
              if (process.env.NODE_ENV !== 'production') {
                console.warn('⚠️ Impossible de récupérer les rôles depuis API:', errorText)
              }
            }
          })
          .catch((error) => {
            if (process.env.NODE_ENV !== 'production') {
              console.warn('⚠️ Erreur lors de la récupération des rôles:', error)
            }
          })
      }
    } else {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    }
  }, [auth0Error, auth0Loading, auth0User])

  const logout = () => {
    router.push('/auth/logout')
  }

  const isAdmin = () => isAdminRole(state.user?.backofficeRole)
  const isOwner = () => isOwnerRole(state.user?.backofficeRole)
  const isAdminOrOwner = () => isAdminRole(state.user?.backofficeRole)

  return (
    <Auth0Context.Provider value={{ state, logout, isAdmin, isOwner, isAdminOrOwner }}>
      {children}
    </Auth0Context.Provider>
  )
}

export function useAuth0Context() {
  const context = useContext(Auth0Context)
  if (!context) {
    throw new Error('useAuth0Context must be used within an Auth0Provider')
  }
  return context
}

