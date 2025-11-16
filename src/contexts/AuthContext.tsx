'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'

interface Address {
  street?: string
  city?: string
  postalCode?: string
  country?: string
}

interface User {
  id: string
  email: string
  name: string
  role: 'customer' | 'admin'
  createdAt: string
  firstName?: string
  lastName?: string
  phone?: string
  address?: Address
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
  name: string
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

  // Vérifier le token au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token')
      const userData = localStorage.getItem('user')
      
      if (token && userData) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true })
          
          // Vérifier la validité du token
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (response.ok) {
            const data = await response.json()
            dispatch({ type: 'LOGIN_SUCCESS', payload: data.user })
          } else {
            // Token invalide, nettoyer le localStorage
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user')
            dispatch({ type: 'LOGOUT' })
          }
        } catch (error) {
          console.error('Erreur de vérification auth:', error)
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user')
          dispatch({ type: 'LOGOUT' })
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'LOGIN_START' })

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de connexion')
      }

      // Sauvegarder le token et les données utilisateur
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      if (process.env.NODE_ENV === 'development') {
        console.log('🔐 Connexion réussie - Auth token complet:', data.token)
        console.log('🔐 Connexion réussie - Utilisateur:', data.user)
      }

      dispatch({ type: 'LOGIN_SUCCESS', payload: data.user })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion'
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage })
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'REGISTER_START' })

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur d\'inscription')
      }

      // Sauvegarder le token et les données utilisateur
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      if (process.env.NODE_ENV === 'development') {
        console.log('🆕 Inscription réussie - Auth token complet:', data.token)
        console.log('🆕 Inscription réussie - Utilisateur:', data.user)
      }

      dispatch({ type: 'REGISTER_SUCCESS', payload: data.user })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur d\'inscription'
      dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage })
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
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