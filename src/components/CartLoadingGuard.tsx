'use client'

import { useCart } from '@/contexts/CartContext'
import { LoadingSpinner } from './LoadingSpinner'

interface CartLoadingGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function CartLoadingGuard({ children, fallback }: CartLoadingGuardProps) {
  const { isHydrated } = useCart()

  if (!isHydrated) {
    return (
      fallback || (
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner />
          <span className="ml-2 text-gray-600">Chargement du panier...</span>
        </div>
      )
    )
  }

  return <>{children}</>
}
