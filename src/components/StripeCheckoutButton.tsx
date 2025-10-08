'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreditCard, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useCart } from '@/contexts/CartContext'
import { useNotifications } from '@/contexts/NotificationContext'

interface StripeCheckoutButtonProps {
  className?: string
}

export function StripeCheckoutButton({ className = '' }: StripeCheckoutButtonProps) {
  const { state } = useCart()
  const { addNotification } = useNotifications()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    if (state.items.length === 0) {
      addNotification({
        type: 'error',
        title: 'Panier vide',
        message: 'Ajoutez des produits avant de passer commande',
      })
      return
    }

    setIsLoading(true)

    try {
      // Créer la session Stripe
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items,
          successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/checkout/cancel`,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la session')
      }

      const { url } = await response.json()

      // Rediriger vers Stripe Checkout
      window.location.href = url

    } catch (error) {
      console.error('Erreur checkout:', error)
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de démarrer le paiement. Veuillez réessayer.',
      })
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading || state.items.length === 0}
      className={`btn-gold text-black font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 shadow-gold-glow hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${className}`}
    >
      {isLoading ? (
        <>
          <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 animate-spin" />
          <span>Chargement...</span>
        </>
      ) : (
        <>
          <FontAwesomeIcon icon={faCreditCard} className="w-5 h-5" />
          <span>Payer avec Stripe</span>
        </>
      )}
    </button>
  )
}

