 'use client'

 import { useState } from 'react'
 import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
 import { faXmark, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
 import { useAuth } from '@/contexts/AuthContext'

 interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register, state } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas')
      return
    }

    const fullName = `${formData.firstName} ${formData.lastName}`.trim() || formData.email

    await register({
      name: fullName,
      email: formData.email,
      password: formData.password
    })

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
      <div className="relative bg-brand-black border border-white/10 rounded-lg p-8 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <FontAwesomeIcon icon={faXmark} className="text-xl" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Inscription</h2>
          <p className="text-gray-400">Créez votre compte</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-gray-300 text-sm font-medium mb-2">
                Prénom
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-brand-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-brand-gold focus:outline-none transition-colors"
                placeholder="Jean"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-gray-300 text-sm font-medium mb-2">
                Nom
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-brand-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-brand-gold focus:outline-none transition-colors"
                placeholder="Dupont"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-brand-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-brand-gold focus:outline-none transition-colors"
              placeholder="votre@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-gray-300 text-sm font-medium mb-2">
              Téléphone (optionnel)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-brand-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-brand-gold focus:outline-none transition-colors"
              placeholder="+33 6 12 34 56 78"
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
                name="password"
                value={formData.password}
                onChange={handleChange}
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

          <div>
            <label htmlFor="confirmPassword" className="block text-gray-300 text-sm font-medium mb-2">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-brand-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-brand-gold focus:outline-none transition-colors pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={state.isLoading}
            className="w-full bg-brand-gold text-brand-black font-semibold py-3 rounded-lg hover:bg-brand-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.isLoading ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>

        {/* Switch to login */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Déjà un compte ?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-brand-gold hover:text-white transition-colors font-medium"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}