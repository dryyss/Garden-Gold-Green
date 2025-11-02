'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { initGA, trackPageView } from '@/lib/analytics'

export function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Initialiser GA au premier chargement
    if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      initGA(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID)
    }
  }, [])

  useEffect(() => {
    // Track chaque changement de page
    if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
      trackPageView(url)
    }
  }, [pathname, searchParams])

  return null
}

