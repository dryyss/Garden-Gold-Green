'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripeCheckoutProps {
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  customerEmail?: string
  customerName?: string
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
}

function CheckoutForm({ items, customerEmail, customerName, onSuccess, onError }: StripeCheckoutProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Créer le payment intent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customerEmail,
          customerName,
        }),
      })

      const { clientSecret, error: apiError } = await response.json()

      if (apiError) {
        throw new Error(apiError)
      }

      // Confirmer le paiement
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            email: customerEmail,
            name: customerName,
          },
        },
      })

      if (stripeError) {
        throw new Error(stripeError.message || 'Erreur de paiement')
      }

      if (paymentIntent?.status === 'succeeded') {
        onSuccess(paymentIntent.id)
      }

    } catch (err: any) {
      setError(err.message)
      onError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informations de paiement
        </h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Carte bancaire
          </label>
          <div className="p-4 border border-gray-300 rounded-lg">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || isLoading}
          className={`
            w-full py-3 px-6 rounded-lg font-semibold text-white
            transition-all duration-200 flex items-center justify-center space-x-2
            ${isLoading || !stripe
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-brand-gold hover:bg-yellow-600 shadow-lg hover:shadow-xl'
            }
          `}
        >
          {isLoading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              <span>Traitement en cours...</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faCheck} />
              <span>Payer maintenant</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export function StripeCheckout(props: StripeCheckoutProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  )
}
