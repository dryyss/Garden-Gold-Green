'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPaypal
} from '@fortawesome/free-brands-svg-icons'
import { faCreditCard as faCard, faSpinner, faCheck } from '@fortawesome/free-solid-svg-icons'
import { useCart } from '@/contexts/CartContext'
import { useNotifications } from '@/contexts/NotificationContext'

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
  const { state } = useCart()
  const { addNotification } = useNotifications()
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('stripe')
  const [isProcessing, setIsProcessing] = useState(false)

  const paymentMethods = [
    {
      id: 'stripe' as PaymentMethod,
      name: 'Carte bancaire',
      icon: faCard,
      description: 'Visa, Mastercard, American Express',
      color: 'bg-blue-600',
      textColor: 'text-white'
    },
    {
      id: 'paypal' as PaymentMethod,
      name: 'PayPal',
      icon: faPaypal,
      description: 'Paiement sécurisé PayPal',
      color: 'bg-blue-500',
      textColor: 'text-white'
    }
  ]

  const handlePayment = async () => {
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
      switch (selectedMethod) {
        case 'stripe':
          await handleStripePayment()
          break
        case 'paypal':
          await handlePayPalPayment()
          break
        default:
          throw new Error('Méthode de paiement non supportée')
      }
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

  const handleStripePayment = async () => {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: state.items,
        paymentMethod: 'stripe'
      }),
    })

    if (!response.ok) {
      throw new Error('Erreur lors de la création de la session Stripe')
    }

    const { url } = await response.json()
    window.location.href = url
  }

  const handlePayPalPayment = async () => {
    const response = await fetch('/api/paypal/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: state.items,
        paymentMethod: 'paypal'
      }),
    })

    if (!response.ok) {
      throw new Error('Erreur lors de la création de la commande PayPal')
    }

    const { approvalUrl } = await response.json()
    window.location.href = approvalUrl
  }


  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* Sélection de la méthode de paiement */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white mb-4">Choisissez votre méthode de paiement</h3>
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
      <div className="text-center text-sm text-gray-400">
        <p>🔒 Paiement 100% sécurisé et crypté</p>
        <p>Vos données sont protégées par un chiffrement SSL</p>
      </div>
    </div>
  )
}
