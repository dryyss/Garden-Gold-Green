'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Charger LogoLoading de manière dynamique pour éviter les problèmes de chunk
const LogoLoading = dynamic(() => import('./LogoLoading').then(mod => ({ default: mod.LogoLoading })), {
  ssr: false,
  loading: () => null
})

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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Vérifier si on est côté client avant d'accéder à sessionStorage
    if (typeof window === 'undefined') {
      return
    }

    // Vérifier si le loading a déjà été affiché dans cette session
    if (showOnce) {
      try {
        const hasShownLoading = sessionStorage.getItem('hasShownLoading')
        if (hasShownLoading === 'true') {
          setShowLoading(false)
          setIsLoading(false)
          return
        }
      } catch (e) {
        // Ignorer les erreurs de sessionStorage (mode privé, etc.)
        console.warn('Erreur sessionStorage:', e)
      }
    }

    // Marquer que le loading a été affiché
    if (showOnce) {
      try {
        sessionStorage.setItem('hasShownLoading', 'true')
      } catch (e) {
        // Ignorer les erreurs de sessionStorage
        console.warn('Erreur sessionStorage:', e)
      }
    }
  }, [showOnce])

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  // Ne rien afficher jusqu'à ce que le composant soit monté côté client
  if (!mounted) {
    return <>{children}</>
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
