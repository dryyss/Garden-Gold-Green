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

function OrdersContent() {
  const { state: authState } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading orders from API
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="bg-brand-black min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your orders...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="bg-brand-black min-h-screen pt-24">
      <div className="container mx-auto px-6 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Order History</h1>
          <p className="text-gray-400">Track and manage your orders</p>
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
                placeholder="Search orders or products..."
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
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <FontAwesomeIcon icon={faSearch} className="text-6xl text-gray-600 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">No Orders Found</h2>
            <p className="text-gray-400 mb-8">
              {searchTerm || statusFilter !== 'all' 
                ? 'No orders match your search criteria.' 
                : 'You haven\'t placed any orders yet.'}
            </p>
            <Link
              href="/products"
              className="btn-gold text-black font-semibold py-3 px-8 rounded-full shadow-gold-glow inline-flex items-center gap-2"
            >
              Start Shopping
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
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-gray-400">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      <FontAwesomeIcon icon={getStatusIcon(order.status)} className="mr-2" />
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold gold-text-gradient">
                        ${order.total.toFixed(2)}
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
                        <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                      </div>
                      <p className="text-brand-gold font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
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
                    View Details
                  </Link>
                  {order.trackingNumber && (
                    <a
                      href={`https://www.ups.com/track?tracknum=${order.trackingNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <FontAwesomeIcon icon={faTruck} />
                      Track Package
                    </a>
                  )}
                  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors">
                    <FontAwesomeIcon icon={faDownload} />
                    Download Invoice
                  </button>
                </div>

                {/* Tracking Info */}
                {order.trackingNumber && (
                  <div className="mt-4 p-4 bg-brand-black/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Tracking Number</p>
                        <p className="text-white font-mono">{order.trackingNumber}</p>
                      </div>
                      {order.estimatedDelivery && (
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Estimated Delivery</p>
                          <p className="text-white">
                            {new Date(order.estimatedDelivery).toLocaleDateString()}
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
        image: 'https://via.placeholder.com/400x288/00C853/FFFFFF?text=CBD+Oil+10%25',
        cbdPercent: 10
      },
      {
        id: '2',
        title: 'Emerald Soothe CBD Balm',
        price: 54.99,
        quantity: 1,
        image: 'https://via.placeholder.com/400x288/FFD700/000000?text=CBD+Cream+2%25',
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
        image: 'https://via.placeholder.com/400x288/8B4513/FFFFFF?text=CBD+Flower',
        cbdPercent: 15
      }
    ]
  },
  {
    id: 'ORD-003',
    date: '2024-01-05',
    status: 'processing',
    total: 159.98,
    items: [
      {
        id: '4',
        title: 'CBD Capsules Pack',
        price: 79.99,
        quantity: 2,
        image: 'https://via.placeholder.com/400x288/4169E1/FFFFFF?text=CBD+Capsules',
        cbdPercent: 5
      }
    ]
  }
]

const statusConfig = {
  processing: {
    label: 'En cours de traitement',
    icon: faClock,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-900/20',
    borderColor: 'border-yellow-500/30'
  },
  shipped: {
    label: 'Expédié',
    icon: faTruck,
    color: 'text-blue-400',
    bgColor: 'bg-blue-900/20',
    borderColor: 'border-blue-500/30'
  },
  delivered: {
    label: 'Livré',
    icon: faCheckCircle,
    color: 'text-green-400',
    bgColor: 'bg-green-900/20',
    borderColor: 'border-green-500/30'
  },
  cancelled: {
    label: 'Annulé',
    icon: faTimesCircle,
    color: 'text-red-400',
    bgColor: 'bg-red-900/20',
    borderColor: 'border-red-500/30'
  }
}

function OrdersContent() {
  const { state: authState } = useAuth()
  const [orders] = useState(mockOrders)

  return (
    <div className="bg-brand-black min-h-screen text-gray-300 pt-24">
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
