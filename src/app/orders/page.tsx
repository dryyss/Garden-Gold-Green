'use client'

import React, { useState, useEffect } from 'react'
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
  faTimes,
  faShoppingBag
} from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import Link from 'next/link'

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

function OrdersContent() {
  const { state: authState } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock orders data
      const mockOrders: Order[] = [
        {
          id: '1',
          orderNumber: 'GGG-123456',
          date: '2024-01-15',
          status: 'delivered',
          total: 89.97,
          items: [
            {
              id: '1',
              name: 'Gold Standard CBD Oil - 1000mg',
              price: 49.99,
              quantity: 1,
              image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/6150e371c9-cf959decb319ba5f18c3.png'
            },
            {
              id: '2',
              name: 'Emerald Soothe Balm - 500mg',
              price: 39.98,
              quantity: 2,
              image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/efac7e243f-ef87256518694e833470.png'
            }
          ],
          trackingNumber: '1Z999AA1234567890',
          estimatedDelivery: '2024-01-18'
        },
        {
          id: '2',
          orderNumber: 'GGG-123457',
          date: '2024-01-20',
          status: 'shipped',
          total: 129.97,
          items: [
            {
              id: '3',
              name: 'Green Serenity Gummies - 30ct',
              price: 59.99,
              quantity: 1,
              image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/f28d3694b1-28c8a8a3cb15af90b81e.png'
            },
            {
              id: '4',
              name: 'Silver Purity Vape - 1ml',
              price: 69.98,
              quantity: 1,
              image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/6150e371c9-cf959decb319ba5f18c3.png'
            }
          ],
          trackingNumber: '1Z999AA1234567891',
          estimatedDelivery: '2024-01-25'
        },
        {
          id: '3',
          orderNumber: 'GGG-123458',
          date: '2024-01-22',
          status: 'processing',
          total: 79.99,
          items: [
            {
              id: '5',
              name: 'Premium CBD Capsules - 60ct',
              price: 79.99,
              quantity: 1,
              image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/efac7e243f-ef87256518694e833470.png'
            }
          ]
        }
      ]
      
      setOrders(mockOrders)
      setIsLoading(false)
    }

    loadOrders()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20'
      case 'processing':
        return 'text-blue-400 bg-blue-400/20'
      case 'shipped':
        return 'text-purple-400 bg-purple-400/20'
      case 'delivered':
        return 'text-green-400 bg-green-400/20'
      case 'cancelled':
        return 'text-red-400 bg-red-400/20'
      default:
        return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return faClock
      case 'processing':
        return faClock
      case 'shipped':
        return faTruck
      case 'delivered':
        return faCheckCircle
      case 'cancelled':
        return faTimes
      default:
        return faClock
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente'
      case 'processing':
        return 'En cours de traitement'
      case 'shipped':
        return 'Expédié'
      case 'delivered':
        return 'Livré'
      case 'cancelled':
        return 'Annulé'
      default:
        return status
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="bg-brand-black min-h-screen flex items-center justify-center pt-36">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement de vos commandes...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="bg-brand-black min-h-screen pt-36">
      <div className="container mx-auto px-6 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Mes Commandes</h1>
          <p className="text-gray-400">Suivez et gérez toutes vos commandes</p>
        </div>

        {/* Search and Filter */}
        <div className="card-bg rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <input
                type="text"
                placeholder="Rechercher une commande ou un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300"
              />
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="processing">En cours</option>
                <option value="shipped">Expédié</option>
                <option value="delivered">Livré</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <FontAwesomeIcon icon={faShoppingBag} className="text-6xl text-gray-600 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Aucune commande trouvée</h2>
            <p className="text-gray-400 mb-8">
              {searchTerm || statusFilter !== 'all' 
                ? 'Aucune commande ne correspond à vos critères de recherche.' 
                : 'Vous n\'avez pas encore passé de commande.'}
            </p>
            <Link
              href="/products"
              className="btn-gold text-black font-semibold py-3 px-8 rounded-full shadow-gold-glow inline-flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faShoppingBag} />
              Commencer mes achats
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="card-bg rounded-xl p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div className="flex items-center gap-4 mb-4 lg:mb-0">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        Commande #{order.orderNumber}
                      </h3>
                      <p className="text-gray-400">
                        Passée le {new Date(order.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      <FontAwesomeIcon icon={getStatusIcon(order.status)} className="mr-2" />
                      {getStatusText(order.status)}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold gold-text-gradient">
                        {order.total.toFixed(2)} €
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {order.items.map((item) => (
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
                        <h4 className="text-white font-medium">{item.name}</h4>
                        <p className="text-gray-400 text-sm">Quantité: {item.quantity}</p>
                      </div>
                      <p className="text-brand-gold font-semibold">
                        {(item.price * item.quantity).toFixed(2)} €
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                  <Link
                    href={`/orders/${order.id}`}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <FontAwesomeIcon icon={faEye} />
                    Voir les détails
                  </Link>
                  {order.trackingNumber && (
                    <a
                      href={`https://www.ups.com/track?tracknum=${order.trackingNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <FontAwesomeIcon icon={faTruck} />
                      Suivre le colis
                    </a>
                  )}
                  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors">
                    <FontAwesomeIcon icon={faDownload} />
                    Télécharger la facture
                  </button>
                </div>

                {/* Tracking Info */}
                {order.trackingNumber && (
                  <div className="mt-4 p-4 bg-brand-black/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Numéro de suivi</p>
                        <p className="text-white font-mono">{order.trackingNumber}</p>
                      </div>
                      {order.estimatedDelivery && (
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Livraison estimée</p>
                          <p className="text-white">
                            {new Date(order.estimatedDelivery).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  )
}