'use client'

import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faSpinner } from '@fortawesome/free-solid-svg-icons'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripePaymentProps {
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  customerEmail: string
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
}

function CheckoutForm({ items, customerEmail, onSuccess, onError }: StripePaymentProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!stripe) {
      return
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    )

    if (!clientSecret) {
      return
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case 'succeeded':
          setMessage('Payment succeeded!')
          break
        case 'processing':
          setMessage('Your payment is processing.')
          break
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.')
          break
        default:
          setMessage('Something went wrong.')
          break
      }
    })
  }, [stripe])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customerEmail,
        }),
      })

      const { clientSecret, error: apiError } = await response.json()

      if (apiError) {
        throw new Error(apiError)
      }

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      })

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setMessage(error.message || 'An error occurred.')
        } else {
          setMessage('An unexpected error occurred.')
        }
        onError(error.message || 'Payment failed')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setMessage('Payment succeeded!')
        onSuccess(paymentIntent.id)
      }
    } catch (error) {
      console.error('Payment error:', error)
      setMessage('An error occurred while processing your payment.')
      onError(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement 
        options={{
          layout: 'tabs',
        }}
        className="mb-6"
      />
      
      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('succeeded') 
            ? 'bg-green-900/20 text-green-400 border border-green-800/30' 
            : 'bg-red-900/20 text-red-400 border border-red-800/30'
        }`}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || isLoading}
        className={`w-full py-4 px-6 rounded-full font-bold text-lg transition-all duration-300 ${
          !stripe || !elements || isLoading
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'btn-gold text-black shadow-gold-glow hover:shadow-xl'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            Processing Payment...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faLock} />
            Complete Payment
          </div>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
        <FontAwesomeIcon icon={faLock} />
        <span>Secured by Stripe</span>
      </div>
    </form>
  )
}

export function StripePayment({ items, customerEmail, onSuccess, onError }: StripePaymentProps) {
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items,
            customerEmail,
          }),
        })

        const { clientSecret: secret, error } = await response.json()

        if (error) {
          throw new Error(error)
        }

        setClientSecret(secret)
      } catch (error) {
        console.error('Error creating payment intent:', error)
        onError(error instanceof Error ? error.message : 'Failed to initialize payment')
      }
    }

    createPaymentIntent()
  }, [items, customerEmail, onSuccess, onError])

  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#FFD700',
      colorBackground: '#0A0A0A',
      colorText: '#FFFFFF',
      colorDanger: '#FF6B6B',
      fontFamily: 'Poppins, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
    rules: {
      '.Input': {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#FFFFFF',
      },
      '.Input:focus': {
        borderColor: '#FFD700',
        boxShadow: '0 0 0 2px rgba(255, 215, 0, 0.3)',
      },
      '.Label': {
        color: '#E0E0E0',
        fontWeight: '500',
      },
    },
  }

  const options = {
    clientSecret,
    appearance,
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-brand-gold mb-4" />
          <p className="text-gray-400">Initializing payment...</p>
        </div>
      </div>
    )
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm
        items={items}
        customerEmail={customerEmail}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  )
}

import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faSpinner } from '@fortawesome/free-solid-svg-icons'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripePaymentProps {
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  customerEmail: string
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
}

function CheckoutForm({ items, customerEmail, onSuccess, onError }: StripePaymentProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!stripe) {
      return
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    )

    if (!clientSecret) {
      return
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case 'succeeded':
          setMessage('Payment succeeded!')
          break
        case 'processing':
          setMessage('Your payment is processing.')
          break
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.')
          break
        default:
          setMessage('Something went wrong.')
          break
      }
    })
  }, [stripe])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customerEmail,
        }),
      })

      const { clientSecret, error: apiError } = await response.json()

      if (apiError) {
        throw new Error(apiError)
      }

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      })

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setMessage(error.message || 'An error occurred.')
        } else {
          setMessage('An unexpected error occurred.')
        }
        onError(error.message || 'Payment failed')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setMessage('Payment succeeded!')
        onSuccess(paymentIntent.id)
      }
    } catch (error) {
      console.error('Payment error:', error)
      setMessage('An error occurred while processing your payment.')
      onError(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement 
        options={{
          layout: 'tabs',
        }}
        className="mb-6"
      />
      
      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('succeeded') 
            ? 'bg-green-900/20 text-green-400 border border-green-800/30' 
            : 'bg-red-900/20 text-red-400 border border-red-800/30'
        }`}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || isLoading}
        className={`w-full py-4 px-6 rounded-full font-bold text-lg transition-all duration-300 ${
          !stripe || !elements || isLoading
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'btn-gold text-black shadow-gold-glow hover:shadow-xl'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            Processing Payment...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faLock} />
            Complete Payment
          </div>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
        <FontAwesomeIcon icon={faLock} />
        <span>Secured by Stripe</span>
      </div>
    </form>
  )
}

export function StripePayment({ items, customerEmail, onSuccess, onError }: StripePaymentProps) {
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items,
            customerEmail,
          }),
        })

        const { clientSecret: secret, error } = await response.json()

        if (error) {
          throw new Error(error)
        }

        setClientSecret(secret)
      } catch (error) {
        console.error('Error creating payment intent:', error)
        onError(error instanceof Error ? error.message : 'Failed to initialize payment')
      }
    }

    createPaymentIntent()
  }, [items, customerEmail, onSuccess, onError])

  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#FFD700',
      colorBackground: '#0A0A0A',
      colorText: '#FFFFFF',
      colorDanger: '#FF6B6B',
      fontFamily: 'Poppins, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
    rules: {
      '.Input': {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#FFFFFF',
      },
      '.Input:focus': {
        borderColor: '#FFD700',
        boxShadow: '0 0 0 2px rgba(255, 215, 0, 0.3)',
      },
      '.Label': {
        color: '#E0E0E0',
        fontWeight: '500',
      },
    },
  }

  const options = {
    clientSecret,
    appearance,
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-brand-gold mb-4" />
          <p className="text-gray-400">Initializing payment...</p>
        </div>
      </div>
    )
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm
        items={items}
        customerEmail={customerEmail}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  )
}
