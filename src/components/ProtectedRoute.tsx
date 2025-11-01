'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useAuth0Context } from '@/contexts/Auth0Context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ children, redirectTo = '/auth' }: ProtectedRouteProps) {
  const { state: authState } = useAuth()
  const { state: auth0State } = useAuth0Context()
  const router = useRouter()
  
  const state = auth0State.user ? auth0State : authState

  useEffect(() => {
    if (!state.isLoading && !state.isAuthenticated) {
      router.push(redirectTo)
    }
  }, [state.isAuthenticated, state.isLoading, router, redirectTo])

  if (state.isLoading) {
    return (
      <div className="bg-brand-black min-h-screen text-gray-300 pt-24 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-brand-gold mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Chargement...</h1>
          <p className="text-gray-400">Vérification de votre authentification</p>
        </div>
      </div>
    )
  }

  if (!state.isAuthenticated) {
    return (
      <div className="bg-brand-black min-h-screen text-gray-300 pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Accès non autorisé</h1>
          <p className="text-gray-400 mb-6">Vous devez être connecté pour accéder à cette page.</p>
          <button
            onClick={() => router.push('/auth')}
            className="btn-gold text-black font-bold py-3 px-8 rounded-full shadow-gold-glow"
          >
            Se connecter
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
