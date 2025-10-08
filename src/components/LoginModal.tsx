'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { useAuth0 } from '@/hooks/useAuth0'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToRegister: () => void
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, state } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
    if (state.isAuthenticated) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-brand-black border border-white/10 rounded-lg p-8 w-full max-w-md mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <FontAwesomeIcon icon={faXmark} className="text-xl" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Connexion</h2>
          <p className="text-gray-400">Connectez-vous à votre compte</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-brand-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-brand-gold focus:outline-none transition-colors"
              placeholder="votre@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-brand-gold focus:outline-none transition-colors pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={state.isLoading}
            className="w-full bg-brand-gold text-brand-black font-semibold py-3 rounded-lg hover:bg-brand-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* Switch to register */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Pas de compte ?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-brand-gold hover:text-white transition-colors font-medium"
            >
              S'inscrire
            </button>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-4 p-3 bg-brand-black/30 rounded-lg border border-white/5">
          <p className="text-xs text-gray-400 text-center mb-2">Comptes de démonstration :</p>
          <div className="text-xs text-gray-300 space-y-1">
            <p><strong>Admin:</strong> admin@gardengoldgreen.com</p>
            <p><strong>Client:</strong> client@example.com</p>
            <p className="text-gray-500">(mot de passe quelconque)</p>
          </div>
        </div>
      </div>
    </div>
  )
}