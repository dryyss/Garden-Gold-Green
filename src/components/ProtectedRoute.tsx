'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth0 } from '@/hooks/useAuth0'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ children, redirectTo = '/' }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth0()
  const router = useRouter()

  useEffect(() => {
    if (!authState.isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, authState.isLoading, router, redirectTo])

  if (authState.isLoading) {
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

  if (!isAuthenticated) {
    return (
      <div className="bg-brand-black min-h-screen text-gray-300 pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Accès non autorisé</h1>
          <p className="text-gray-400 mb-6">Vous devez être connecté pour accéder à cette page.</p>
          <button
            onClick={() => router.push('/')}
            className="btn-gold text-black font-bold py-3 px-8 rounded-full shadow-gold-glow"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
