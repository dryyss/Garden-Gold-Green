'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  firstName: string
  lastName: string
  phone?: string
  role: 'user' | 'admin' | 'owner'
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
    error: null
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
        error: auth0Error.message
      })
      return
    }

    if (auth0User) {
      // Transformer l'utilisateur Auth0 en notre format
      const firstName = auth0User.given_name || auth0User.name?.split(' ')[0] || ''
      const lastName = auth0User.family_name || auth0User.name?.split(' ').slice(1).join(' ') || ''
      const name = `${firstName} ${lastName}`.trim() || auth0User.name || auth0User.email || ''
      
      // DEBUG: Log pour vérifier les rôles
      console.log('🔍 Auth0 User:', auth0User)
      console.log('🔍 Roles claim:', auth0User['https://gardengoldgreen.com/roles'])
      console.log('🔍 All claims:', Object.keys(auth0User))
      
      const roles = auth0User['https://gardengoldgreen.com/roles'] as string[] || []
      console.log('🔍 Roles array:', roles)
      console.log('🔍 Roles length:', roles.length)
      console.log('🔍 Roles types:', roles.map(r => ({ value: r, lower: r?.toLowerCase(), type: typeof r })))
      
      const isOwnerUser = roles?.some(r => r && r.toLowerCase() === 'owner')
      const isAdminUser = roles?.some(r => r && r.toLowerCase() === 'admin')
      const isUserRole = roles?.some(r => r && r.toLowerCase() === 'user')
      
      console.log('🔍 isOwnerUser:', isOwnerUser)
      console.log('🔍 isAdminUser:', isAdminUser)
      console.log('🔍 isUserRole:', isUserRole)
      
      // Vérifier si l'utilisateur n'a aucun rôle et assigner le rôle par défaut
      if (roles.length === 0 && auth0User.sub) {
        console.log('ℹ️ Utilisateur sans rôles détecté, assignation du rôle par défaut...')
        console.log('🔍 User ID:', auth0User.sub)
        
        fetch('/api/auth/assign-default-role', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(res => {
            console.log('🔍 Status de la réponse:', res.status)
            if (!res.ok) {
              return res.text().then(text => {
                console.error('❌ Erreur HTTP:', res.status, text)
                throw new Error(`HTTP ${res.status}: ${text}`)
              })
            }
            return res.json()
          })
          .then(data => {
            console.log('✅ Réponse API assign-default-role:', data)
            if (data.message === 'Default role assigned successfully') {
              // Recharger la page pour obtenir le nouveau token avec les rôles
              console.log('🔄 Rechargement de la page pour obtenir le nouveau token...')
              setTimeout(() => {
                window.location.reload()
              }, 1000)
            } else if (data.message === 'User already has roles') {
              console.log('ℹ️ Utilisateur a déjà des rôles via API:', data.roles)
              // Recharger quand même pour obtenir les rôles dans le token
              setTimeout(() => {
                window.location.reload()
              }, 1000)
            } else {
              console.warn('⚠️ Réponse inattendue:', data)
            }
          })
          .catch(error => {
            console.error('❌ Erreur lors de l\'assignation du rôle:', error)
            console.error('❌ Détails de l\'erreur:', error.message)
            // Ne pas recharger en cas d'erreur pour éviter une boucle
          })
      }
      
      // Déterminer le rôle (owner > admin > user)
      let userRole: 'user' | 'admin' | 'owner' = 'user'
      if (isOwnerUser) {
        userRole = 'owner'
      } else if (isAdminUser) {
        userRole = 'admin'
      } else if (isUserRole) {
        userRole = 'user'
      }
      
      console.log('🔍 Final role:', userRole)
      
      const user: User = {
        id: auth0User.sub || '',
        email: auth0User.email || '',
        name,
        firstName,
        lastName,
        role: userRole,
        picture: auth0User.picture,
        createdAt: auth0User.created_at || new Date().toISOString(),
        updatedAt: auth0User.updated_at || new Date().toISOString()
      }

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      })
    } else {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      })
    }
  }, [auth0User, auth0Error, auth0Loading])

  const logout = () => {
    router.push('/auth/logout')
  }

  const isAdmin = () => {
    return state.user?.role === 'admin' || state.user?.role === 'owner'
  }

  const isOwner = () => {
    return state.user?.role === 'owner'
  }

  const isAdminOrOwner = () => {
    return state.user?.role === 'admin' || state.user?.role === 'owner'
  }

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
