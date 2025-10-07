'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faEnvelope, 
  faCheckCircle, 
  faSpinner,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'

interface NewsletterProps {
  className?: string
  variant?: 'default' | 'compact' | 'hero'
}

export function Newsletter({ className = '', variant = 'default' }: NewsletterProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setStatus('error')
      setMessage('Veuillez entrer votre adresse email')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      // Simulation d'envoi à l'API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simuler une réponse aléatoire (succès ou erreur)
      const isSuccess = Math.random() > 0.2 // 80% de chance de succès
      
      if (isSuccess) {
        setStatus('success')
        setMessage('Merci ! Vous êtes maintenant abonné à notre newsletter.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage('Une erreur est survenue. Veuillez réessayer.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Une erreur est survenue. Veuillez réessayer.')
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          container: 'p-4',
          title: 'text-lg',
          description: 'text-sm',
          input: 'py-2 px-4 text-sm',
          button: 'py-2 px-4 text-sm'
        }
      case 'hero':
        return {
          container: 'p-12',
          title: 'text-4xl',
          description: 'text-lg',
          input: 'py-4 px-6 text-lg',
          button: 'py-4 px-8 text-lg'
        }
      default:
        return {
          container: 'p-8',
          title: 'text-2xl',
          description: 'text-base',
          input: 'py-3 px-4',
          button: 'py-3 px-6'
        }
    }
  }

  const styles = getVariantStyles()

  if (status === 'success') {
    return (
      <div className={`card-bg rounded-xl text-center border border-brand-gold/20 ${styles.container} ${className}`}>
        <div className="w-16 h-16 rounded-full bg-brand-green/20 flex items-center justify-center mx-auto mb-4 border border-brand-green">
          <FontAwesomeIcon icon={faCheckCircle} className="text-brand-green text-2xl" />
        </div>
        <h3 className={`font-bold text-white mb-2 ${styles.title}`}>
          Inscription réussie !
        </h3>
        <p className="text-gray-300 mb-4">
          {message}
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-brand-gold hover:text-brand-gold/80 font-semibold"
        >
          S'abonner à nouveau
        </button>
      </div>
    )
  }

  return (
    <div className={`card-bg rounded-xl border border-brand-gold/20 ${styles.container} ${className}`}>
      <div className="text-center mb-6">
        <h3 className={`font-bold text-white mb-2 ${styles.title} gold-text-gradient`}>
          Restez informé
        </h3>
        <p className={`text-gray-300 ${styles.description}`}>
          Recevez nos dernières actualités, conseils d'experts et offres exclusives
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FontAwesomeIcon 
              icon={faEnvelope} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" 
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              className={`w-full pl-10 pr-4 ${styles.input} bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all`}
              disabled={status === 'loading'}
            />
          </div>
          
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`btn-gold text-black font-bold rounded-lg shadow-gold-glow whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${styles.button}`}
          >
            {status === 'loading' ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                Inscription...
              </>
            ) : (
              'S\'abonner'
            )}
          </button>
        </div>

        {message && (
          <div className={`flex items-center space-x-2 text-sm ${
            status === 'error' ? 'text-red-400' : 'text-green-400'
          }`}>
            <FontAwesomeIcon 
              icon={status === 'error' ? faExclamationTriangle : faCheckCircle} 
              className="text-xs" 
            />
            <span>{message}</span>
          </div>
        )}

        <p className="text-xs text-gray-400 text-center">
          En vous abonnant, vous acceptez notre{' '}
          <a href="/privacy" className="text-brand-gold hover:underline">
            politique de confidentialité
          </a>
          . Vous pouvez vous désabonner à tout moment.
        </p>
      </form>
    </div>
  )
}
