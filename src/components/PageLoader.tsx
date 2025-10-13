'use client'

import { useState, useEffect } from 'react'
import { LogoLoading } from './LogoLoading'

interface PageLoaderProps {
  children: React.ReactNode
  minLoadingTime?: number
  showOnce?: boolean // Afficher le loading une seule fois par session
}

export function PageLoader({ 
  children, 
  minLoadingTime = 2500,
  showOnce = true 
}: PageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    // Vérifier si le loading a déjà été affiché dans cette session
    if (showOnce) {
      const hasShownLoading = sessionStorage.getItem('hasShownLoading')
      if (hasShownLoading === 'true') {
        setShowLoading(false)
        setIsLoading(false)
        return
      }
    }

    // Marquer que le loading a été affiché
    if (showOnce) {
      sessionStorage.setItem('hasShownLoading', 'true')
    }
  }, [showOnce])

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  if (!showLoading || !isLoading) {
    return <>{children}</>
  }

  return (
    <>
      <LogoLoading 
        onLoadingComplete={handleLoadingComplete}
        duration={minLoadingTime}
      />
      <div style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
        {children}
      </div>
    </>
  )
}

