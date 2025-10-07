'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPaypal, 
  faApple, 
  faGoogle,
  faCreditCard
} from '@fortawesome/free-brands-svg-icons'

interface ExpressCheckoutProps {
  onCheckout: (method: string) => void
  disabled?: boolean
}

export function ExpressCheckout({ onCheckout, disabled = false }: ExpressCheckoutProps) {
  const expressMethods = [
    {
      id: 'paypal',
      name: 'PayPal',
      icon: faPaypal,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      id: 'apple',
      name: 'Apple Pay',
      icon: faApple,
      color: 'text-gray-800',
      bgColor: 'bg-gray-800/10',
      borderColor: 'border-gray-800/20'
    },
    {
      id: 'google',
      name: 'Google Pay',
      icon: faGoogle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-600/10',
      borderColor: 'border-blue-600/20'
    }
  ]

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-brand-black text-gray-400">Ou payer avec</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {expressMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => onCheckout(method.id)}
            disabled={disabled}
            className={`flex items-center justify-center p-3 rounded-lg border transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${method.bgColor} ${method.borderColor} hover:border-opacity-40`}
          >
            <FontAwesomeIcon 
              icon={method.icon} 
              className={`text-xl mr-3 ${method.color}`} 
            />
            <span className="font-semibold text-white">{method.name}</span>
          </button>
        ))}
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-400">
          Paiement sécurisé et rapide
        </p>
      </div>
    </div>
  )
}