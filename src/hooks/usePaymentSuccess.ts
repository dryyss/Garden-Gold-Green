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
    // Éviter les appels multiples
    if (hasProcessed) {
      return
    }

    const handlePaymentSuccess = async () => {
      try {
        setHasProcessed(true)
        
        // Vider le panier immédiatement
        dispatch({ type: 'CLEAR_CART' })
        
        // Supprimer aussi du localStorage pour éviter les conflits
        if (typeof window !== 'undefined') {
          localStorage.removeItem('garden-gold-green-cart')
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

