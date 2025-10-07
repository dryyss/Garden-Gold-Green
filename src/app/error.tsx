'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faExclamationTriangle, 
  faHome, 
  faRefresh,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="bg-brand-black min-h-screen text-gray-300 pt-36 flex items-center justify-center">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Error Icon */}
          <div className="mb-8">
            <FontAwesomeIcon 
              icon={faExclamationTriangle} 
              className="text-6xl text-red-400 mb-4" 
            />
            <h1 className="text-4xl font-bold text-white mb-4">
              Oups ! Une erreur s'est produite
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Nous nous excusons pour la gêne occasionnée. Notre équipe a été notifiée du problème.
            </p>
          </div>

          {/* Error Details */}
          <div className="card-bg rounded-xl p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-white mb-4">Détails de l'erreur :</h2>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <code className="text-red-300 text-sm break-all">
                {error.message}
              </code>
              {error.digest && (
                <p className="text-gray-400 text-xs mt-2">
                  ID de l'erreur : {error.digest}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="btn-gold text-black font-bold py-3 px-8 rounded-full shadow-gold-glow flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faRefresh} className="mr-2" />
              Réessayer
            </button>
            
            <Link
              href="/"
              className="bg-white/10 text-gray-300 hover:bg-white/20 font-bold py-3 px-8 rounded-full transition-colors flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faHome} className="mr-2" />
              Retour à l'accueil
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-12 card-bg rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Besoin d'aide ?</h3>
            <p className="text-gray-400 mb-4">
              Si le problème persiste, n'hésitez pas à nous contacter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="text-brand-gold hover:text-brand-green transition-colors font-medium"
              >
                Contactez le support
              </Link>
              <span className="text-gray-500 hidden sm:block">•</span>
              <Link
                href="/faq"
                className="text-brand-gold hover:text-brand-green transition-colors font-medium"
              >
                Consultez la FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
