'use client'

import { useState, useEffect, ReactNode } from 'react'
import { StandaloneLogoLoading } from './StandaloneLogoLoading'

interface PageWithLoadingProps {
  children: ReactNode
  loadingMessage?: string
  minLoadingTime?: number
  onLoad?: () => Promise<void> | void
}

/**
 * Wrapper pour ajouter facilement un loading à une page
 */
export function PageWithLoading({ 
  children, 
  loadingMessage = 'Chargement de la page...',
  minLoadingTime = 800,
  onLoad
}: PageWithLoadingProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const startTime = Date.now()
      
      // Exécuter la fonction de chargement si fournie
      if (onLoad) {
        await onLoad()
      }
      
      // Assurer un temps minimum de loading
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, minLoadingTime - elapsed)
      
      setTimeout(() => {
        setIsLoading(false)
      }, remaining)
    }

    load()
  }, [minLoadingTime, onLoad])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <StandaloneLogoLoading isLoading={true} />
          <p className="text-gray-300 text-sm">{loadingMessage}</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

