'use client'

import { createContext, useContext, useReducer, useEffect, useState, useRef } from 'react'
import { trackAddToCart as trackAddToCartGA } from '@/lib/analytics'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  cbdPercent?: number
  slug?: string
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  isHydrated: boolean
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      // Track GA
      trackAddToCartGA({
        itemId: action.payload.id,
        itemName: action.payload.name,
        price: action.payload.price,
        quantity: action.payload.quantity,
        itemCategory: 'CBD Products',
      })
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + action.payload.quantity,
          totalPrice: state.totalPrice + (action.payload.price * action.payload.quantity)
        }
      } else {
        return {
          ...state,
          items: [...state.items, action.payload],
          totalItems: state.totalItems + action.payload.quantity,
          totalPrice: state.totalPrice + (action.payload.price * action.payload.quantity)
        }
      }
    }

    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(item => item.id === action.payload)
      if (!itemToRemove) return state

      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        totalItems: state.totalItems - itemToRemove.quantity,
        totalPrice: state.totalPrice - (itemToRemove.price * itemToRemove.quantity)
      }
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: action.payload.id })
      }

      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      )

      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice
      }
    }

    case 'CLEAR_CART':
      const clearedState = {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
        isOpen: false
      }
      return clearedState

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      }

    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false
      }

    case 'LOAD_CART': {
      const totalItems = action.payload.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      return {
        ...state,
        items: action.payload,
        totalItems,
        totalPrice
      }
    }

    default:
      return state
  }
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const [isHydrated, setIsHydrated] = useState(false)
  const expiryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const CART_STORAGE_KEY = 'garden-gold-green-cart'
  const CART_EXPIRY_HOURS = 72

  function isExpired(updatedAtIso?: string | null): boolean {
    if (!updatedAtIso) return false
    const updatedAtMs = Date.parse(updatedAtIso)
    if (Number.isNaN(updatedAtMs)) return false
    const expiryMs = updatedAtMs + CART_EXPIRY_HOURS * 60 * 60 * 1000
    return Date.now() > expiryMs
  }

  function scheduleExpiry(updatedAtIso?: string | null) {
    if (expiryTimeoutRef.current) {
      clearTimeout(expiryTimeoutRef.current)
      expiryTimeoutRef.current = null
    }
    if (!updatedAtIso) return
    const updatedAtMs = Date.parse(updatedAtIso)
    if (Number.isNaN(updatedAtMs)) return
    const targetMs = updatedAtMs + CART_EXPIRY_HOURS * 60 * 60 * 1000
    const delay = Math.max(0, targetMs - Date.now())
    if (delay === 0) return
    expiryTimeoutRef.current = setTimeout(() => {
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(CART_STORAGE_KEY)
        }
      } catch {}
      dispatch({ type: 'CLEAR_CART' })
    }, delay)
  }

  // Charger le panier depuis localStorage au montage avec gestion d'expiration
  useEffect(() => {
    // Vérifier que nous sommes côté client
    if (typeof window === 'undefined') return

    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        // Compatibilité: ancien format = tableau d'items, nouveau format = { items, updatedAt }
        const items = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.items) ? parsed.items : []
        const updatedAt: string | undefined = Array.isArray(parsed) ? undefined : parsed?.updatedAt

        // Nettoyer les items avec des prix invalides
        const validItems = items.filter((item: any) => {
          const isValid = item && item.price && !isNaN(item.price) && isFinite(item.price) && item.price > 0
          if (!isValid && process.env.NODE_ENV === 'development') {
            console.warn('Item avec prix invalide supprimé:', item)
          }
          return isValid
        })

        if (updatedAt && isExpired(updatedAt)) {
          // Expiré: purge
          localStorage.removeItem(CART_STORAGE_KEY)
          dispatch({ type: 'CLEAR_CART' })
        } else {
          dispatch({ type: 'LOAD_CART', payload: validItems })
          // Programmer l'expiration si disponible
          scheduleExpiry(updatedAt)
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Erreur lors du chargement du panier:', error)
        }
      }
    }
    
    // Marquer comme hydraté
    setIsHydrated(true)
  }, [])

  // Sauvegarder le panier dans localStorage à chaque changement, avec timestamp et purge si vide
  // Seulement après l'hydratation pour éviter les conflits
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return
    
    if (state.items.length === 0) {
      // Panier vide: supprimer la clé pour éviter de garder un panier vide persistant
      try {
        localStorage.removeItem(CART_STORAGE_KEY)
      } catch {}
      // Annuler un éventuel timer d'expiration
      if (expiryTimeoutRef.current) {
        clearTimeout(expiryTimeoutRef.current)
        expiryTimeoutRef.current = null
      }
      return
    }

    const payload = {
      items: state.items,
      updatedAt: new Date().toISOString()
    }
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload))
    } catch {}
    // Reprogrammer l'expiration à chaque modification
    scheduleExpiry(payload.updatedAt)
  }, [state.items, isHydrated])

  return (
    <CartContext.Provider value={{ state, dispatch, isHydrated }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}




