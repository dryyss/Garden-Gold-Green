'use client'

import { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faCheck, faSpinner, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
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
  showQuantity?: boolean
  variant?: 'default' | 'compact' | 'full'
}

export function AddToCartButton({ 
  product, 
  className = '', 
  children, 
  showNotification = true,
  showQuantity = true,
  variant = 'default'
}: AddToCartButtonProps) {
  const { state, dispatch } = useCart()
  const { addNotification } = useNotifications()
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [showFlyAnimation, setShowFlyAnimation] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Trouver la quantité actuelle du produit dans le panier
  const cartItem = state.items.find(item => item.id === product.id)
  const currentQuantity = cartItem?.quantity || 0

  const handleAddToCart = async () => {
    if (isAdding || isAdded) return

    setIsAdding(true)

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
        if (buttonRef.current) {
          buttonRef.current.classList.remove('animate-bounce')
        }
      }, 2000)

    } catch {
      setIsAdding(false)
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

  const handleRemoveFromCart = () => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: product.id
    })
  }

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart()
    } else {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id: product.id, quantity: newQuantity }
      })
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

    if (currentQuantity > 0 && showQuantity) {
      return (
        <div className="flex items-center justify-between w-full">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleUpdateQuantity(currentQuantity - 1)
            }}
            className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <FontAwesomeIcon icon={faMinus} className="text-xs" />
          </button>
          <span className="font-bold">{currentQuantity}</span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleUpdateQuantity(currentQuantity + 1)
            }}
            className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
          </button>
        </div>
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
      return `${baseClasses} bg-brand-green hover:bg-brand-green/90 shadow-green-glow scale-105`
    }
    
    if (isAdding) {
      return `${baseClasses} opacity-75 cursor-not-allowed`
    }

    if (currentQuantity > 0 && showQuantity) {
      return `${baseClasses} bg-brand-green hover:bg-brand-green/90 shadow-green-glow min-w-[120px]`
    }
    
    return `${baseClasses} hover:shadow-gold-glow-lg hover:scale-105`
  }

  // Variants de style
  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'py-1 px-3 text-xs min-w-[100px]'
      case 'full':
        return 'py-3 px-6 text-base w-full justify-center'
      default:
        return 'py-2 px-5 text-sm'
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleAddToCart}
        disabled={isAdding || isAdded}
        className={`${getButtonClasses()} ${getVariantClasses()}`}
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
