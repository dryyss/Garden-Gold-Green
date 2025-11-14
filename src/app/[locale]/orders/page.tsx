'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useAuth0Context } from '@/contexts/Auth0Context'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faArrowLeft,
  faShoppingBag,
  faCheckCircle,
  faTruck,
  faBox,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'

interface Order {
  id: string
  status: string
  totalCents: number
  items: any[]
  createdAt: string
  customerName?: string
  customerEmail?: string
}

export default function OrdersPage() {
  const { state: auth0State } = useAuth0Context()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  const isAuthenticated = auth0State.isAuthenticated

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)
      
      const response = await fetch('/api/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        // Si c'est une erreur 503 (Service Unavailable), afficher le message spécifique
        if (response.status === 503) {
          setErrorMessage(data.details || data.error || 'Service temporairement indisponible')
          setOrders(data.orders || []) // Utiliser le tableau vide de la réponse
          return
        }
        throw new Error(data.error || data.details || 'Erreur lors du chargement des commandes')
      }

      setOrders(data.orders || [])
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
      return
    }
    if (isAuthenticated) {
      fetchOrders()
    }
  }, [isAuthenticated, router, fetchOrders])

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

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="text-brand-gold text-4xl animate-spin mb-4" />
          <p className="text-gray-400">Chargement de vos commandes...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="bg-brand-black min-h-screen text-gray-300 pt-24">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/profile" className="text-gray-400 hover:text-brand-gold mr-4">
              <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Mes Commandes</h1>
              <p className="text-gray-400 text-sm">Suivez l'état de vos commandes</p>
            </div>
          </div>
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
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                <FontAwesomeIcon icon={faShoppingBag} className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Aucune commande</h3>
              <p className="text-gray-400 mb-6">Vous n'avez pas encore passé de commande</p>
              <Link
                href="/products"
                className="inline-block bg-brand-gold text-brand-black px-6 py-3 rounded-lg hover:bg-brand-gold/90 transition-colors font-semibold"
              >
                Découvrir nos produits
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="card-bg rounded-xl p-6">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Commande #{order.id.slice(0, 8)}</h3>
                    <p className="text-gray-400 text-sm">
                      Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                      {getStatusIcon(order.status)}
                      <span className="ml-2 text-white">{getStatusText(order.status)}</span>
                    </div>
                    <p className="text-xl font-bold gold-text-gradient mt-2">
                      €{formatPrice(order.totalCents)}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-6">
                  {order.items && order.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-white font-medium">
                        €{formatPrice(item.priceCents * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Actions */}
                <div className="flex justify-end">
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-brand-gold hover:text-white transition-colors text-sm font-medium"
                  >
                    Voir les détails
                  </Link>
                </div>
              </div>
            ))
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
