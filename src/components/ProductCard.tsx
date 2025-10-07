'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faCheck, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { useCart } from '@/contexts/CartContext'
import { useNotifications } from '@/contexts/NotificationContext'
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
            price: product.price,
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
    <div className={`card-bg rounded-xl overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-gold-glow ${className}`}>
      <div className="relative h-72 overflow-hidden">
        <Image
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          src={product.image}
          alt={product.name}
          width={400}
          height={288}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-brand-green text-white text-xs font-semibold px-2 py-1 rounded-full">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-brand-gold text-black text-xs font-semibold px-2 py-1 rounded-full">
              Best Seller
            </span>
          )}
        </div>

        {/* Quick view button */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            href={`/products/${product.slug || product.id}`}
            className="bg-white text-black font-semibold py-2 px-4 rounded-full hover:bg-brand-gold transition-colors"
          >
            Voir le produit
          </Link>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-brand-green text-sm font-semibold uppercase tracking-wide">
            {product.category}
          </span>
          <StarRating rating={product.rating} size="sm" />
        </div>

        <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Stock indicator */}
        {product.totalStock !== undefined && (
          <div className="mb-2">
            {product.totalStock === 0 ? (
              <span className="text-xs text-red-500 font-semibold">Rupture de stock</span>
            ) : product.totalStock < 10 ? (
              <span className="text-xs text-orange-500 font-semibold">Plus que {product.totalStock} en stock !</span>
            ) : product.totalStock < 30 ? (
              <span className="text-xs text-yellow-500">{product.totalStock} en stock</span>
            ) : (
              <span className="text-xs text-green-500">En stock</span>
            )}
          </div>
        )}

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold gold-text-gradient">
              {product.price.toFixed(2)} €
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-500 line-through text-sm">
                {product.originalPrice.toFixed(2)} €
              </span>
            )}
          </div>
          <span className="text-gray-400 text-sm">
            ({product.reviewCount} avis)
          </span>
        </div>

        {/* Indicateur de quantité dans le panier */}
        {cartQuantity > 0 && (
          <div className="mb-3 flex items-center justify-center">
            <div className="bg-brand-green/20 text-brand-green px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
              <FontAwesomeIcon icon={faShoppingCart} className="w-3 h-3" />
              <span>{cartQuantity} dans le panier</span>
            </div>
          </div>
        )}

        {/* Sélecteur de quantité */}
        <div className="mb-3 flex items-center justify-center gap-3">
          <span className="text-gray-400 text-sm">Quantité:</span>
          <div className="flex items-center border border-white/20 rounded-lg">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Diminuer"
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
              className="w-12 text-center bg-transparent text-white border-none outline-none"
            />
            
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= 99}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Augmenter"
            >
              <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Bouton Ajouter au panier avec animation */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding || isAdded}
          className={`w-full font-bold py-3 px-5 rounded-full text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
            isAdded
              ? 'bg-brand-green text-white shadow-green-glow'
              : product.inStock
              ? 'btn-gold text-black hover:shadow-gold-glow hover:scale-105'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          } ${isAdding ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isAdding ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              <span>Ajout...</span>
            </>
          ) : isAdded ? (
            <>
              <FontAwesomeIcon icon={faCheck} className="w-4 h-4 animate-bounce" />
              <span>Ajouté !</span>
            </>
          ) : product.inStock ? (
            <>
              <FontAwesomeIcon icon={faShoppingCart} className="w-4 h-4" />
              <span>Ajouter au panier</span>
            </>
          ) : (
            'Rupture de stock'
          )}
        </button>
      </div>
    </div>
  )
}
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faCheck, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { useCart } from '@/contexts/CartContext'
import { useNotifications } from '@/contexts/NotificationContext'
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
            price: product.price,
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
    <div className={`card-bg rounded-xl overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-gold-glow ${className}`}>
      <div className="relative h-72 overflow-hidden">
        <Image
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          src={product.image}
          alt={product.name}
          width={400}
          height={288}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-brand-green text-white text-xs font-semibold px-2 py-1 rounded-full">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-brand-gold text-black text-xs font-semibold px-2 py-1 rounded-full">
              Best Seller
            </span>
          )}
        </div>

        {/* Quick view button */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            href={`/products/${product.slug || product.id}`}
            className="bg-white text-black font-semibold py-2 px-4 rounded-full hover:bg-brand-gold transition-colors"
          >
            Voir le produit
          </Link>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-brand-green text-sm font-semibold uppercase tracking-wide">
            {product.category}
          </span>
          <StarRating rating={product.rating} size="sm" />
        </div>

        <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Stock indicator */}
        {product.totalStock !== undefined && (
          <div className="mb-2">
            {product.totalStock === 0 ? (
              <span className="text-xs text-red-500 font-semibold">Rupture de stock</span>
            ) : product.totalStock < 10 ? (
              <span className="text-xs text-orange-500 font-semibold">Plus que {product.totalStock} en stock !</span>
            ) : product.totalStock < 30 ? (
              <span className="text-xs text-yellow-500">{product.totalStock} en stock</span>
            ) : (
              <span className="text-xs text-green-500">En stock</span>
            )}
          </div>
        )}

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold gold-text-gradient">
              {product.price.toFixed(2)} €
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-500 line-through text-sm">
                {product.originalPrice.toFixed(2)} €
              </span>
            )}
          </div>
          <span className="text-gray-400 text-sm">
            ({product.reviewCount} avis)
          </span>
        </div>

        {/* Indicateur de quantité dans le panier */}
        {cartQuantity > 0 && (
          <div className="mb-3 flex items-center justify-center">
            <div className="bg-brand-green/20 text-brand-green px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
              <FontAwesomeIcon icon={faShoppingCart} className="w-3 h-3" />
              <span>{cartQuantity} dans le panier</span>
            </div>
          </div>
        )}

        {/* Sélecteur de quantité */}
        <div className="mb-3 flex items-center justify-center gap-3">
          <span className="text-gray-400 text-sm">Quantité:</span>
          <div className="flex items-center border border-white/20 rounded-lg">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Diminuer"
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
              className="w-12 text-center bg-transparent text-white border-none outline-none"
            />
            
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= 99}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Augmenter"
            >
              <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Bouton Ajouter au panier avec animation */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding || isAdded}
          className={`w-full font-bold py-3 px-5 rounded-full text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
            isAdded
              ? 'bg-brand-green text-white shadow-green-glow'
              : product.inStock
              ? 'btn-gold text-black hover:shadow-gold-glow hover:scale-105'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          } ${isAdding ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isAdding ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              <span>Ajout...</span>
            </>
          ) : isAdded ? (
            <>
              <FontAwesomeIcon icon={faCheck} className="w-4 h-4 animate-bounce" />
              <span>Ajouté !</span>
            </>
          ) : product.inStock ? (
            <>
              <FontAwesomeIcon icon={faShoppingCart} className="w-4 h-4" />
              <span>Ajouter au panier</span>
            </>
          ) : (
            'Rupture de stock'
          )}
        </button>
      </div>
    </div>
  )
}