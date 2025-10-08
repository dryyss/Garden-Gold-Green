'use client'

import React from 'react'
import { useCart } from '@/contexts/CartContext'
import { useAuth0 } from '@/hooks/useAuth0'
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

export function CartSidebar() {
  const { state, dispatch } = useCart()
  const { isAuthenticated } = useAuth0()

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

  const handleExpressCheckout = () => {
    // Rediriger vers le checkout normal
    window.location.href = '/checkout'
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
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-brand-black border-l border-brand-gold/20 shadow-2xl">
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
                <h3 className="text-xl font-semibold text-white mb-2">Votre panier est vide</h3>
                <p className="text-gray-400 mb-6">Découvrez nos produits CBD premium</p>
                <Link
                  href="/products"
                  onClick={() => dispatch({ type: 'CLOSE_CART' })}
                  className="btn-gold text-black font-bold py-2 px-6 rounded-full"
                >
                  Voir les produits
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
                        onUpdate={(quantity) => handleUpdateQuantity(item.id, quantity)}
                        size="sm"
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
                <span className="text-lg font-semibold text-white">Total</span>
                <span className="text-2xl font-bold gold-text-gradient">
                  {formatPrice(state.totalPrice)}
                </span>
              </div>
              
              {/* Actions */}
              <div className="space-y-3">
                {isAuthenticated ? (
                  <Link
                    href="/checkout"
                    onClick={() => dispatch({ type: 'CLOSE_CART' })}
                    className="btn-gold text-black font-bold py-3 px-6 rounded-full shadow-gold-glow w-full flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Commander maintenant
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={handleExpressCheckout}
                      className="btn-gold text-black font-bold py-3 px-6 rounded-full shadow-gold-glow w-full flex items-center justify-center"
                    >
                      <FontAwesomeIcon icon={faBolt} className="mr-2" />
                      Achat Express
                      <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                    </button>
                    <Link
                      href="/checkout"
                      onClick={() => dispatch({ type: 'CLOSE_CART' })}
                      className="bg-white/10 text-gray-300 hover:bg-white/20 font-bold py-3 px-6 rounded-full w-full flex items-center justify-center transition-colors"
                    >
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      Se connecter pour commander
                    </Link>
                  </div>
                )}
                
                <button
                  onClick={handleClearCart}
                  className="w-full text-gray-400 hover:text-red-400 transition-colors text-sm font-semibold py-2"
                >
                  Vider le panier
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
