'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faApplePay, faGooglePay, faPaypal } from '@fortawesome/free-brands-svg-icons'
import { faCreditCard as faCard, faSpinner, faCheck, faWallet } from '@fortawesome/free-solid-svg-icons'
import { useCart } from '@/contexts/CartContext'
import { useNotifications } from '@/contexts/NotificationContext'
import { useTranslation } from '@/contexts/TranslationContext'
import { useAuth } from '@/contexts/AuthContext'
import { useAuth0Context } from '@/contexts/Auth0Context'

export type PaymentMethod = 'stripe' | 'paypal'

interface PaymentMethodSelectorProps {
  className?: string
  onPaymentSuccess?: () => void
  onPaymentError?: (error: string) => void
}

export function PaymentMethodSelector({ 
  className = '', 
  onPaymentSuccess,
  onPaymentError 
}: PaymentMethodSelectorProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const { state } = useCart()
  const { addNotification } = useNotifications()
  const { state: authState } = useAuth()
  const { state: auth0State } = useAuth0Context()
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('stripe')
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Vérifier si l'utilisateur est authentifié (via Auth0 ou AuthContext)
  const isAuthenticated = auth0State.isAuthenticated || authState.isAuthenticated

  const isPayPalEnabled = process.env.NEXT_PUBLIC_STRIPE_ENABLE_PAYPAL === 'true'

  const paymentMethods = [
    {
      id: 'stripe' as PaymentMethod,
      name: t('checkout.creditCard'),
      icon: faCard,
      description: t('checkout.cardTypes'),
      color: 'bg-blue-600',
      textColor: 'text-white'
    },
    ...(isPayPalEnabled
      ? [
          {
            id: 'paypal' as PaymentMethod,
            name: 'PayPal',
            icon: faPaypal,
            description: t('checkout.paypalDescription'),
            color: 'bg-blue-500',
            textColor: 'text-white'
          },
        ]
      : []),
  ]

  const handlePayment = async () => {
    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated) {
      addNotification({
        type: 'error',
        title: 'Connexion requise',
        message: 'Il faut se connecter pour passer au paiement',
      })
      // Rediriger vers la page de connexion Auth0 (/auth/login)
      const baseUrl = window.location.origin
      const returnTo = baseUrl + window.location.pathname
      window.location.href = '/auth/login?returnTo=' + encodeURIComponent(returnTo)
      return
    }

    if (state.items.length === 0) {
      addNotification({
        type: 'error',
        title: 'Panier vide',
        message: 'Ajoutez des produits avant de passer commande',
      })
      return
    }

    setIsProcessing(true)

    try {
      await handleStripeCheckout(selectedMethod)
    } catch (error) {
      console.error('Erreur de paiement:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erreur de paiement'
      addNotification({
        type: 'error',
        title: 'Erreur de paiement',
        message: errorMessage,
      })
      onPaymentError?.(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleStripeCheckout = async (preferredMethod: PaymentMethod) => {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: state.items,
        paymentMethod: preferredMethod
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      
      // Si l'email n'est pas vérifié, rediriger vers la page de vérification
      if (error?.code === 'email_not_verified' && error?.redirectUrl) {
        router.push(error.redirectUrl)
        return
      }
      
      throw new Error(error?.error || 'Erreur lors de la création de la session Stripe')
    }

    const { url } = await response.json()
    window.location.href = url
  }


  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* Sélection de la méthode de paiement */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white mb-4">{t('checkout.selectPaymentMethod')}</h3>
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => setSelectedMethod(method.id)}
            disabled={isProcessing}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
              selectedMethod === method.id
                ? 'border-brand-gold bg-brand-gold/10'
                : 'border-white/20 bg-white/5 hover:border-white/40'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-lg ${method.color} flex items-center justify-center`}>
                <FontAwesomeIcon 
                  icon={method.icon} 
                  className={`text-xl ${method.textColor}`} 
                />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-white">{method.name}</h4>
                <p className="text-sm text-gray-400">{method.description}</p>
              </div>
              {selectedMethod === method.id && (
                <FontAwesomeIcon 
                  icon={faCheck} 
                  className="text-brand-gold text-xl" 
                />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Bouton de paiement */}
      <button
        onClick={handlePayment}
        disabled={isProcessing || state.items.length === 0}
        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
          isProcessing || state.items.length === 0
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'btn-gold text-black shadow-gold-glow hover:shadow-xl'
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-3">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            <span>Traitement en cours...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <FontAwesomeIcon icon={paymentMethods.find(m => m.id === selectedMethod)?.icon || faCard} />
            <span>
              Payer avec {paymentMethods.find(m => m.id === selectedMethod)?.name}
            </span>
          </div>
        )}
      </button>

      {/* Informations de sécurité */}
      <div className="text-center text-sm text-gray-400 space-y-1">
        <p>🔒 Paiement 100% sécurisé et crypté via Stripe Checkout</p>
        <p className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <FontAwesomeIcon icon={faCard} />
          <FontAwesomeIcon icon={faApplePay} />
          <FontAwesomeIcon icon={faGooglePay} />
          {isPayPalEnabled && <FontAwesomeIcon icon={faPaypal} />}
          <FontAwesomeIcon icon={faWallet} />
        </p>
        <p>Apple Pay et Google Pay s’affichent automatiquement si disponibles sur votre appareil.</p>
      </div>
    </div>
  )
}
