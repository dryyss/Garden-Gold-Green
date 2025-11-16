'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface LogoLoadingProps {
  onLoadingComplete?: () => void
  duration?: number // Durée de la transition en millisecondes
  showText?: boolean
  className?: string
}

export function LogoLoading({ 
  onLoadingComplete, 
  duration = 2500,
  showText = true,
  className = '' 
}: LogoLoadingProps) {
  const [opacity, setOpacity] = useState(0)
  const [colorOpacity, setColorOpacity] = useState(0)
  const [scale, setScale] = useState(0.8)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Animation d'entrée - Logo noir et blanc apparaît
    setTimeout(() => {
      setOpacity(1)
      setScale(1)
    }, 100)

    // Début de la transition vers la couleur
    setTimeout(() => {
      setColorOpacity(1)
    }, duration * 0.4)

    // Animation de sortie
    setTimeout(() => {
      setIsComplete(true)
      setTimeout(() => {
        onLoadingComplete?.()
      }, 600)
    }, duration)

  }, [duration, onLoadingComplete])

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 ${className}`}
      style={{
        opacity: isComplete ? 0 : 1,
        transition: 'opacity 600ms ease-out'
      }}
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Logo container avec position relative pour superposer les images */}
        <div 
          className="relative w-48 h-48 md:w-64 md:h-64"
          style={{
            opacity,
            transform: `scale(${scale})`,
            transition: 'all 800ms cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          {/* Logo noir et blanc - toujours visible */}
          <Image
            src="/logo%20black%20whit.png"
            alt="Garden Gold Green Loading"
            fill
            sizes="(max-width: 768px) 192px, 256px"
            className="object-contain"
            priority
            unoptimized
          />
          
          {/* Logo en couleur - apparaît progressivement */}
          <Image
            src="/logo.png"
            alt="Garden Gold Green"
            fill
            sizes="(max-width: 768px) 192px, 256px"
            className="object-contain absolute inset-0"
            style={{
              opacity: colorOpacity,
              transition: `opacity ${duration * 0.6}ms ease-in-out`
            }}
            priority
          />
        </div>

        {/* Texte de chargement */}
        {showText && (
          <div className="mt-8 space-y-2">
            <p 
              className="text-white text-xl md:text-2xl font-montserrat font-light tracking-wide text-center"
              style={{
                opacity: opacity,
                transform: `translateY(${opacity === 1 ? 0 : 20}px)`,
                transition: 'all 800ms cubic-bezier(0.34, 1.56, 0.64, 1) 200ms'
              }}
            >
              Garden Gold Green
            </p>
            
            {/* Barre de progression */}
            <div className="w-48 md:w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-400 rounded-full"
                style={{
                  width: `${colorOpacity * 100}%`,
                  transition: `width ${duration * 0.6}ms ease-out`
                }}
              />
            </div>
            
            <p 
              className="text-gray-400 text-sm text-center font-light"
              style={{
                opacity: opacity * 0.7,
                transition: 'opacity 800ms ease-out 400ms'
              }}
            >
              Chargement en cours...
            </p>
          </div>
        )}

        {/* Effet de lueur autour du logo */}
        <div 
          className="absolute inset-0 blur-3xl"
          style={{
            opacity: colorOpacity * 0.3,
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)',
            transition: `opacity ${duration * 0.6}ms ease-out`
          }}
        />
      </div>
    </div>
  )
}

