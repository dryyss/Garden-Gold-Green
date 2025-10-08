'use client'

import { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useCart } from '@/contexts/CartContext'
import { useNotifications } from '@/contexts/NotificationContext'
import { CartFlyAnimation } from './CartFlyAnimation'
import { ConfettiAnimation } from './ConfettiAnimation'

interface AddToCartButtonProps {
  product: {
    id: string
    name?: string
    title?: string
    price?: number
    priceCents?: number
    currency?: string
    image: string
    cbdPercent?: number
    slug?: string
  }
  className?: string
  children?: React.ReactNode
  showNotification?: boolean
}

export function AddToCartButton({ 
  product, 
  className = '', 
  children, 
  showNotification = true 
}: AddToCartButtonProps) {
  const { dispatch } = useCart()
  const { addNotification } = useNotifications()
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showFlyAnimation, setShowFlyAnimation] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleAddToCart = async () => {
    if (isAdding || isAdded) return

    setIsAdding(true)
    setIsAnimating(true)

    // Animation de pulsation
    if (buttonRef.current) {
      buttonRef.current.classList.add('animate-pulse-custom')
    }

    try {
      // Simuler un délai d'ajout
      await new Promise(resolve => setTimeout(resolve, 500))

      // Ajouter au panier
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          id: product.id,
          name: product.name || product.title || 'Produit',
          price: product.price || (product.priceCents ? product.priceCents / 100 : 0),
          image: product.image,
          cbdPercent: product.cbdPercent,
          slug: product.slug
        }
      })

      // Animation de succès
      setIsAdded(true)
      setShowFlyAnimation(true)
      setShowConfetti(true)
      if (buttonRef.current) {
        buttonRef.current.classList.remove('animate-pulse-custom')
        buttonRef.current.classList.add('animate-bounce')
      }

      // Notification
      if (showNotification) {
        addNotification({
          type: 'success',
          title: 'Produit ajouté !',
          message: `${product.name || product.title} a été ajouté à votre panier`,
          duration: 3000
        })
      }

      // Reset après animation
      setTimeout(() => {
        setIsAdded(false)
        setIsAdding(false)
        setIsAnimating(false)
        setShowFlyAnimation(false)
        setShowConfetti(false)
        if (buttonRef.current) {
          buttonRef.current.classList.remove('animate-bounce')
        }
      }, 2000)

    } catch (error) {
      setIsAdding(false)
      setIsAnimating(false)
      if (buttonRef.current) {
        buttonRef.current.classList.remove('animate-pulse-custom')
      }
      
      if (showNotification) {
        addNotification({
          type: 'error',
          title: 'Erreur',
          message: 'Impossible d\'ajouter le produit au panier',
          duration: 3000
        })
      }
    }
  }

  const getButtonContent = () => {
    if (isAdding) {
      return (
        <>
          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          Ajout...
        </>
      )
    }

    if (isAdded) {
      return (
        <>
          <FontAwesomeIcon icon={faCheck} className="animate-checkmark" />
          Ajouté !
        </>
      )
    }

    return (
      <>
        <FontAwesomeIcon icon={faShoppingCart} />
        {children || 'Ajouter au panier'}
      </>
    )
  }

  const getButtonClasses = () => {
    const baseClasses = `btn-gold text-black font-bold py-2 px-5 rounded-full text-sm inline-flex items-center gap-2 transition-all duration-300 ${className}`
    
    if (isAdded) {
      return `${baseClasses} bg-brand-green hover:bg-brand-green/90 shadow-green-glow`
    }
    
    if (isAdding) {
      return `${baseClasses} opacity-75 cursor-not-allowed`
    }
    
    return `${baseClasses} hover:shadow-gold-glow-lg hover:scale-105`
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleAddToCart}
        disabled={isAdding || isAdded}
        className={getButtonClasses()}
        data-add-to-cart
      >
        {getButtonContent()}
      </button>
      
      <CartFlyAnimation 
        isActive={showFlyAnimation}
        productImage={product.image}
        productName={product.name || product.title || 'Produit'}
        onComplete={() => setShowFlyAnimation(false)}
      />
      
      <ConfettiAnimation 
        isActive={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
    </>
  )
}




