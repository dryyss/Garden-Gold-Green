'use client'

import { useUser } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faBox, faTruck, faCheckCircle, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { ResponsiveContainer } from '@/components/ResponsiveContainer'
import { ResponsiveCard } from '@/components/ResponsiveCard'

interface OrderItem {
  id: string
  productId: string
  name: string
  priceCents: number
  quantity: number
  product?: {
    id: string
    title: string
    images: string
  }
}

interface Order {
  id: string
  status: string
  totalCents: number
  currency: string
  items: OrderItem[]
  createdAt: string
  updatedAt: string
  deliveredAt?: string
  customerEmail?: string
  customerName?: string
  shippingAddress?: any
}

export default function OrdersPage() {
  const { user, error, isLoading: authLoading } = useUser()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)
      
      const response = await fetch('/api/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des commandes')
      }

      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <FontAwesomeIcon icon={faCheckCircle} className="text-brand-green" />
      case 'shipped':
        return <FontAwesomeIcon icon={faTruck} className="text-brand-gold" />
      case 'paid':
        return <FontAwesomeIcon icon={faBox} className="text-blue-400" />
      default:
        return <FontAwesomeIcon icon={faBox} className="text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente'
      case 'paid':
        return 'Payée'
      case 'shipped':
        return 'Expédiée'
      case 'delivered':
        return 'Livrée'
      case 'cancelled':
        return 'Annulée'
      case 'refunded':
        return 'Remboursée'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-brand-green bg-brand-green/20'
      case 'shipped':
        return 'text-brand-gold bg-brand-gold/20'
      case 'paid':
        return 'text-blue-400 bg-blue-400/20'
      case 'pending':
        return 'text-orange-400 bg-orange-400/20'
      case 'cancelled':
        return 'text-red-400 bg-red-400/20'
      case 'refunded':
        return 'text-gray-400 bg-gray-400/20'
      default:
        return 'text-gray-400 bg-gray-400/20'
    }
  }

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2)
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="text-brand-gold text-4xl animate-spin mb-4" />
          <p className="text-gray-400">Chargement de vos commandes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Erreur de connexion</h1>
          <p className="text-gray-400 mb-6">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-gold px-6 py-2 rounded-full"
          >
            Réessayer
          </button>
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

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-400">{errorMessage}</p>
              <button
                onClick={fetchOrders}
                className="mt-2 text-sm text-red-300 hover:text-red-200 underline"
              >
                Réessayer
              </button>
            </div>
          )}

          {/* Orders List */}
          <div className="space-y-6">
            {orders.length === 0 ? (
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
              orders.map((order) => (
                <ResponsiveCard key={order.id} variant="glass" padding="md">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Commande #{order.id}</h3>
                      <p className="text-gray-400">
                        Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 md:mt-0">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-2">{getStatusText(order.status)}</span>
                      </span>
                      <span className="text-xl font-bold text-white">
                        €{formatPrice(order.totalCents)}
                      </span>
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
                          <span className="text-white font-medium">
                            €{formatPrice(item.priceCents)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <a
                      href={`/orders/${order.id}`}
                      className="text-brand-gold hover:text-white transition-colors text-sm font-medium"
                    >
                      Voir les détails
                    </a>
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

