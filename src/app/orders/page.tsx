'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faBox, faTruck, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { ResponsiveContainer } from '@/components/ResponsiveContainer'
import { ResponsiveCard } from '@/components/ResponsiveCard'

// Données de démonstration
const mockOrders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'Livré',
    total: 89.99,
    items: [
      { name: 'Huile CBD 10%', quantity: 1, price: 29.99 },
      { name: 'Fleurs CBD Amnesia', quantity: 2, price: 12.50 }
    ]
  },
  {
    id: 'ORD-002',
    date: '2024-01-10',
    status: 'En cours',
    total: 156.50,
    items: [
      { name: 'Capsules CBD 25mg', quantity: 3, price: 39.99 },
      { name: 'Crème CBD Relax', quantity: 1, price: 24.99 }
    ]
  },
  {
    id: 'ORD-003',
    date: '2024-01-05',
    status: 'En attente',
    total: 67.30,
    items: [
      { name: 'Huile CBD 5%', quantity: 1, price: 19.99 },
      { name: 'Gummies CBD', quantity: 2, price: 23.65 }
    ]
  }
]

export default function OrdersPage() {
  const { user, error, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/api/auth/login')
      return
    }
  }, [user, isLoading, router])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Livré': return faCheckCircle
      case 'En cours': return faTruck
      case 'En attente': return faBox
      default: return faBox
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Livré': return 'text-green-400 bg-green-400/20'
      case 'En cours': return 'text-yellow-400 bg-yellow-400/20'
      case 'En attente': return 'text-orange-400 bg-orange-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-gold mx-auto"></div>
          <p className="text-white mt-4">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-brand-black pt-24">
      <ResponsiveContainer size="lg" padding="lg">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Mes Commandes</h1>
            <p className="text-gray-400">Suivez l&apos;état de vos commandes</p>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {mockOrders.length === 0 ? (
              <div className="text-center py-12">
                <FontAwesomeIcon icon={faShoppingCart} className="icon-2xl text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Aucune commande</h3>
                <p className="text-gray-400 mb-6">Vous n&apos;avez pas encore passé de commande</p>
                <a
                  href="/products"
                  className="inline-block bg-brand-gold text-brand-black px-6 py-3 rounded-lg hover:bg-brand-gold/90 transition-colors font-semibold"
                >
                  Découvrir nos produits
                </a>
              </div>
            ) : (
              mockOrders.map((order) => (
                <ResponsiveCard key={order.id} variant="glass" padding="md">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Commande #{order.id}</h3>
                      <p className="text-gray-400">Passée le {new Date(order.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 md:mt-0">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        <FontAwesomeIcon icon={getStatusIcon(order.status)} className="icon-sm mr-2" />
                        {order.status}
                      </span>
                      <span className="text-xl font-bold text-white">€{order.total}</span>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Articles commandés :</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-gray-300">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="text-white font-medium">€{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button className="text-brand-gold hover:text-white transition-colors text-sm font-medium">
                      Voir les détails
                    </button>
                  </div>
                </ResponsiveCard>
              ))
            )}
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  )
}
