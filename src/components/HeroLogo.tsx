'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface HeroLogoProps {
  className?: string
}

export function HeroLogo({ className = '' }: HeroLogoProps) {
  const [scrollY, setScrollY] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      
      // Définir le seuil de scroll (par exemple, 100px)
      setIsScrolled(currentScrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`relative transition-all duration-1000 ease-out ${className}`}>
      {/* Logo principal - visible au début */}
      <div 
        className={`transition-all duration-1000 ease-out ${
          isScrolled 
            ? 'opacity-0 scale-75 translate-y-[50px]' 
            : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        <Image
          className="h-80 w-80 md:h-96 md:w-96 lg:h-[28rem] lg:w-[28rem] drop-shadow-2xl" 
          src="/logo.png" 
          alt="3G - Garden Gold Green logo, metallic gold, emerald green, and shiny silver, on a dark background with light reflections"
          width={448}
          height={448}
          priority
        />
      </div>

      {/* Logo en arrière-plan - apparaît lors du scroll */}
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-out ${
          isScrolled 
            ? 'opacity-[0.05] scale-100 translate-y-0' 
            : 'opacity-0 scale-75 translate-y-[-50px]'
        }`}
        style={{
          position: isScrolled ? 'fixed' : 'absolute',
          top: isScrolled ? '50%' : 'auto',
          left: isScrolled ? '50%' : 'auto',
          transform: isScrolled ? 'translate(-50%, -50%)' : 'none',
          zIndex: isScrolled ? 1 : 'auto',
          pointerEvents: 'none'
        }}
      >
        <Image
          className="h-80 w-80 md:h-96 md:w-96 lg:h-[28rem] lg:w-[28rem] drop-shadow-2xl" 
          src="/logo.png" 
          alt="3G - Garden Gold Green logo background"
          width={448}
          height={448}
        />
      </div>
    </div>
  )
}
