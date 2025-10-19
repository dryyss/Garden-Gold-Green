'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { state, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!state.isAuthenticated) {
      router.push('/')
      return
    }
    
    if (!isAdmin()) {
      router.push('/')
      return
    }
  }, [state.isAuthenticated, isAdmin, router])

  if (!state.isAuthenticated || !isAdmin()) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-gold mx-auto"></div>
          <p className="text-white mt-4">Vérification des permissions...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}





