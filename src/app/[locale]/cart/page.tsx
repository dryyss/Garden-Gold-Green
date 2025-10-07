'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faMinus, 
  faPlus, 
  faTrash, 
  faArrowLeft,
  faShoppingBag,
  faLock
} from '@fortawesome/free-solid-svg-icons'

export default function CartPage() {
  const { state, dispatch } = useCart()

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: { id } })
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
    }
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  if (state.items.length === 0) {
    return (
      <main className="bg-brand-black min-h-screen pt-36">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <FontAwesomeIcon icon={faShoppingBag} className="text-6xl text-gray-600 mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h1>
            <p className="text-gray-400 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link
              href="/products"
              className="btn-gold text-black font-semibold py-3 px-8 rounded-full shadow-gold-glow inline-flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-brand-black min-h-screen pt-36">
      <div className="container mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/products"
            className="text-gray-400 hover:text-brand-gold transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Continue Shopping
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-white mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {state.items.map((item) => (
                <div key={item.id} className="card-bg rounded-xl p-6">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{item.name}</h3>
                      <p className="text-gray-400 mb-4">${item.price.toFixed(2)} each</p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-white/20 rounded-full">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-10 h-10 text-gray-400 hover:text-white transition-colors flex items-center justify-center"
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </button>
                          <span className="w-10 text-center font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-10 h-10 text-gray-400 hover:text-white transition-colors flex items-center justify-center"
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold gold-text-gradient">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={clearCart}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card-bg rounded-xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal ({state.totalItems} items)</span>
                  <span className="text-white">${state.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-brand-green">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax</span>
                  <span className="text-white">${(state.totalPrice * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between">
                    <span className="text-xl font-semibold text-white">Total</span>
                    <span className="text-2xl font-bold gold-text-gradient">
                      ${(state.totalPrice * 1.08).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full btn-gold text-black font-bold py-4 px-6 rounded-full shadow-gold-glow text-center block mb-4"
              >
                Proceed to Checkout
              </Link>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <FontAwesomeIcon icon={faLock} />
                <span>Secure checkout with SSL encryption</span>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center text-sm text-gray-400">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-brand-green mr-2" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-brand-green mr-2" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-brand-green mr-2" />
                  <span>Lab-tested products</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}