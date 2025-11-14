'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUser, 
  faArrowLeft,
  faCheckCircle,
  faEnvelope,
  faLock
} from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
export default function AuthPage() {
  const router = useRouter()
  const { login, register, state } = useAuth()
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (isLoginMode) {
        await login(formData.email, formData.password)
        router.push('/account')
      } else {
        const fullName = `${formData.firstName} ${formData.lastName}`.trim()
        await register({
            email: formData.email,
            password: formData.password,
          name: fullName,
        })
        router.push('/account')
      }
    } catch (error) {
      console.error('Erreur d\'authentification:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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

            {/* Formulaire de connexion/inscription */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-4 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-xl border border-gray-600 focus:border-brand-gold focus:outline-none transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              {/* Prénom et Nom (inscription uniquement) */}
              {!isLoginMode && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                        Prénom
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-brand-gold focus:outline-none transition-colors"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-brand-gold focus:outline-none transition-colors"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  {/* Téléphone (optionnel) */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                      Téléphone (optionnel)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-brand-gold focus:outline-none transition-colors"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                </>
              )}

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <FontAwesomeIcon icon={faLock} className="absolute left-4 top-4 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-xl border border-gray-600 focus:border-brand-gold focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Message d'erreur */}
              {state.error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-xl">
                  {state.error}
                </div>
              )}

              {/* Bouton de soumission */}
              <button
                type="submit"
                disabled={state.isLoading}
                className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 ${
                  state.isLoading
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-brand-gold text-black hover:shadow-gold-glow hover:shadow-gold-glow-lg'
                }`}
              >
                {state.isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="spinner"></div>
                    {isLoginMode ? 'Connexion...' : 'Création du compte...'}
                  </div>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUser} className="text-lg" />
                    {isLoginMode ? 'Se connecter' : 'Créer un compte'}
                  </>
                )}
              </button>
            </form>

            {/* Switch Mode */}
            <div className="text-center mt-6">
              <p className="text-gray-400">
                {isLoginMode ? 'Vous n&apos;avez pas de compte ?' : 'Vous avez déjà un compte ?'}
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
              <Link href="/terms" className="text-brand-gold hover:text-yellow-300">
                Conditions d&apos;utilisation
              </Link>{' '}
              et notre{' '}
              <Link href="/privacy" className="text-brand-gold hover:text-yellow-300">
                Politique de confidentialité
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
