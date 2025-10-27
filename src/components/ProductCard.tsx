'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faCheck, faShoppingCart, faEye } from '@fortawesome/free-solid-svg-icons'
import { useCart } from '@/contexts/CartContext'
import { useNotifications } from '@/contexts/NotificationContext'
import { useTranslation } from '@/contexts/TranslationContext'
import { StarRating } from './StarRating'

interface Variant {
  id: string
  weight: number
  unit: string
  priceCents: number
  stock: number
  sku: string
  isDefault: boolean
}

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  description: string
  rating: number
  reviewCount: number
  inStock: boolean
  isNew?: boolean
  isBestSeller?: boolean
  slug?: string
  cbdPercent?: number
  variants?: Variant[]
  totalStock?: number
}

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className = '' }: ProductCardProps) {
  const { t } = useTranslation()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const { dispatch, state } = useCart()
  const { addNotification } = useNotifications()

  // Récupérer la quantité actuelle dans le panier
  const cartItem = state.items.find(item => item.id === product.id)
  const cartQuantity = cartItem?.quantity || 0

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(99, prev + delta)))
  }

  const handleAddToCart = async () => {
    if (isAdding || isAdded) return

    setIsAdding(true)
    
    try {
      // Ajouter la quantité sélectionnée
      for (let i = 0; i < quantity; i++) {
        dispatch({
          type: 'ADD_ITEM',
          payload: {
            id: product.id,
            name: product.name,
            price: product.price ?? 0,
            image: product.image,
            cbdPercent: product.cbdPercent,
            slug: product.slug
          }
        })
      }

      // Animation de succès
      setIsAdded(true)
      
      // Notification
      addNotification({
        type: 'success',
        title: 'Produit ajouté !',
        message: `${quantity} x ${product.name} ajouté${quantity > 1 ? 's' : ''} au panier`,
        duration: 3000
      })

      // Reset après 2 secondes
      setTimeout(() => {
        setIsAdded(false)
        setIsAdding(false)
        setQuantity(1) // Reset la quantité
      }, 2000)

    } catch (error) {
      console.error('Error adding to cart:', error)
      setIsAdding(false)
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible d\'ajouter le produit au panier',
        duration: 3000
      })
    }
  }

  return (
    <div className={`card-bg rounded-lg sm:rounded-xl overflow-hidden group transform hover:-translate-y-1 sm:hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-gold-glow w-full max-w-full h-full flex flex-col ${className}`}>
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden flex-1">
        <Link href={`/products/${product.slug || product.id}`} className="block">
          <Image
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
            src={product.image}
            alt={product.name}
            width={400}
            height={288}
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2">
          {product.isNew && (
            <span className="bg-brand-green text-white text-xs font-semibold px-2 py-1 rounded-full">
              {t('products.new')}
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-brand-gold text-black text-xs font-semibold px-2 py-1 rounded-full">
              {t('products.bestSeller')}
            </span>
          )}
        </div>

        {/* Quick view button - visible on mobile, hover on desktop */}
        <div className="absolute inset-0 bg-black/50 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            href={`/products/${product.slug || product.id}`}
            className="bg-white text-black font-semibold py-2 px-4 rounded-full hover:bg-brand-gold transition-colors"
          >
            {t('products.viewDetails')}
          </Link>
        </div>
      </div>

      <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-brand-green text-xs font-semibold uppercase tracking-wide">
            {product.category}
          </span>
          <StarRating rating={product.rating} size="sm" />
        </div>

        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2 line-clamp-2 flex-1">
          {product.name}
        </h3>

        {/* Stock indicator */}
        {product.totalStock !== undefined && (
          <div className="mb-2">
            {product.totalStock === 0 ? (
              <span className="text-xs text-red-500 font-semibold">{t('products.outOfStock')}</span>
            ) : product.totalStock < 10 ? (
              <span className="text-xs text-orange-500 font-semibold">{t('products.lowStock')} ({product.totalStock})</span>
            ) : product.totalStock < 30 ? (
              <span className="text-xs text-yellow-500">{t('products.stockCount')} ({product.totalStock})</span>
            ) : (
              <span className="text-xs text-green-500">{t('products.inStock')}</span>
            )}
          </div>
        )}

        <p className="text-gray-400 text-xs md:text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <span className="text-lg sm:text-xl md:text-2xl font-bold gold-text-gradient">
              {product.price.toFixed(2)} €
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-500 line-through text-xs">
                {product.originalPrice.toFixed(2)} €
              </span>
            )}
          </div>
          <span className="text-gray-400 text-xs">
            ({product.reviewCount} avis)
          </span>
        </div>

        {/* Indicateur de quantité dans le panier */}
        {cartQuantity > 0 && (
          <div className="mb-3 flex items-center justify-center">
            <div className="bg-brand-green/20 text-brand-green px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
              <FontAwesomeIcon icon={faShoppingCart} className="w-3 h-3" />
              <span>{cartQuantity} {t('cart.inCart')}</span>
            </div>
          </div>
        )}

        {/* Sélecteur de quantité */}
        <div className="mb-3 flex items-center justify-center gap-2">
          <span className="text-gray-400 text-xs font-medium">{t('products.quantity')}:</span>
          <div className="flex items-center border border-white/20 rounded-lg">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={t('actions.decrease')}
            >
              <FontAwesomeIcon icon={faMinus} className="w-3 h-3" />
            </button>
            
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1
                setQuantity(Math.max(1, Math.min(99, val)))
              }}
              min={1}
              max={99}
              className="w-12 text-center bg-transparent text-white border-none outline-none text-sm font-semibold"
            />
            
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= 99}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={t('actions.increase')}
            >
              <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
            </button>
          </div>
        </div>

                    {/* Boutons d'action */}
                    <div className="flex flex-col gap-1.5 sm:gap-2 mt-auto">
                      {/* Bouton Voir le produit - toujours visible sur mobile */}
                      <Link
                        href={`/products/${product.slug || product.id}`}
                        className="w-full font-bold py-1.5 sm:py-2 px-3 sm:px-4 rounded-full text-xs transition-all duration-300 flex items-center justify-center gap-1.5 border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black"
                      >
                        <FontAwesomeIcon icon={faEye} className="w-3 h-3" />
                        <span className="hidden sm:inline">{t('products.viewDetails')}</span>
                        <span className="sm:hidden">Voir</span>
                      </Link>

                      {/* Bouton Ajouter au panier avec animation */}
                      <button
                        onClick={handleAddToCart}
                        disabled={!product.inStock || isAdding || isAdded}
                        className={`w-full font-bold py-1.5 sm:py-2 px-3 sm:px-4 rounded-full text-xs transition-all duration-300 flex items-center justify-center gap-1.5 ${
                          isAdded
                            ? 'bg-brand-green text-white shadow-green-glow'
                            : product.inStock
                            ? 'btn-gold text-black hover:shadow-gold-glow hover:scale-105'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        } ${isAdding ? 'opacity-75 cursor-not-allowed' : ''}`}
                      >
                        {isAdding ? (
                          <>
                            <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            <span className="hidden sm:inline">{t('products.adding')}</span>
                            <span className="sm:hidden">Ajout...</span>
                          </>
                        ) : isAdded ? (
                          <>
                            <FontAwesomeIcon icon={faCheck} className="w-3 h-3 animate-bounce" />
                            <span className="hidden sm:inline">{t('products.added')}</span>
                            <span className="sm:hidden">Ajouté!</span>
                          </>
                        ) : product.inStock ? (
                          <>
                            <FontAwesomeIcon icon={faShoppingCart} className="w-3 h-3" />
                            <span className="hidden sm:inline">{t('products.addToCart')}</span>
                            <span className="sm:hidden">Ajouter</span>
                          </>
                        ) : (
                          <span className="text-xs">{t('products.outOfStock')}</span>
                        )}
          </button>
        </div>
      </div>
    </div>
  )
}



