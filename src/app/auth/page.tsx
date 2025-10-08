'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUser, 
  faArrowLeft,
  faCheckCircle,
  faApple,
  faGoogle,
  faFacebook
} from '@fortawesome/free-brands-svg-icons'
import Image from 'next/image'

export default function AuthPage() {
  const router = useRouter()
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const handleAuth0Login = () => {
    setIsLoading(true)
    // Redirection vers Auth0
    window.location.href = '/api/auth/login'
  }

  const handleAuth0Register = () => {
    setIsLoading(true)
    // Redirection vers Auth0 pour l'inscription (même route avec prompt=signup)
    window.location.href = '/api/auth/login?prompt=signup'
  }

  const handleAppleLogin = () => {
    setIsLoading(true)
    // Redirection vers Apple Sign In
    window.location.href = '/api/auth/apple'
  }

  const handleGoogleLogin = () => {
    setIsLoading(true)
    // Redirection vers Google Sign In
    window.location.href = '/api/auth/google'
  }

  const handleFacebookLogin = () => {
    setIsLoading(true)
    // Redirection vers Facebook Login
    window.location.href = '/api/auth/facebook'
  }

  return (
    <main className="bg-brand-black min-h-screen flex items-center justify-center py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <Image
                className="h-16 w-16 mr-4"
                src="/logo.png"
                alt="Garden Gold Green logo"
                width={64}
                height={64}
              />
              <div>
                <h1 className="text-3xl font-bold text-white">GARDEN GOLD GREEN</h1>
                <p className="text-gray-400 text-sm">Premium CBD Collection</p>
              </div>
            </div>
            
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-gray-400 hover:text-brand-gold transition-colors mb-6"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Retour
            </button>
          </div>

          {/* Auth Card */}
          <div className="card-bg rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isLoginMode ? 'Connexion' : 'Créer un compte'}
              </h2>
              <p className="text-gray-400">
                {isLoginMode 
                  ? 'Connectez-vous à votre compte' 
                  : 'Rejoignez notre communauté premium'
                }
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-4 mb-8">
              {/* Apple */}
              <button
                onClick={handleAppleLogin}
                disabled={isLoading}
                className="w-full bg-black text-white font-bold py-4 px-6 rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3 border border-gray-600"
              >
                <FontAwesomeIcon icon={faApple} className="text-xl" />
                {isLoginMode ? 'Continuer avec Apple' : 'S\'inscrire avec Apple'}
              </button>

              {/* Google */}
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-white text-gray-800 font-bold py-4 px-6 rounded-xl hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-3 border border-gray-300"
              >
                <FontAwesomeIcon icon={faGoogle} className="text-xl text-red-500" />
                {isLoginMode ? 'Continuer avec Google' : 'S\'inscrire avec Google'}
              </button>

              {/* Facebook */}
              <button
                onClick={handleFacebookLogin}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <FontAwesomeIcon icon={faFacebook} className="text-xl" />
                {isLoginMode ? 'Continuer avec Facebook' : 'S\'inscrire avec Facebook'}
              </button>

              {/* Auth0 */}
              <button
                onClick={isLoginMode ? handleAuth0Login : handleAuth0Register}
                disabled={isLoading}
                className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 ${
                  isLoading
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-brand-gold text-black hover:shadow-gold-glow hover:shadow-gold-glow-lg'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="spinner"></div>
                    {isLoginMode ? 'Connexion...' : 'Création du compte...'}
                  </div>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUser} className="text-lg" />
                    {isLoginMode ? 'Se connecter avec Auth0' : 'Créer un compte avec Auth0'}
                  </>
                )}
              </button>
            </div>

            {/* Switch Mode */}
            <div className="text-center mt-6">
              <p className="text-gray-400">
                {isLoginMode ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
              </p>
              <button
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-brand-gold hover:text-yellow-300 font-semibold transition-colors"
              >
                {isLoginMode ? 'Créer un compte' : 'Se connecter'}
              </button>
            </div>

            {/* Features */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-300">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-brand-green mr-3" />
                  <span>Accès à votre historique de commandes</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-brand-green mr-3" />
                  <span>Suivi de vos colis en temps réel</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-brand-green mr-3" />
                  <span>Offres exclusives et réductions</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-brand-green mr-3" />
                  <span>Support client prioritaire</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Notice */}
          <div className="text-center mt-8">
            <p className="text-xs text-gray-500">
              En continuant, vous acceptez nos{' '}
              <a href="/terms" className="text-brand-gold hover:text-yellow-300">
                Conditions d'utilisation
              </a>{' '}
              et notre{' '}
              <a href="/privacy" className="text-brand-gold hover:text-yellow-300">
                Politique de confidentialité
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
