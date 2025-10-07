'use client'

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { useCart } from '@/contexts/CartContext'

export function FloatingCartButton() {
  const [isVisible, setIsVisible] = useState(false)
  const { state, dispatch } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      // Afficher le bouton après avoir scrollé de 300px
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <button
      onClick={() => dispatch({ type: 'TOGGLE_CART' })}
      className={`
        fixed bottom-6 right-6 z-40
        w-14 h-14 sm:w-16 sm:h-16
        bg-brand-gold text-black rounded-full
        shadow-2xl shadow-brand-gold/50
        hover:shadow-gold-glow hover:scale-110
        transition-all duration-300
        flex items-center justify-center
        animate-bounce-slow
      `}
      aria-label="Ouvrir le panier"
    >
      <FontAwesomeIcon icon={faShoppingCart} className="w-5 h-5 sm:w-6 sm:h-6" />
      {state.totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-brand-green text-white text-xs sm:text-sm rounded-full h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center font-bold animate-pulse">
          {state.totalItems}
        </span>
      )}
    </button>
  )
}

