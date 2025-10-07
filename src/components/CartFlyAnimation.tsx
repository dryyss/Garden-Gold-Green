'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

interface CartFlyAnimationProps {
  isActive: boolean
  productImage: string
  productName: string
  onComplete?: () => void
}

export function CartFlyAnimation({ 
  isActive, 
  productImage, 
  productName, 
  onComplete 
}: CartFlyAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [opacity, setOpacity] = useState(1)
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!isActive) return

    setIsVisible(true)
    setPosition({ x: 0, y: 0 })
    setScale(1)
    setOpacity(1)

    // Calculer la position de destination (icône panier)
    const cartIcon = document.querySelector('[data-cart-icon]') as HTMLElement
    const startElement = document.querySelector('[data-add-to-cart]') as HTMLElement
    
    if (!cartIcon || !startElement) {
      onComplete?.()
      return
    }

    const startRect = startElement.getBoundingClientRect()
    const endRect = cartIcon.getBoundingClientRect()
    
    const startX = startRect.left + startRect.width / 2
    const startY = startRect.top + startRect.height / 2
    const endX = endRect.left + endRect.width / 2
    const endY = endRect.top + endRect.height / 2

    setPosition({ x: startX, y: startY })

    // Animation
    let progress = 0
    const duration = 800 // ms
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      progress = Math.min(elapsed / duration, 1)

      // Courbe d'animation (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      // Position
      const currentX = startX + (endX - startX) * easeOut
      const currentY = startY + (endY - startY) * easeOut
      
      // Ajouter un arc de parabole
      const arcHeight = 100
      const arcY = currentY - (arcHeight * Math.sin(progress * Math.PI))
      
      setPosition({ x: currentX, y: arcY })
      
      // Scale et opacity
      setScale(1 - progress * 0.3)
      setOpacity(1 - progress * 0.5)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setIsVisible(false)
        onComplete?.()
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, onComplete])

  if (!isVisible) return null

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        opacity,
        scale
      }}
    >
      <div className="relative">
        <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center shadow-lg">
          <Image
            src={productImage}
            alt={productName}
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        </div>
        
        {/* Traînée de particules */}
        <div className="absolute inset-0 animate-ping">
          <div className="w-12 h-12 bg-brand-gold/30 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

interface CartFlyAnimationProps {
  isActive: boolean
  productImage: string
  productName: string
  onComplete?: () => void
}

export function CartFlyAnimation({ 
  isActive, 
  productImage, 
  productName, 
  onComplete 
}: CartFlyAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [opacity, setOpacity] = useState(1)
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!isActive) return

    setIsVisible(true)
    setPosition({ x: 0, y: 0 })
    setScale(1)
    setOpacity(1)

    // Calculer la position de destination (icône panier)
    const cartIcon = document.querySelector('[data-cart-icon]') as HTMLElement
    const startElement = document.querySelector('[data-add-to-cart]') as HTMLElement
    
    if (!cartIcon || !startElement) {
      onComplete?.()
      return
    }

    const startRect = startElement.getBoundingClientRect()
    const endRect = cartIcon.getBoundingClientRect()
    
    const startX = startRect.left + startRect.width / 2
    const startY = startRect.top + startRect.height / 2
    const endX = endRect.left + endRect.width / 2
    const endY = endRect.top + endRect.height / 2

    setPosition({ x: startX, y: startY })

    // Animation
    let progress = 0
    const duration = 800 // ms
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      progress = Math.min(elapsed / duration, 1)

      // Courbe d'animation (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      // Position
      const currentX = startX + (endX - startX) * easeOut
      const currentY = startY + (endY - startY) * easeOut
      
      // Ajouter un arc de parabole
      const arcHeight = 100
      const arcY = currentY - (arcHeight * Math.sin(progress * Math.PI))
      
      setPosition({ x: currentX, y: arcY })
      
      // Scale et opacity
      setScale(1 - progress * 0.3)
      setOpacity(1 - progress * 0.5)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setIsVisible(false)
        onComplete?.()
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, onComplete])

  if (!isVisible) return null

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        opacity,
        scale
      }}
    >
      <div className="relative">
        <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center shadow-lg">
          <Image
            src={productImage}
            alt={productName}
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        </div>
        
        {/* Traînée de particules */}
        <div className="absolute inset-0 animate-ping">
          <div className="w-12 h-12 bg-brand-gold/30 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
