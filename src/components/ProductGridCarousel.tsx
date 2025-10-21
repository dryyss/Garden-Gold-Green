'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { ProductCard } from '@/components/ProductCard'

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
  category?: string
  cbdPercent?: number
}

interface ProductGridCarouselProps {
  products: Product[]
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

  const goToPrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1))
  }

  const goToNext = () => {
    const maxIndex = Math.max(0, products.length - itemsPerView.desktop)
    setCurrentIndex(Math.min(maxIndex, currentIndex + 1))
  }

  const canGoPrevious = currentIndex > 0
  const canGoNext = currentIndex < Math.max(0, products.length - itemsPerView.desktop)

  if (products.length === 0) return null

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white gold-text-gradient">
            {title}
          </h3>
          
          {showNavigation && products.length > itemsPerView.desktop && (
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
            transform: `translateX(-${currentIndex * (100 / itemsPerView.desktop)}%)`,
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 px-2"
              style={{ width: `${100 / itemsPerView.desktop}%` }}
            >
              <div className="h-full">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      {showDots && products.length > itemsPerView.desktop && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ 
            length: Math.ceil(products.length / itemsPerView.desktop) 
          }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === Math.floor(currentIndex / itemsPerView.desktop)
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
