'use client'

import { useState, useEffect } from 'react'

export function usePageLoading(minLoadingTime: number = 2500) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simule un temps de chargement minimum
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, minLoadingTime)

    return () => clearTimeout(timer)
  }, [minLoadingTime])

  return { isLoading, setIsLoading }
}

