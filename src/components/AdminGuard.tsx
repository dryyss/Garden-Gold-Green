'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useAuth0Context } from '@/contexts/Auth0Context'

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { state: authState, isAdmin: isAdminAuth } = useAuth()
  const { state: auth0State, isAdmin: isAdminAuth0 } = useAuth0Context()
  const router = useRouter()

  const bypassAdminGuard = process.env.NEXT_PUBLIC_FORCE_ADMIN_BYPASS !== 'false'

  const state = auth0State.user ? auth0State : authState
  const isAdmin = auth0State.user ? isAdminAuth0 : isAdminAuth
  const hasAdminAccess = isAdmin()

  useEffect(() => {
    if (bypassAdminGuard) {
      return
    }

    if (!state.isAuthenticated) {
      router.push('/')
      return
    }

    if (!hasAdminAccess) {
      router.push('/')
      return
    }
  }, [bypassAdminGuard, state.isAuthenticated, hasAdminAccess, router])

  if (!bypassAdminGuard && (!state.isAuthenticated || !hasAdminAccess)) {
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





