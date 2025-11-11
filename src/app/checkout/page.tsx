'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useAuth0Context } from '@/contexts/Auth0Context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTruck, 
  faShieldAlt,
  faCheckCircle,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import Link from 'next/link'
import { PaymentMethodSelector } from '@/components/PaymentMethodSelector'

interface CheckoutForm {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  saveInfo: boolean
  newsletter: boolean
}

export default function CheckoutPage() {
  const router = useRouter()
  const { state: cartState } = useCart()
  const { state: authState } = useAuth()
  const { state: auth0State } = useAuth0Context()
  const auth0User = auth0State.user
  const getLegacyField = (field: string): string => {
    const user = authState.user
    if (user && typeof user === 'object' && Object.prototype.hasOwnProperty.call(user, field)) {
      const record = user as unknown as Record<string, unknown>
      const value = record[field]
      return typeof value === 'string' ? value : ''
    }
    return ''
  }
  const defaultEmail = auth0User?.email || getLegacyField('email')
  const fullName = auth0User?.name || getLegacyField('name')
  const [defaultFirstName = '', ...restName] = fullName.split(' ')
  const defaultLastName = restName.join(' ')
  const [form, setForm] = useState<CheckoutForm>({
    email: defaultEmail,
    firstName: defaultFirstName,
    lastName: defaultLastName,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: '',
    saveInfo: false,
    newsletter: false
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({})

  useEffect(() => {
    if (cartState.items.length === 0) {
      router.push('/cart')
    }
  }, [cartState.items.length, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name as keyof CheckoutForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutForm> = {}

    if (!form.email) newErrors.email = 'Email is required'
    if (!form.firstName) newErrors.firstName = 'First name is required'
    if (!form.lastName) newErrors.lastName = 'Last name is required'
    if (!form.address) newErrors.address = 'Address is required'
    if (!form.city) newErrors.city = 'City is required'
    if (!form.state) newErrors.state = 'State is required'
    if (!form.zipCode) newErrors.zipCode = 'ZIP code is required'
    if (!form.phone) newErrors.phone = 'Phone number is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSavePrefs = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsProcessing(true)
    setTimeout(() => setIsProcessing(false), 500)
  }

  const subtotal = cartState.totalPrice
  const shipping = subtotal > 50 ? 0 : 9.99
  const total = subtotal + shipping

  if (cartState.items.length === 0) {
    return null
  }

  return (
    <main className="bg-brand-black min-h-screen pt-24">
      <div className="container mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/cart"
            className="text-gray-400 hover:text-brand-gold transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Cart
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div>
            <form onSubmit={handleSavePrefs} className="space-y-8">
              {/* Contact Information */}
              <div className="card-bg rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                        errors.email ? 'border-red-500' : 'border-white/20'
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="card-bg rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleInputChange}
                      className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                        errors.firstName ? 'border-red-500' : 'border-white/20'
                      }`}
                      placeholder="John"
                    />
                    {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleInputChange}
                      className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                        errors.lastName ? 'border-red-500' : 'border-white/20'
                      }`}
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleInputChange}
                    className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                      errors.address ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder="123 Main Street"
                  />
                  {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleInputChange}
                      className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                        errors.city ? 'border-red-500' : 'border-white/20'
                      }`}
                      placeholder="New York"
                    />
                    {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      State *
                    </label>
                    <select
                      name="state"
                      value={form.state}
                      onChange={handleInputChange}
                      className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                        errors.state ? 'border-red-500' : 'border-white/20'
                      }`}
                    >
                      <option value="">Select State</option>
                      <option value="NY">New York</option>
                      <option value="CA">California</option>
                      <option value="TX">Texas</option>
                      <option value="FL">Florida</option>
                    </select>
                    {errors.state && <p className="text-red-400 text-sm mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={form.zipCode}
                      onChange={handleInputChange}
                      className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                        errors.zipCode ? 'border-red-500' : 'border-white/20'
                      }`}
                      placeholder="10001"
                    />
                    {errors.zipCode && <p className="text-red-400 text-sm mt-1">{errors.zipCode}</p>}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                      errors.phone ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Preferences */}
              <div className="card-bg rounded-xl p-6 space-y-4">
                <h2 className="text-2xl font-bold text-white">Préférences</h2>
                <p className="text-gray-400 text-sm">
                  Le paiement s’effectuera sur la page sécurisée Stripe. Les cartes, Apple Pay, Google Pay et PayPal (si activé) seront proposés automatiquement.
                </p>
                <label className="flex items-start gap-3 text-gray-300 text-sm">
                  <input
                    type="checkbox"
                    name="saveInfo"
                    checked={form.saveInfo}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 text-brand-gold border-white/20 rounded bg-white/5 focus:ring-brand-gold"
                  />
                  <span>Enregistrer mes informations de livraison pour un prochain achat</span>
                </label>
                <label className="flex items-start gap-3 text-gray-300 text-sm">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={form.newsletter}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 text-brand-gold border-white/20 rounded bg-white/5 focus:ring-brand-gold"
                  />
                  <span>Recevoir les offres exclusives et actualités par e-mail</span>
                </label>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-sm font-semibold transition ${
                    isProcessing ? 'bg-white/10 text-gray-400 cursor-not-allowed' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {isProcessing ? 'Sauvegarde...' : 'Sauvegarder mes préférences'}
                </button>
              </div>

              {/* Payment Method Selector */}
              <PaymentMethodSelector 
                onPaymentSuccess={() => {
                  // Rediriger vers la page de succès
                  router.push('/checkout/success')
                }}
                onPaymentError={(error) => {
                  console.error('Erreur de paiement:', error)
                }}
              />
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card-bg rounded-xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {cartState.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{item.name}</h3>
                      <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-brand-gold font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className={shipping === 0 ? 'text-brand-green' : 'text-white'}>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between">
                    <span className="text-xl font-semibold text-white">Total</span>
                    <span className="text-2xl font-bold gold-text-gradient">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-brand-green" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FontAwesomeIcon icon={faTruck} className="text-brand-green" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-brand-green" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}