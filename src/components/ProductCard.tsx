'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { StarRating } from './StarRating'

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
}

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className = '' }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useCart()

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        }
      })
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsLoading(false)
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

        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || isLoading}
          className={`w-full font-bold py-2 px-5 rounded-full text-sm transition-all duration-300 ${
            product.inStock
              ? 'btn-gold text-black hover:shadow-gold-glow'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          } ${isLoading ? 'opacity-50' : ''}`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="spinner"></div>
              Ajout...
            </div>
          ) : product.inStock ? (
            'Ajouter au panier'
          ) : (
            'Rupture de stock'
          )}
        </button>
      </div>
    </div>
  )
}