'use client'

import { useCart } from '@/contexts/CartContext'
import { LoadingSpinner } from './LoadingSpinner'
import { useTranslation } from '@/contexts/TranslationContext'

interface CartLoadingGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function CartLoadingGuard({ children, fallback }: CartLoadingGuardProps) {
  const { t } = useTranslation()
  const { isHydrated } = useCart()

  if (!isHydrated) {
    return (
      fallback || (
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner />
          <span className="ml-2 text-gray-600">{t('cart.loading')}</span>
        </div>
      )
    )
  }

  return <>{children}</>
}


