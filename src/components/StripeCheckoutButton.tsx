'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreditCard, faSpinner, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { useCart } from '@/contexts/CartContext'
import { useNotifications } from '@/contexts/NotificationContext'

interface StripeCheckoutButtonProps {
  className?: string
}

export function StripeCheckoutButton({ className = '' }: StripeCheckoutButtonProps) {
  const { state, dispatch } = useCart()
  const { addNotification } = useNotifications()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  
  // Vérifier si on est sur la page panier
  const isOnCartPage = pathname === '/cart'

  const handleButtonClick = () => {
    if (state.items.length === 0) {
      addNotification({
        type: 'error',
        title: 'Panier vide',
        message: 'Ajoutez des produits avant de passer commande',
      })
      return
    }

    // Si on n'est pas sur la page panier, rediriger vers le panier
    if (!isOnCartPage) {
      dispatch({ type: 'TOGGLE_CART' })
      return
    }

    // Si on est sur la page panier, faire le checkout
    handleCheckout()
  }

  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      // Créer la session Stripe
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items,
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
      onClick={handleButtonClick}
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
          <FontAwesomeIcon icon={isOnCartPage ? faCreditCard : faShoppingCart} className="w-5 h-5" />
          <span>{isOnCartPage ? 'Paiement' : 'Voir le panier'}</span>
        </>
      )}
    </button>
  )
}