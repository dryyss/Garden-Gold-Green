'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { generateOrderNumber } from '@/lib/order-utils'

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
          setDisplayOrderId(generateOrderNumber(orderId))
          setIsProcessing(false)
          onSuccess?.()
          return
        }

        if (sessionId) {
          // Commande Stripe - récupérer ou créer la commande
          try {
            // D'abord, essayer de récupérer la commande existante
            let response = await fetch(`/api/orders/session/${sessionId}`)
            
            if (!response.ok) {
              // Si la commande n'existe pas, la créer depuis la session Stripe
              console.log('📝 Commande non trouvée, création depuis la session Stripe...')
              response = await fetch('/api/orders/create-from-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId })
              })
              
              if (response.ok) {
                const data = await response.json()
                if (data.success && data.order) {
                  console.log(`✅ Commande créée: ${data.order.id}`)
                  setDisplayOrderId(generateOrderNumber(data.order.id, data.order.createdAt))
                } else {
                  console.warn('Impossible de créer la commande')
                  setDisplayOrderId(generateOrderNumber(sessionId))
                }
              } else {
                console.warn('Erreur lors de la création de la commande')
                setDisplayOrderId(generateOrderNumber(sessionId))
              }
            } else {
              // Commande trouvée
              const order = await response.json()
              setDisplayOrderId(generateOrderNumber(order.id, order.createdAt))
            }
          } catch (error) {
            console.error('Erreur lors de la récupération/création de la commande:', error)
            // Même en cas d'erreur, formater le sessionId pour afficher un numéro propre
            setDisplayOrderId(generateOrderNumber(sessionId))
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

