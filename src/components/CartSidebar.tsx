'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faXmark, 
  faTrash, 
  faShoppingCart,
  faArrowRight,
  faBolt,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import { QuantitySelector } from './QuantitySelector'
import { CartLoadingGuard } from './CartLoadingGuard'
import { PaymentMethodSelector } from './PaymentMethodSelector'
import { useTranslation } from '@/contexts/TranslationContext'

export function CartSidebar() {
  return (
    <CartLoadingGuard>
      <CartSidebarContent />
    </CartLoadingGuard>
  )
}

function CartSidebarContent() {
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const { state, dispatch } = useCart()
  const { state: authState } = useAuth()
  
  // Vérifier si on est sur la page panier
  const isOnCartPage = pathname === '/cart'

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const handleClearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const handleExpressCheckout = async () => {
    // Si on n'est pas sur la page panier, rediriger vers le panier
    if (!isOnCartPage) {
      dispatch({ type: 'CLOSE_CART' })
      router.push('/cart')
      return
    }

    try {
      console.log('========================================')
      console.log('🛒 DÉBUT CHECKOUT')
      console.log('========================================')
      console.log('📦 État du panier:', {
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
        isOpen: state.isOpen
      })
      
      // Préparer les items pour Stripe
      const items = state.items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        cbdPercent: item.cbdPercent,
      }))

      console.log('✅ Items préparés pour Stripe:', JSON.stringify(items, null, 2))
      console.log('📊 Nombre d\'items:', items.length)

      // Créer une session Stripe Checkout
      console.log('========================================')
      console.log('🔄 APPEL API /api/checkout')
      console.log('========================================')
      console.log('📤 Body envoyé:', JSON.stringify({ items }, null, 2))
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      })

      console.log('========================================')
      console.log('📡 RÉPONSE API REÇUE')
      console.log('========================================')
      console.log('📊 Status:', response.status)
      console.log('📊 Status Text:', response.statusText)
      console.log('📊 Headers:', Object.fromEntries(response.headers.entries()))
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('========================================')
        console.error('❌ ERREUR HTTP')
        console.error('========================================')
        console.error('Status:', response.status)
        console.error('Texte:', errorText)
        alert(`Erreur ${response.status}: ${errorText}`)
        return
      }

      const data = await response.json()
      console.log('========================================')
      console.log('📄 DONNÉES JSON REÇUES')
      console.log('========================================')
      console.log('Données complètes:', JSON.stringify(data, null, 2))

      if (data.error) {
        console.error('========================================')
        console.error('❌ ERREUR DANS LA RÉPONSE')
        console.error('========================================')
        console.error('Erreur:', data.error)
        alert(`Erreur: ${data.error}`)
        return
      }

      // Rediriger vers Stripe Checkout
      if (data.url) {
        console.log('========================================')
        console.log('✅ REDIRECTION VERS STRIPE')
        console.log('========================================')
        console.log('URL:', data.url)
        console.log('Session ID:', data.sessionId)
        window.location.href = data.url
      } else {
        console.error('========================================')
        console.error('❌ PAS D\'URL DE REDIRECTION')
        console.error('========================================')
        console.error('Données reçues:', data)
        alert('Erreur: pas d\'URL de redirection')
      }
    } catch (error) {
      console.error('========================================')
      console.error('❌ EXCEPTION CAPTURÉE')
      console.error('========================================')
      console.error('Type:', typeof error)
      console.error('Message:', error instanceof Error ? error.message : 'Erreur inconnue')
      console.error('Stack:', error instanceof Error ? error.stack : 'Pas de stack')
      console.error('Objet complet:', error)
      alert(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    }
  }

  if (!state.isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => dispatch({ type: 'CLOSE_CART' })}
      />
      
      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-96 max-w-md bg-brand-black border-l border-brand-gold/20 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white gold-text-gradient flex items-center">
              <FontAwesomeIcon icon={faShoppingCart} className="icon-lg mr-3" />
              Panier ({state.totalItems})
            </h2>
            <button
              onClick={() => dispatch({ type: 'CLOSE_CART' })}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <FontAwesomeIcon icon={faXmark} className="icon-lg" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <FontAwesomeIcon icon={faShoppingCart} className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{t('cart.empty')}</h3>
                <p className="text-gray-400 mb-6">{t('cart.discoverProducts')}</p>
                <Link
                  href="/products"
                  onClick={() => dispatch({ type: 'CLOSE_CART' })}
                  className="btn-gold text-black font-bold py-2 px-6 rounded-full"
                >
                  {t('cart.viewProducts')}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="card-bg rounded-lg p-4 border border-white/10">
                    <div className="flex items-start space-x-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">
                          <Link 
                            href={`/products/${item.slug}`}
                            onClick={() => dispatch({ type: 'CLOSE_CART' })}
                            className="hover:text-brand-gold transition-colors"
                          >
                            {item.name}
                          </Link>
                        </h3>
                        {item.cbdPercent && (
                          <p className="text-brand-green text-xs mb-2">
                            CBD {item.cbdPercent}%
                          </p>
                        )}
                        <p className="text-brand-gold font-bold text-sm">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors p-1"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-sm" />
                      </button>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-3">
                      <QuantitySelector
                        quantity={item.quantity}
                        onQuantityChange={(quantity: number) => handleUpdateQuantity(item.id, quantity)}
                        className="text-sm"
                      />
                      
                      <p className="text-white font-bold text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-white/10 p-6 space-y-4">
              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">{t('cart.total')}</span>
                <span className="text-2xl font-bold gold-text-gradient">
                  {formatPrice(state.totalPrice)}
                </span>
              </div>
              
              {/* Actions */}
              <div className="space-y-3">
                {isOnCartPage ? (
                  <PaymentMethodSelector 
                    onPaymentSuccess={() => {
                      console.log('Paiement réussi')
                    }}
                    onPaymentError={(error) => {
                      console.error('Erreur de paiement:', error)
                    }}
                  />
                ) : (
                  <button
                    onClick={handleExpressCheckout}
                    className="btn-gold text-black font-bold py-3 px-6 rounded-full shadow-gold-glow w-full flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                    {t('cart.viewCart')}
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </button>
                )}
                
                {!authState.isAuthenticated && (
                  <p className="text-gray-400 text-xs text-center">
                    {t('cart.guestCheckout')}{' '}
                    <Link href="/login" className="text-brand-gold hover:underline">
                      {t('cart.login')}
                    </Link>
                  </p>
                )}
                
                <button
                  onClick={handleClearCart}
                  className="w-full text-gray-400 hover:text-red-400 transition-colors text-sm font-semibold py-2"
                >
                  {t('cart.clearCart')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
