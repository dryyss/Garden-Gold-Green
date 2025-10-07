'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faArrowLeft,
  faShoppingBag,
  faCalendar,
  faMapMarkerAlt,
  faEuroSign,
  faTruck
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

export default function OrdersPage() {
  const { state: authState } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authState.isAuthenticated) {
      router.push('/')
    }
  }, [authState.isAuthenticated, router])

  // Données de démonstration
  const mockOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 89.97,
      items: [
        { name: '3G Gold Standard CBD Oil', quantity: 1, price: 79.99 },
        { name: 'Emerald Soothe CBD Balm', quantity: 1, price: 9.98 }
      ],
      shippingAddress: {
        street: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'France'
      }
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'shipped',
      total: 54.99,
      items: [
        { name: 'Emerald Soothe CBD Balm', quantity: 1, price: 54.99 }
      ],
      shippingAddress: {
        street: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'France'
      }
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-400 bg-green-400/20'
      case 'shipped':
        return 'text-blue-400 bg-blue-400/20'
      case 'processing':
        return 'text-yellow-400 bg-yellow-400/20'
      default:
        return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Livré'
      case 'shipped':
        return 'Expédié'
      case 'processing':
        return 'En cours de traitement'
      default:
        return 'En attente'
    }
  }

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Chargement...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-brand-black min-h-screen pt-36">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              href="/account"
              className="text-gray-400 hover:text-brand-gold transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold gold-text-gradient mb-2">
                Mes Commandes
              </h1>
              <p className="text-gray-400">
                Historique de vos achats
              </p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {mockOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
              <FontAwesomeIcon icon={faShoppingBag} className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Aucune commande</h3>
            <p className="text-gray-400 mb-6">Vous n'avez pas encore passé de commande</p>
            <Link
              href="/products"
              className="btn-gold text-black font-bold py-2 px-6 rounded-full"
            >
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {mockOrders.map((order) => (
              <div key={order.id} className="card-bg rounded-xl p-6 border border-white/10">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold text-white">
                      Commande #{order.id}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400 flex items-center">
                      <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                      {new Date(order.date).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-lg font-bold gold-text-gradient flex items-center">
                      <FontAwesomeIcon icon={faEuroSign} className="mr-1" />
                      {order.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Articles commandés :</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="text-white font-medium">
                          {(item.price * item.quantity).toFixed(2)}€
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon 
                    icon={faMapMarkerAlt} 
                    className="text-gray-500 mt-1" 
                  />
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Adresse de livraison :</h4>
                    <p className="text-sm text-gray-300">
                      {order.shippingAddress.street}<br />
                      {order.shippingAddress.postalCode} {order.shippingAddress.city}<br />
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex space-x-4">
                    <button className="bg-white/10 text-gray-300 hover:bg-white/20 font-medium py-2 px-4 rounded-full transition-colors text-sm">
                      Voir les détails
                    </button>
                    {order.status === 'delivered' && (
                      <button className="bg-brand-gold/20 text-brand-gold hover:bg-brand-gold/30 font-medium py-2 px-4 rounded-full transition-colors text-sm">
                        Commander à nouveau
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 font-medium py-2 px-4 rounded-full transition-colors text-sm flex items-center">
                        <FontAwesomeIcon icon={faTruck} className="mr-2" />
                        Suivre l'envoi
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
