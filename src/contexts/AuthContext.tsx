'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0'

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
  createdAt: string
  updatedAt: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean }

const AuthContext = createContext<{
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<void>
  isAdmin: () => boolean
} | null>(null)

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
        error: null
      }

    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }

    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      }

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      }

    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
        error: null
      }

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }

    default:
      return state
  }
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const { user: auth0User, isLoading: auth0Loading } = useUser()

  // Synchroniser Auth0 avec notre état
  useEffect(() => {
    if (auth0Loading) {
      dispatch({ type: 'SET_LOADING', payload: true })
      return
    }

    if (auth0User) {
      // Mapper l'utilisateur Auth0 vers notre format
      const user: User = {
        id: auth0User.sub || '',
        email: auth0User.email || '',
        firstName: auth0User.given_name || auth0User.name?.split(' ')[0] || '',
        lastName: auth0User.family_name || auth0User.name?.split(' ').slice(1).join(' ') || '',
        phone: auth0User.phone_number,
        role: auth0User['https://gardengoldgreen.com/roles']?.includes('admin') ? 'admin' : 'customer',
        address: auth0User['https://gardengoldgreen.com/address'],
        createdAt: auth0User.created_at || new Date().toISOString(),
        updatedAt: auth0User.updated_at || new Date().toISOString()
      }
      dispatch({ type: 'LOGIN_SUCCESS', payload: user })
    } else {
      dispatch({ type: 'LOGOUT' })
    }
  }, [auth0User, auth0Loading])

  const login = async (_email: string, _password: string) => {
    // Rediriger vers Auth0 - les paramètres ne sont plus utilisés
    window.location.href = '/api/auth/login'
  }

  const register = async (_userData: RegisterData) => {
    // Rediriger vers Auth0 signup
    window.location.href = '/api/auth/signup'
  }

  const logout = () => {
    // Rediriger vers Auth0 logout
    window.location.href = '/api/auth/logout'
  }

  const updateProfile = async (userData: Partial<User>) => {
    try {
      // Simulation d'une API call - remplacer par votre vraie API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      dispatch({ type: 'UPDATE_PROFILE', payload: userData })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de mise à jour'
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage })
    }
  }

  const isAdmin = () => {
    return state.user?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={{ state, dispatch, login, register, logout, updateProfile, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}