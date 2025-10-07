'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faEye, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { AddToCartButton } from './AddToCartButton'
import productsData from '@/data/products.json'

interface ProductRecommendationsProps {
  currentCartItems: any[]
  title?: string
  maxItems?: number
}

export function ProductRecommendations({ 
  currentCartItems, 
  title = "Vous pourriez aussi aimer",
  maxItems = 4
}: ProductRecommendationsProps) {
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuler un délai de chargement pour les recommandations
    const timer = setTimeout(() => {
      const recommendations = getRecommendations(currentCartItems, maxItems)
      setRecommendedProducts(recommendations)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [currentCartItems, maxItems])

  const getRecommendations = (cartItems: any[], max: number) => {
    // Exclure les produits déjà dans le panier
    const cartItemIds = cartItems.map(item => item.id)
    const availableProducts = productsData.filter(product => !cartItemIds.includes(product.id))

    // Algorithme de recommandation simple basé sur les catégories
    const cartCategories = cartItems.reduce((acc, item) => {
      const product = productsData.find(p => p.id === item.id)
      if (product?.categories) {
        product.categories.forEach((cat: any) => {
          acc[cat.name] = (acc[cat.name] || 0) + 1
        })
      }
      return acc
    }, {} as Record<string, number>)

    // Trier par pertinence (catégories communes + prix similaire)
    const scoredProducts = availableProducts.map(product => {
      let score = 0
      
      // Score basé sur les catégories communes
      if (product.categories) {
        product.categories.forEach((cat: any) => {
          score += cartCategories[cat.name] || 0
        })
      }

      // Score basé sur le prix (préférer des prix similaires)
      const avgCartPrice = cartItems.reduce((sum, item) => sum + item.price, 0) / cartItems.length
      const priceDiff = Math.abs((product.priceCents / 100) - avgCartPrice)
      score += Math.max(0, 10 - priceDiff / 10)

      // Bonus pour les produits populaires (basé sur un score aléatoire pour la démo)
      score += Math.random() * 5

      return { ...product, score }
    })

    // Trier par score et prendre les meilleurs
    return scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, max)
      .map(product => ({
        ...product,
        name: product.title,
        price: product.priceCents / 100,
        image: product.images?.[0] || '/logo.png',
        category: product.categories?.[0]?.name || 'CBD Products',
        rating: 4.5 + Math.random() * 0.5, // Note entre 4.5 et 5
        reviewCount: Math.floor(Math.random() * 100) + 10,
        inStock: product.stock > 0,
        isNew: Math.random() > 0.7,
        isBestSeller: Math.random() > 0.8
      }))
  }

  if (loading) {
    return (
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-white mb-8">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: maxItems }).map((_, index) => (
            <div key={index} className="bg-white/5 rounded-xl p-6 animate-pulse">
              <div className="aspect-square bg-white/10 rounded-lg mb-4"></div>
              <div className="h-4 bg-white/10 rounded mb-2"></div>
              <div className="h-6 bg-white/10 rounded mb-4 w-1/2"></div>
              <div className="h-10 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (recommendedProducts.length === 0) {
    return null
  }

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-white mb-8">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendedProducts.map((product) => (
          <div key={product.id} className="group bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            {/* Image du produit */}
            <div className="aspect-square mb-4 relative overflow-hidden rounded-lg">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.isNew && (
                  <span className="bg-brand-green text-white text-xs px-2 py-1 rounded-full font-semibold">
                    Nouveau
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="bg-brand-gold text-black text-xs px-2 py-1 rounded-full font-semibold">
                    Best Seller
                  </span>
                )}
              </div>

              {/* Actions rapides */}
              <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-brand-gold hover:text-black transition-colors">
                  <FontAwesomeIcon icon={faHeart} className="text-sm" />
                </button>
                <Link 
                  href={`/products/${product.slug || product.id}`}
                  className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-brand-green hover:text-black transition-colors"
                >
                  <FontAwesomeIcon icon={faEye} className="text-sm" />
                </Link>
              </div>
            </div>

            {/* Informations du produit */}
            <div className="mb-4">
              <h4 className="font-semibold text-white mb-1 line-clamp-2 group-hover:text-brand-gold transition-colors">
                {product.name}
              </h4>
              
              {/* Note et avis */}
              <div className="flex items-center mb-2">
                <div className="flex text-brand-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < Math.floor(product.rating) ? 'text-brand-gold' : 'text-gray-600'}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-400 ml-2">
                  ({product.reviewCount} avis)
                </span>
              </div>

              {/* Catégorie */}
              <p className="text-sm text-gray-400 mb-2">{product.category}</p>
              
              {/* Prix */}
              <p className="text-brand-gold font-bold text-lg">
                {product.price.toFixed(2)} €
              </p>
            </div>

            {/* Bouton d'ajout au panier */}
            <AddToCartButton 
              product={product}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faEye, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { AddToCartButton } from './AddToCartButton'
import productsData from '@/data/products.json'

interface ProductRecommendationsProps {
  currentCartItems: any[]
  title?: string
  maxItems?: number
}

export function ProductRecommendations({ 
  currentCartItems, 
  title = "Vous pourriez aussi aimer",
  maxItems = 4
}: ProductRecommendationsProps) {
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuler un délai de chargement pour les recommandations
    const timer = setTimeout(() => {
      const recommendations = getRecommendations(currentCartItems, maxItems)
      setRecommendedProducts(recommendations)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [currentCartItems, maxItems])

  const getRecommendations = (cartItems: any[], max: number) => {
    // Exclure les produits déjà dans le panier
    const cartItemIds = cartItems.map(item => item.id)
    const availableProducts = productsData.filter(product => !cartItemIds.includes(product.id))

    // Algorithme de recommandation simple basé sur les catégories
    const cartCategories = cartItems.reduce((acc, item) => {
      const product = productsData.find(p => p.id === item.id)
      if (product?.categories) {
        product.categories.forEach((cat: any) => {
          acc[cat.name] = (acc[cat.name] || 0) + 1
        })
      }
      return acc
    }, {} as Record<string, number>)

    // Trier par pertinence (catégories communes + prix similaire)
    const scoredProducts = availableProducts.map(product => {
      let score = 0
      
      // Score basé sur les catégories communes
      if (product.categories) {
        product.categories.forEach((cat: any) => {
          score += cartCategories[cat.name] || 0
        })
      }

      // Score basé sur le prix (préférer des prix similaires)
      const avgCartPrice = cartItems.reduce((sum, item) => sum + item.price, 0) / cartItems.length
      const priceDiff = Math.abs((product.priceCents / 100) - avgCartPrice)
      score += Math.max(0, 10 - priceDiff / 10)

      // Bonus pour les produits populaires (basé sur un score aléatoire pour la démo)
      score += Math.random() * 5

      return { ...product, score }
    })

    // Trier par score et prendre les meilleurs
    return scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, max)
      .map(product => ({
        ...product,
        name: product.title,
        price: product.priceCents / 100,
        image: product.images?.[0] || '/logo.png',
        category: product.categories?.[0]?.name || 'CBD Products',
        rating: 4.5 + Math.random() * 0.5, // Note entre 4.5 et 5
        reviewCount: Math.floor(Math.random() * 100) + 10,
        inStock: product.stock > 0,
        isNew: Math.random() > 0.7,
        isBestSeller: Math.random() > 0.8
      }))
  }

  if (loading) {
    return (
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-white mb-8">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: maxItems }).map((_, index) => (
            <div key={index} className="bg-white/5 rounded-xl p-6 animate-pulse">
              <div className="aspect-square bg-white/10 rounded-lg mb-4"></div>
              <div className="h-4 bg-white/10 rounded mb-2"></div>
              <div className="h-6 bg-white/10 rounded mb-4 w-1/2"></div>
              <div className="h-10 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (recommendedProducts.length === 0) {
    return null
  }

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-white mb-8">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendedProducts.map((product) => (
          <div key={product.id} className="group bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            {/* Image du produit */}
            <div className="aspect-square mb-4 relative overflow-hidden rounded-lg">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.isNew && (
                  <span className="bg-brand-green text-white text-xs px-2 py-1 rounded-full font-semibold">
                    Nouveau
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="bg-brand-gold text-black text-xs px-2 py-1 rounded-full font-semibold">
                    Best Seller
                  </span>
                )}
              </div>

              {/* Actions rapides */}
              <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-brand-gold hover:text-black transition-colors">
                  <FontAwesomeIcon icon={faHeart} className="text-sm" />
                </button>
                <Link 
                  href={`/products/${product.slug || product.id}`}
                  className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-brand-green hover:text-black transition-colors"
                >
                  <FontAwesomeIcon icon={faEye} className="text-sm" />
                </Link>
              </div>
            </div>

            {/* Informations du produit */}
            <div className="mb-4">
              <h4 className="font-semibold text-white mb-1 line-clamp-2 group-hover:text-brand-gold transition-colors">
                {product.name}
              </h4>
              
              {/* Note et avis */}
              <div className="flex items-center mb-2">
                <div className="flex text-brand-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < Math.floor(product.rating) ? 'text-brand-gold' : 'text-gray-600'}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-400 ml-2">
                  ({product.reviewCount} avis)
                </span>
              </div>

              {/* Catégorie */}
              <p className="text-sm text-gray-400 mb-2">{product.category}</p>
              
              {/* Prix */}
              <p className="text-brand-gold font-bold text-lg">
                {product.price.toFixed(2)} €
              </p>
            </div>

            {/* Bouton d'ajout au panier */}
            <AddToCartButton 
              product={product}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
