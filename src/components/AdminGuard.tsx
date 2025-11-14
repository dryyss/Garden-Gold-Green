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
  const { state: auth0State, isAdminOrOwner: isAdminOrOwnerAuth0 } = useAuth0Context()
  const router = useRouter()

  const bypassAdminGuard = process.env.NEXT_PUBLIC_FORCE_ADMIN_BYPASS !== 'false'

  const state = auth0State.user ? auth0State : authState
  // Pour Auth0, utiliser isAdminOrOwner pour permettre aux owners d'accéder aussi
  const hasAdminAccess = auth0State.user 
    ? isAdminOrOwnerAuth0() 
    : isAdminAuth()

  // Debug logs
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔐 AdminGuard Debug:', {
        bypassAdminGuard,
        isLoading: state.isLoading,
        isAuthenticated: state.isAuthenticated,
        hasUser: !!state.user,
        userRole: state.user?.backofficeRole,
        userRoles: state.user?.roles,
        hasAdminAccess,
        auth0User: !!auth0State.user,
        authStateUser: !!authState.user,
      })
    }
  }, [bypassAdminGuard, state.isLoading, state.isAuthenticated, state.user?.backofficeRole, hasAdminAccess, auth0State.user, authState.user])

  useEffect(() => {
    if (bypassAdminGuard) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ AdminGuard: Bypass activé')
      }
      return
    }

    // Ne pas rediriger pendant le chargement initial
    if (state.isLoading) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('⏳ AdminGuard: En attente du chargement...')
      }
      return
    }

    if (!state.isAuthenticated) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('❌ AdminGuard: Utilisateur non authentifié, redirection vers /')
      }
      router.push('/')
      return
    }

    if (!hasAdminAccess) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('❌ AdminGuard: Accès refusé - pas admin/owner, redirection vers /')
        console.log('   Détails:', {
          userRole: state.user?.backofficeRole,
          userRoles: state.user?.roles,
          isAdminOrOwnerResult: auth0State.user ? isAdminOrOwnerAuth0() : isAdminAuth(),
        })
      }
      router.push('/')
      return
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ AdminGuard: Accès autorisé')
    }
  }, [bypassAdminGuard, state.isAuthenticated, state.isLoading, state.user?.backofficeRole, hasAdminAccess, router, auth0State.user, isAdminOrOwnerAuth0, isAdminAuth])

  if (!bypassAdminGuard && (state.isLoading || !state.isAuthenticated || !hasAdminAccess)) {
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





