'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: 'customer' | 'admin'
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
      const user: User = {
        id: auth0User.sub || '',
        email: auth0User.email || '',
        firstName: auth0User.given_name || auth0User.name?.split(' ')[0] || '',
        lastName: auth0User.family_name || auth0User.name?.split(' ').slice(1).join(' ') || '',
        role: (auth0User['https://gardengoldgreen.com/roles'] as string[])?.includes('admin') ? 'admin' : 'customer',
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
    router.push('/api/auth/logout')
  }

  const isAdmin = () => {
    return state.user?.role === 'admin'
  }

  return (
    <Auth0Context.Provider value={{ state, logout, isAdmin }}>
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

