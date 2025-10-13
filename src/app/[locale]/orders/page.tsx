'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSearch, 
  faFilter, 
  faEye, 
  faDownload,
  faTruck,
  faCheckCircle,
  faClock,
  faTimes
} from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  orderNumber: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: OrderItem[]
  trackingNumber?: string
  estimatedDelivery?: string
}

// Mock order data
const mockOrders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 134.98,
    items: [
      {
        id: '1',
        title: '3G Gold Standard CBD Oil',
        price: 79.99,
        quantity: 1,
        image: '/products/cbd-oil-10.svg',
        cbdPercent: 10
      },
      {
        id: '2',
        title: 'Emerald Soothe CBD Balm',
        price: 54.99,
        quantity: 1,
        image: '/products/cbd-cream.svg',
        cbdPercent: 2
      }
    ]
  },
  {
    id: 'ORD-002',
    date: '2024-01-10',
    status: 'shipped',
    total: 89.99,
    items: [
      {
        id: '3',
        title: 'Premium CBD Flower',
        price: 89.99,
        quantity: 1,
        image: '/products/default.svg"bg-brand-black min-h-screen text-gray-300 pt-24">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/profile" className="text-gray-400 hover:text-brand-gold mr-4">
              <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
            </Link>
            <h1 className="text-4xl font-bold gold-text-gradient">Mes Commandes</h1>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="card-bg rounded-xl p-12 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Aucune commande trouvée</h2>
              <p className="text-gray-400 mb-6">Vous n'avez pas encore passé de commande.</p>
              <Link
                href="/products"
                className="btn-gold text-black font-bold py-3 px-8 rounded-full shadow-gold-glow inline-block"
              >
                Découvrir nos produits
              </Link>
            </div>
          ) : (
            orders.map((order) => {
              const status = statusConfig[order.status as keyof typeof statusConfig]
              
              return (
                <div key={order.id} className="card-bg rounded-xl p-6">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">Commande #{order.id}</h3>
                      <p className="text-gray-400 text-sm">
                        Passée le {new Date(order.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.borderColor} border ${status.color}`}>
                        <FontAwesomeIcon icon={status.icon} className="mr-2" />
                        {status.label}
                      </div>
                      <p className="text-xl font-bold gold-text-gradient mt-2">
                        €{order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 mb-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-white truncate">{item.title}</h4>
                          <p className="text-xs text-gray-400">Quantité: {item.quantity}</p>
                          {item.cbdPercent && (
                            <p className="text-xs text-brand-green">{item.cbdPercent}% CBD</p>
                          )}
                        </div>
                        <div className="text-sm font-semibold gold-text-gradient">
                          €{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex space-x-3">
                      <button className="text-gray-400 hover:text-white transition-colors text-sm">
                        <FontAwesomeIcon icon={faEye} className="mr-2" />
                        Voir les détails
                      </button>
                      <button className="text-gray-400 hover:text-white transition-colors text-sm">
                        <FontAwesomeIcon icon={faDownload} className="mr-2" />
                        Télécharger la facture
                      </button>
                    </div>
                    
                    {order.status === 'delivered' && (
                      <button className="btn-gold text-black font-bold py-2 px-6 rounded-full shadow-gold-glow text-sm">
                        Commander à nouveau
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/products"
            className="card-bg rounded-xl p-6 hover:bg-white/5 transition-colors text-center"
          >
            <h3 className="text-lg font-bold text-white mb-2">Continuer mes achats</h3>
            <p className="text-gray-400 text-sm">Découvrez nos nouveaux produits</p>
          </Link>
          
          <Link
            href="/profile"
            className="card-bg rounded-xl p-6 hover:bg-white/5 transition-colors text-center"
          >
            <h3 className="text-lg font-bold text-white mb-2">Mon profil</h3>
            <p className="text-gray-400 text-sm">Gérer mes informations</p>
          </Link>
          
          <Link
            href="/contact"
            className="card-bg rounded-xl p-6 hover:bg-white/5 transition-colors text-center"
          >
            <h3 className="text-lg font-bold text-white mb-2">Support client</h3>
            <p className="text-gray-400 text-sm">Besoin d'aide ?</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  )
}
