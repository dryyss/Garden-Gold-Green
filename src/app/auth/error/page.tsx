'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faExclamationTriangle,
  faHome,
  faArrowLeft,
  faSignInAlt,
} from '@fortawesome/free-solid-svg-icons'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()

  const statusCode =
    searchParams.get('status') ||
    searchParams.get('status_code') ||
    searchParams.get('code') ||
    '404'

  const errorCode =
    searchParams.get('error') ||
    searchParams.get('error_code') ||
    undefined

  const errorDescription =
    searchParams.get('error_description') ||
    searchParams.get('message') ||
    searchParams.get('description') ||
    undefined

  return (
    <main className="bg-brand-black min-h-screen flex items-center justify-center py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <Image
              className="h-16 w-16 mr-4"
              src="/logo2.png"
              alt="Garden Gold Green logo"
              width={64}
              height={64}
            />
            <div>
              <h1 className="text-3xl font-bold text-white">
                GARDEN GOLD GREEN
              </h1>
              <p className="text-gray-400 text-sm">Premium CBD Collection</p>
            </div>
          </div>

          {/* Error Content */}
          <div className="card-bg rounded-2xl p-10 shadow-2xl mb-8">
            <div className="mb-8">
              <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="text-red-400 text-3xl"
                />
              </div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-2">
                Erreur d&apos;authentification
              </p>
              <h2 className="text-5xl font-extrabold text-white mb-2">
                {statusCode}
              </h2>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Connexion impossible avec Auth0
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Une erreur s&apos;est produite lors de la tentative de connexion
                ou de retour depuis le fournisseur d&apos;identité (Auth0).
                Cette page est affichée lorsqu&apos;Auth0 ne parvient pas à
                finaliser le processus de connexion ou que l&apos;URL demandée
                est introuvable.
              </p>
            </div>

            {/* Technical details from query string */}
            {(errorCode || errorDescription) && (
              <div className="bg-black/30 border border-red-500/30 rounded-xl p-5 text-left mb-8">
                <h4 className="text-sm font-semibold text-red-300 mb-3">
                  Détails techniques (pour le support) :
                </h4>
                {errorCode && (
                  <p className="text-xs text-gray-300 mb-1">
                    <span className="font-semibold">Code :</span>{' '}
                    <code className="text-red-200 break-all">{errorCode}</code>
                  </p>
                )}
                {errorDescription && (
                  <p className="text-xs text-gray-300">
                    <span className="font-semibold">Description :</span>{' '}
                    <code className="text-red-200 break-all">
                      {errorDescription}
                    </code>
                  </p>
                )}
                <p className="text-[11px] text-gray-500 mt-3">
                  Vous pouvez transmettre ces informations à notre équipe de
                  support si le problème persiste.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth"
                className="btn-gold text-black font-bold py-3 px-8 rounded-full shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faSignInAlt} />
                Réessayer la connexion
              </Link>

              <Link
                href="/"
                className="bg-white/10 text-white font-semibold py-3 px-8 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faHome} />
                Retour à l&apos;accueil
              </Link>

              <button
                type="button"
                onClick={() => window.history.back()}
                className="bg-transparent text-gray-300 font-semibold py-3 px-8 rounded-full border border-white/10 hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Page précédente
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/faq"
              className="card-bg rounded-xl p-5 hover:bg-white/5 transition-all duration-300 text-left group"
            >
              <h4 className="text-white font-semibold mb-2 group-hover:text-brand-gold">
                Besoin d&apos;aide ?
              </h4>
              <p className="text-gray-400 text-sm mb-2">
                Consultez la FAQ pour trouver des réponses aux problèmes de
                connexion les plus fréquents.
              </p>
              <span className="text-brand-gold text-xs font-medium">
                Consulter la FAQ
              </span>
            </Link>

            <Link
              href="/contact"
              className="card-bg rounded-xl p-5 hover:bg-white/5 transition-all duration-300 text-left group"
            >
              <h4 className="text-white font-semibold mb-2 group-hover:text-brand-gold">
                Contacter le support
              </h4>
              <p className="text-gray-400 text-sm mb-2">
                Si le problème persiste, contactez notre équipe en joignant les
                détails techniques ci-dessus.
              </p>
              <span className="text-brand-gold text-xs font-medium">
                Contacter le support
              </span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}



