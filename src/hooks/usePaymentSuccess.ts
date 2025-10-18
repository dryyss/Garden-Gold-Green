'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/contexts/CartContext'

interface UsePaymentSuccessProps {
  sessionId?: string | null
  orderId?: string | null
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function usePaymentSuccess({ 
  sessionId, 
  orderId, 
  onSuccess, 
  onError 
}: UsePaymentSuccessProps) {
  const { dispatch, state } = useCart()
  const [isProcessing, setIsProcessing] = useState(true)
  const [displayOrderId, setDisplayOrderId] = useState('')
  const [hasProcessed, setHasProcessed] = useState(false)

  useEffect(() => {
    console.log('🔄 usePaymentSuccess effect triggered', { sessionId, orderId, hasProcessed })
    
    // Éviter les appels multiples
    if (hasProcessed) {
      console.log('⚠️ Already processed, skipping')
      return
    }

    const handlePaymentSuccess = async () => {
      try {
        console.log('✅ Processing payment success...')
        setHasProcessed(true)
        
        // Vider le panier immédiatement
        console.log('🗑️ Clearing cart...')
        dispatch({ type: 'CLEAR_CART' })
        
        // Supprimer aussi du localStorage pour éviter les conflits
        if (typeof window !== 'undefined') {
          localStorage.removeItem('garden-gold-green-cart')
          console.log('🗑️ Cart removed from localStorage')
        }

        if (orderId) {
          // Commande PayPal ou autre - ID déjà disponible
          setDisplayOrderId(orderId)
          setIsProcessing(false)
          onSuccess?.()
          return
        }

        if (sessionId) {
          // Commande Stripe - récupérer l'ID de commande
          try {
            const response = await fetch(`/api/orders/session/${sessionId}`)
            if (response.ok) {
              const order = await response.json()
              setDisplayOrderId(order.id)
            } else {
              console.warn('Impossible de récupérer l\'ID de commande, utilisation du sessionId')
              setDisplayOrderId(sessionId)
            }
          } catch (error) {
            console.warn('Erreur lors de la récupération de la commande, utilisation du sessionId:', error)
            setDisplayOrderId(sessionId)
          }
        }

        setIsProcessing(false)
        onSuccess?.()

      } catch (error) {
        console.error('Erreur lors du traitement du paiement:', error)
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
        onError?.(errorMessage)
        setIsProcessing(false)
      }
    }

    if (sessionId || orderId) {
      handlePaymentSuccess()
    } else {
      setIsProcessing(false)
    }
  }, [sessionId, orderId, dispatch, onSuccess, onError, hasProcessed])

  return {
    isProcessing,
    displayOrderId,
    cartCleared: state.items.length === 0
  }
}

