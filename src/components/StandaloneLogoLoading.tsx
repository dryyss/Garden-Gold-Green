'use client'

import { LogoLoading } from './LogoLoading'

interface StandaloneLogoLoadingProps {
  isLoading: boolean
  onComplete?: () => void
  duration?: number
}

/**
 * Version standalone du LogoLoading qui peut être utilisée pour des sections spécifiques
 * Exemple: afficher pendant qu'on charge des données dans une page
 */
export function StandaloneLogoLoading({ 
  isLoading, 
  onComplete,
  duration = 2000 
}: StandaloneLogoLoadingProps) {
  if (!isLoading) return null

  return (
    <LogoLoading 
      onLoadingComplete={onComplete}
      duration={duration}
      showText={true}
    />
  )
}

/**
 * Version mini du loading logo pour des sections plus petites
 */
export function MiniLogoLoading({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative w-16 h-16 animate-pulse">
        <img
          src="/logo.png"
          alt="Chargement..."
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
      </div>
    </div>
  )
}

