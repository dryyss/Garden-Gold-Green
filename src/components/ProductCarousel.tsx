'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { StarRating } from '@/components/StarRating'

interface Product {
  id: string
  name: string
  price: number
  image: string
  slug: string
  rating: number
  reviewCount: number
  isNew?: boolean
  isBestSeller?: boolean
  inStock?: boolean
}

interface ProductCarouselProps {
  products: Product[]
  title: string
  className?: string
  itemsPerView?: {
    mobile: number
    tablet: number
    desktop: number
  }
  autoPlay?: boolean
  autoPlayInterval?: number
}

export function ProductCarousel({ 
  products, 
  title, 
  className = '',
  itemsPerView = { mobile: 1, tablet: 2, desktop: 3 },
  autoPlay = false,
  autoPlayInterval = 4000
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isHovered || products.length <= itemsPerView.desktop) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = Math.max(0, products.length - itemsPerView.desktop)
        return prevIndex >= maxIndex ? 0 : prevIndex + 1
      })
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, products.length, itemsPerView.desktop, isHovered])

  // Calculer le nombre d'éléments visibles selon la taille d'écran
  const getItemsPerView = () => {
    if (typeof window === 'undefined') return itemsPerView.desktop
    if (window.innerWidth < 640) return itemsPerView.mobile
    if (window.innerWidth < 1024) return itemsPerView.tablet
    return itemsPerView.desktop
  }

  const [currentItemsPerView, setCurrentItemsPerView] = useState(getItemsPerView())

  useEffect(() => {
    const handleResize = () => {
      setCurrentItemsPerView(getItemsPerView())
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const goToPrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1))
  }

  const goToNext = () => {
    const maxIndex = Math.max(0, products.length - currentItemsPerView)
    setCurrentIndex(Math.min(maxIndex, currentIndex + 1))
  }

  const canGoPrevious = currentIndex > 0
  const canGoNext = currentIndex < Math.max(0, products.length - currentItemsPerView)

  if (products.length === 0) return null

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white gold-text-gradient">
          {title}
        </h3>
        
        {products.length > currentItemsPerView && (
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevious}
              disabled={!canGoPrevious}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all duration-300"
              aria-label="Produits précédents"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button
              onClick={goToNext}
              disabled={!canGoNext}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all duration-300"
              aria-label="Produits suivants"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        )}
      </div>

      {/* Products Container */}
      <div 
        ref={scrollContainerRef}
        className="relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="flex transition-transform duration-500 ease-in-out gap-2 sm:gap-0"
          style={{
            transform: `translateX(-${currentIndex * (100 / currentItemsPerView)}%)`,
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 px-1 sm:px-2"
              style={{ 
                width: `calc(${100 / currentItemsPerView}% - 0.5rem)`,
              }}
            >
              <Link
                href={`/products/${product.slug}`}
                className="block card-bg rounded-xl p-3 sm:p-4 hover:shadow-gold-glow transition-all duration-300 group h-full"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-800 rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col space-y-1 z-10">
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

                  {/* Stock Status - Seulement si vraiment en rupture */}
                  {product.inStock === false && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                      <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                        Rupture de stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <h4 className="text-white font-semibold text-sm sm:text-base group-hover:text-brand-gold transition-colors line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
                    {product.name}
                  </h4>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-brand-gold font-bold text-base sm:text-lg">
                      {product.price.toFixed(2)} €
                    </span>
                    <div className="flex items-center space-x-1">
                      <StarRating rating={product.rating} size="sm" />
                      <span className="text-gray-400 text-xs">
                        ({product.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      {products.length > currentItemsPerView && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ 
            length: Math.ceil(products.length / currentItemsPerView) 
          }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * currentItemsPerView)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                Math.floor(currentIndex / currentItemsPerView) === index
                  ? 'bg-brand-gold scale-125' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Aller à la page ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Mobile Navigation */}
      <div className="flex justify-center mt-4 sm:hidden">
        <div className="flex space-x-2">
          <button
            onClick={goToPrevious}
            disabled={!canGoPrevious}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all duration-300"
            aria-label="Produits précédents"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
          </button>
          <button
            onClick={goToNext}
            disabled={!canGoNext}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all duration-300"
            aria-label="Produits suivants"
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  )
}
