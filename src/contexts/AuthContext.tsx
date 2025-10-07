'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'

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

  // Charger l'utilisateur depuis localStorage au montage
  useEffect(() => {
    const savedUser = localStorage.getItem('garden-gold-green-user')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        dispatch({ type: 'LOGIN_SUCCESS', payload: user })
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error)
        localStorage.removeItem('garden-gold-green-user')
      }
    }
  }, [])

  // Sauvegarder l'utilisateur dans localStorage
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('garden-gold-green-user', JSON.stringify(state.user))
    } else {
      localStorage.removeItem('garden-gold-green-user')
    }
  }, [state.user])

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' })
    
    try {
      // Simulation d'une API call - remplacer par votre vraie API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Pour la démo, on accepte n'importe quel email/password
      if (email && password) {
        const isAdmin = email === 'admin@gardengoldgreen.com'
        const user: User = {
          id: '1',
          email,
          firstName: isAdmin ? 'Admin' : 'John',
          lastName: isAdmin ? 'Garden' : 'Doe',
          role: isAdmin ? 'admin' : 'customer',
          phone: '+33 6 12 34 56 78',
          address: {
            street: '123 Rue de la Paix',
            city: 'Paris',
            postalCode: '75001',
            country: 'France'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        dispatch({ type: 'LOGIN_SUCCESS', payload: user })
      } else {
        throw new Error('Email et mot de passe requis')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion'
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage })
    }
  }

  const register = async (userData: RegisterData) => {
    dispatch({ type: 'REGISTER_START' })
    
    try {
      // Simulation d'une API call - remplacer par votre vraie API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const user: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        role: 'customer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      dispatch({ type: 'REGISTER_SUCCESS', payload: user })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur d\'inscription'
      dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage })
    }
  }

  const logout = () => {
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