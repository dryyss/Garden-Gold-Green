'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface CartFlyAnimationProps {
  isActive: boolean
  productImage: string
  productName: string
  onComplete: () => void
}

export function CartFlyAnimation({
  isActive,
  productImage,
  productName,
  onComplete,
}: CartFlyAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isActive) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
        onComplete()
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [isActive, onComplete])

  if (!isAnimating || typeof window === 'undefined' || !window.innerWidth || !window.innerHeight) return null

  // Position fixe pour l'animation (centre de l'écran vers l'icône panier)
  const startPosition = { x: window.innerWidth / 2 - 32, y: window.innerHeight / 2 - 32 }
  const endPosition = { x: window.innerWidth - 100, y: 20 }

  const deltaX = endPosition.x - startPosition.x
  const deltaY = endPosition.y - startPosition.y

  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: `${startPosition.x}px`,
        top: `${startPosition.y}px`,
        animation: 'cart-fly 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        '--fly-x': `${deltaX}px`,
        '--fly-y': `${deltaY}px`,
      } as React.CSSProperties}
    >
      <div className="relative w-16 h-16 rounded-lg overflow-hidden shadow-2xl border-2 border-brand-gold animate-pulse">
        <Image
          src={productImage}
          alt={`${productName} flying to cart`}
          fill
          className="object-cover"
        />
      </div>
    </div>
  )
}

