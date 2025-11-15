"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faSpinner, faCheckCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useAuth0Context } from '@/contexts/Auth0Context'

export default function VerifyEmailPage() {
  const router = useRouter()
  const { state: auth0State } = useAuth0Context()
  const [isChecking, setIsChecking] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    const checkEmailVerification = async () => {
      try {
        if (!auth0State.isAuthenticated || !auth0State.user?.id) {
          // Si l'utilisateur n'est pas connecté, rediriger vers la page d'authentification
          router.push('/auth')
          return
        }

        // Appeler l'API pour vérifier le statut de l'email
        const response = await fetch('/api/auth/check-email-verification')
        
        if (!response.ok) {
          throw new Error('Erreur lors de la vérification de l\'email')
        }

        const data = await response.json()
        const emailVerified = Boolean(data.emailVerified ?? false)
        const userEmail = data.email || auth0State.user.email || null

        setEmail(userEmail)
        setIsVerified(emailVerified)
        setIsChecking(false)

        if (emailVerified) {
          // Si l'email est déjà vérifié, rediriger vers le panier après 2 secondes
          setTimeout(() => {
            router.push('/cart')
          }, 2000)
        }
      } catch (error) {
        console.error('❌ Erreur lors de la vérification de l\'email:', error)
        setIsChecking(false)
      }
    }

    checkEmailVerification()
  }, [auth0State.user, router])

  const handleResendVerification = async () => {
    try {
      setIsResending(true)
      setResendStatus(null)

      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setResendStatus({
          type: 'success',
          message: 'Email de vérification envoyé avec succès ! Vérifiez votre boîte de réception.'
        })
      } else {
        setResendStatus({
          type: 'error',
          message: data.error || 'Erreur lors de l\'envoi de l\'email de vérification'
        })
      }
    } catch (error) {
      console.error('❌ Erreur lors du renvoi de l\'email:', error)
      setResendStatus({
        type: 'error',
        message: 'Une erreur est survenue. Veuillez réessayer plus tard.'
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-black text-white pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="card-bg rounded-2xl p-8 sm:p-12">
          {isChecking ? (
            <div className="text-center">
              <FontAwesomeIcon 
                icon={faSpinner} 
                className="animate-spin text-4xl sm:text-6xl text-brand-gold mb-4 sm:mb-6" 
              />
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
                Vérification en cours...
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                Vérification du statut de votre adresse email
              </p>
            </div>
          ) : isVerified ? (
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <FontAwesomeIcon 
                  icon={faCheckCircle} 
                  className="text-4xl sm:text-5xl text-green-400" 
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
                Email vérifié !
              </h1>
              <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
                Votre adresse email a été vérifiée avec succès.
              </p>
              <p className="text-gray-500 text-xs sm:text-sm mb-6 sm:mb-8">
                Redirection vers votre panier...
              </p>
              <Link
                href="/cart"
                className="btn-gold text-black font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full inline-flex items-center gap-2 text-sm sm:text-base"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Retour au panier
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <FontAwesomeIcon 
                  icon={faEnvelope} 
                  className="text-4xl sm:text-5xl text-yellow-400" 
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
                Vérification de l'email requise
              </h1>
              <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
                Pour finaliser votre commande, vous devez vérifier votre adresse email.
              </p>
              {email && (
                <div className="bg-black/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                  <p className="text-xs sm:text-sm text-gray-400 mb-1">Adresse email à vérifier :</p>
                  <p className="text-white font-semibold text-sm sm:text-base break-all">{email}</p>
                </div>
              )}
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4 text-left">
                  <p className="text-xs sm:text-sm text-blue-300 mb-2 font-semibold">
                    📧 Instructions :
                  </p>
                  <ol className="text-xs sm:text-sm text-gray-300 space-y-1.5 sm:space-y-2 list-decimal list-inside">
                    <li>Vérifiez votre boîte de réception (et vos spams)</li>
                    <li>Cliquez sur le lien de vérification dans l'email</li>
                    <li>Revenez sur cette page pour continuer votre commande</li>
                  </ol>
                </div>
                {resendStatus && (
                  <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg ${
                    resendStatus.type === 'success' 
                      ? 'bg-green-500/10 border border-green-500/30 text-green-300' 
                      : 'bg-red-500/10 border border-red-500/30 text-red-300'
                  }`}>
                    <p className="text-xs sm:text-sm">{resendStatus.message}</p>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <button
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="btn-gold text-black font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isResending ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Renvoyer l'email de vérification</span>
                        <span className="sm:hidden">Renvoyer l'email</span>
                      </>
                    )}
                  </button>
                  <Link
                    href="/cart"
                    className="border-2 border-white/20 text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Retour au panier
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

