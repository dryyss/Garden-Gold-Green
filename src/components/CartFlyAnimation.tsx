'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface CartFlyAnimationProps {
  productImage: string
  startPosition: { x: number; y: number }
  endPosition: { x: number; y: number }
  onComplete: () => void
}

export function CartFlyAnimation({
  productImage,
  startPosition,
  endPosition,
  onComplete,
}: CartFlyAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false)
      onComplete()
    }, 800)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isAnimating) return null

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
          alt="Product flying to cart"
          fill
          className="object-cover"
        />
      </div>
    </div>
  )
}

