'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { ProductCard } from '@/components/ProductCard'

// Compatible avec le type Product attendu par ProductCard, mais avec quelques champs optionnels
interface CarouselProduct {
  id: string
  name: string
  price: number
  image: string
  slug: string
  rating: number
  reviewCount: number
  category?: string
  description?: string
  inStock?: boolean
  isNew?: boolean
  isBestSeller?: boolean
  cbdPercent?: number
}

interface ProductGridCarouselProps {
  products: CarouselProduct[]
  title?: string
  className?: string
  itemsPerView?: {
    mobile: number
    tablet: number
    desktop: number
  }
  showNavigation?: boolean
  showDots?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
}

export function ProductGridCarousel({ 
  products, 
  title,
  className = '',
  itemsPerView = { mobile: 1, tablet: 2, desktop: 3 },
  showNavigation = true,
  showDots = true,
  autoPlay = false,
  autoPlayInterval = 4000
}: ProductGridCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [currentItemsPerView, setCurrentItemsPerView] = useState(itemsPerView.mobile)

  // Détecter la taille d'écran et adapter le nombre d'items visibles
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth
      if (width >= 1024) { // lg (desktop)
        setCurrentItemsPerView(itemsPerView.desktop)
      } else if (width >= 640) { // sm (tablet)
        setCurrentItemsPerView(itemsPerView.tablet)
      } else { // mobile
        setCurrentItemsPerView(itemsPerView.mobile)
      }
    }

    updateItemsPerView()
    window.addEventListener('resize', updateItemsPerView)
    return () => window.removeEventListener('resize', updateItemsPerView)
  }, [itemsPerView.desktop, itemsPerView.tablet, itemsPerView.mobile])

  // Réinitialiser l'index quand le nombre d'items change
  useEffect(() => {
    setCurrentIndex(0)
  }, [currentItemsPerView])

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isHovered || products.length <= currentItemsPerView) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = Math.max(0, products.length - currentItemsPerView)
        return prevIndex >= maxIndex ? 0 : prevIndex + 1
      })
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, products.length, currentItemsPerView, isHovered])

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
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white gold-text-gradient">
            {title}
          </h3>
          
          {showNavigation && products.length > currentItemsPerView && (
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
      )}

      {/* Products Container */}
      <div 
        className="relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / currentItemsPerView)}%)`,
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className={`flex-shrink-0 ${currentItemsPerView === 1 ? 'px-0 sm:px-2' : 'px-2'}`}
              style={{ width: `${100 / currentItemsPerView}%` }}
            >
              <div className="h-full">
                <ProductCard 
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    originalPrice: product.price,
                    image: product.image,
                    category: product.category ?? '',
                    description: product.description ?? '',
                    rating: product.rating,
                    reviewCount: product.reviewCount,
                    inStock: product.inStock ?? true,
                    isNew: product.isNew,
                    isBestSeller: product.isBestSeller,
                    slug: product.slug,
                    cbdPercent: product.cbdPercent,
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      {showDots && products.length > currentItemsPerView && (
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
      {showNavigation && (
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
      )}
    </div>
  )
}
