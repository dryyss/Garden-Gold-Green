'use client'

import { useState, useEffect, ReactNode } from 'react'
import { InlineLoading } from './LoadingOverlay'

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
    return <InlineLoading message={loadingMessage} className="min-h-screen" />
  }

  return <>{children}</>
}

