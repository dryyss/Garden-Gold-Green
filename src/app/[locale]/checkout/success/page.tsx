'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCheckCircle, 
  faEnvelope, 
  faTruck, 
  faHome,
  faShoppingBag,
  faDownload
} from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const { dispatch } = useCart()

  useEffect(() => {
    // Clear cart after successful order
    dispatch({ type: 'CLEAR_CART' })
  }, [dispatch])

  return (
    <main className="bg-brand-black min-h-screen pt-24">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
              <FontAwesomeIcon icon={faCheckCircle} className="text-4xl text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Order Confirmed!</h1>
            <p className="text-xl text-gray-300 mb-2">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
            <p className="text-gray-400">
              Order #GGG-{Date.now().toString().slice(-6)}
            </p>
          </div>

          {/* Order Details */}
          <div className="card-bg rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">What's Next?</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faEnvelope} className="text-brand-gold text-lg" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white mb-2">Confirmation Email</h3>
                  <p className="text-gray-400">
                    We've sent you a confirmation email with your order details and tracking information.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faTruck} className="text-brand-gold text-lg" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white mb-2">Processing & Shipping</h3>
                  <p className="text-gray-400">
                    Your order is being processed and will ship within 1-2 business days. 
                    You'll receive tracking information once it ships.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faDownload} className="text-brand-gold text-lg" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white mb-2">Lab Results</h3>
                  <p className="text-gray-400">
                    Download your product's lab results and certificates of analysis 
                    from your account dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="card-bg rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Estimated Delivery</h3>
            <div className="flex items-center justify-center gap-4 text-gray-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-gold">2-3</div>
                <div className="text-sm">Business Days</div>
              </div>
              <div className="text-gray-500">•</div>
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-gold">Free</div>
                <div className="text-sm">Shipping</div>
              </div>
              <div className="text-gray-500">•</div>
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-gold">30</div>
                <div className="text-sm">Day Return</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders"
              className="btn-gold text-black font-semibold py-3 px-8 rounded-full shadow-gold-glow inline-flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faShoppingBag} />
              View Order History
            </Link>
            <Link
              href="/products"
              className="border border-white/20 text-white font-semibold py-3 px-8 rounded-full hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faHome} />
              Continue Shopping
            </Link>
          </div>

          {/* Customer Support */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
            <p className="text-gray-400 mb-4">
              Our customer support team is here to help with any questions about your order.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a
                href="mailto:support@gardengoldgreen.com"
                className="text-brand-gold hover:text-brand-gold/80 transition-colors"
              >
                support@gardengoldgreen.com
              </a>
              <span className="text-gray-500 hidden sm:block">•</span>
              <a
                href="tel:+1-555-123-4567"
                className="text-brand-gold hover:text-brand-gold/80 transition-colors"
              >
                (555) 123-4567
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCheckCircle, 
  faEnvelope, 
  faTruck, 
  faHome,
  faShoppingBag,
  faDownload
} from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const { dispatch } = useCart()

  useEffect(() => {
    // Clear cart after successful order
    dispatch({ type: 'CLEAR_CART' })
  }, [dispatch])

  return (
    <main className="bg-brand-black min-h-screen pt-24">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
              <FontAwesomeIcon icon={faCheckCircle} className="text-4xl text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Order Confirmed!</h1>
            <p className="text-xl text-gray-300 mb-2">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
            <p className="text-gray-400">
              Order #GGG-{Date.now().toString().slice(-6)}
            </p>
          </div>

          {/* Order Details */}
          <div className="card-bg rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">What's Next?</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faEnvelope} className="text-brand-gold text-lg" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white mb-2">Confirmation Email</h3>
                  <p className="text-gray-400">
                    We've sent you a confirmation email with your order details and tracking information.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faTruck} className="text-brand-gold text-lg" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white mb-2">Processing & Shipping</h3>
                  <p className="text-gray-400">
                    Your order is being processed and will ship within 1-2 business days. 
                    You'll receive tracking information once it ships.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faDownload} className="text-brand-gold text-lg" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white mb-2">Lab Results</h3>
                  <p className="text-gray-400">
                    Download your product's lab results and certificates of analysis 
                    from your account dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="card-bg rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Estimated Delivery</h3>
            <div className="flex items-center justify-center gap-4 text-gray-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-gold">2-3</div>
                <div className="text-sm">Business Days</div>
              </div>
              <div className="text-gray-500">•</div>
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-gold">Free</div>
                <div className="text-sm">Shipping</div>
              </div>
              <div className="text-gray-500">•</div>
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-gold">30</div>
                <div className="text-sm">Day Return</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders"
              className="btn-gold text-black font-semibold py-3 px-8 rounded-full shadow-gold-glow inline-flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faShoppingBag} />
              View Order History
            </Link>
            <Link
              href="/products"
              className="border border-white/20 text-white font-semibold py-3 px-8 rounded-full hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faHome} />
              Continue Shopping
            </Link>
          </div>

          {/* Customer Support */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
            <p className="text-gray-400 mb-4">
              Our customer support team is here to help with any questions about your order.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a
                href="mailto:support@gardengoldgreen.com"
                className="text-brand-gold hover:text-brand-gold/80 transition-colors"
              >
                support@gardengoldgreen.com
              </a>
              <span className="text-gray-500 hidden sm:block">•</span>
              <a
                href="tel:+1-555-123-4567"
                className="text-brand-gold hover:text-brand-gold/80 transition-colors"
              >
                (555) 123-4567
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
