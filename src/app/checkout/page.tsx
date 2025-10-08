'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useAuth0 } from '@/hooks/useAuth0'
import { StripeCheckout } from '@/components/StripeCheckout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faLock, 
  faTruck, 
  faShieldAlt,
  faCheckCircle,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import Link from 'next/link'

interface CheckoutForm {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  zipCode: string
  country: string
  phone: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { state: cartState } = useCart()
  const { user } = useAuth0()
  const [form, setForm] = useState<CheckoutForm>({
    email: user?.email || '',
    firstName: user?.given_name || '',
    lastName: user?.family_name || '',
    address: '',
    city: '',
    zipCode: '',
    country: 'FR',
    phone: '',
  })
  const [isProcessing, setIsProcessing] = useState(false)

  // Rediriger si panier vide
  useEffect(() => {
    if (cartState.items.length === 0) {
      router.push('/cart')
    }
  }, [cartState.items.length, router])

  const updateForm = (field: keyof CheckoutForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handlePaymentSuccess = (paymentIntentId: string) => {
    setIsProcessing(true)
    // Rediriger vers la page de succès
    router.push(`/checkout/success?payment_intent=${paymentIntentId}`)
  }

  const handlePaymentError = (error: string) => {
    console.error('Erreur paiement:', error)
    // TODO: Afficher une notification d'erreur
  }

  // Calculer le total
  const subtotal = cartState.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.2 // TVA 20%
  const total = subtotal + shipping + tax

  if (cartState.items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-brand-black pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/cart" 
            className="inline-flex items-center text-brand-gold hover:text-yellow-400 mb-4"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Retour au panier
          </Link>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            Finaliser votre commande
          </h1>
          <p className="text-gray-300">
            Complétez vos informations pour procéder au paiement sécurisé
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations de livraison */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <FontAwesomeIcon icon={faTruck} className="mr-3 text-brand-gold" />
                Adresse de livraison
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => updateForm('firstName', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => updateForm('lastName', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => updateForm('address', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ville *
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => updateForm('city', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    value={form.zipCode}
                    onChange={(e) => updateForm('zipCode', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateForm('phone', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Pays *
                  </label>
                  <select
                    value={form.country}
                    onChange={(e) => updateForm('country', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    required
                  >
                    <option value="FR">France</option>
                    <option value="BE">Belgique</option>
                    <option value="CH">Suisse</option>
                    <option value="LU">Luxembourg</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Paiement */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <FontAwesomeIcon icon={faLock} className="mr-3 text-brand-gold" />
                Paiement sécurisé
              </h2>
              
              <StripeCheckout
                items={cartState.items}
                customerEmail={form.email}
                customerName={`${form.firstName} ${form.lastName}`}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>
          </div>

          {/* Résumé */}
          <div className="space-y-6">
            {/* Produits */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Votre commande
              </h3>
              
              <div className="space-y-4">
                {cartState.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">
                        {item.name}
                      </h4>
                      <p className="text-gray-400 text-xs">
                        Quantité: {item.quantity}
                      </p>
                    </div>
                    <div className="text-white font-semibold">
                      {(item.price * item.quantity).toFixed(2)}€
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)}€</span>
                </div>
                
                <div className="flex justify-between text-gray-300">
                  <span>Livraison</span>
                  <span>{shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)}€`}</span>
                </div>
                
                <div className="flex justify-between text-gray-300">
                  <span>TVA (20%)</span>
                  <span>{tax.toFixed(2)}€</span>
                </div>
                
                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between text-white text-lg font-bold">
                    <span>Total</span>
                    <span>{total.toFixed(2)}€</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sécurité */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <FontAwesomeIcon icon={faShieldAlt} className="text-brand-gold" />
                <span className="text-white font-medium">Paiement sécurisé</span>
              </div>
              
              <div className="space-y-2 text-gray-300 text-sm">
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 w-3 h-3" />
                  <span>Chiffrement SSL 256-bit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 w-3 h-3" />
                  <span>Certifié PCI DSS</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 w-3 h-3" />
                  <span>Protection contre la fraude</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}