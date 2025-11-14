'use client'

import { useUser } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
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
  receiptUrl?: string | null
  invoicePdf?: string | null
  trackingNumber?: string | null
  carrier?: string | null
  carrierTrackingUrl?: string | null
  shippingStatus?: string | null
  shippedAt?: string | null
  estimatedDeliveryDate?: string | null
  shippingHistory?: Array<{
    date: string
    status: string
    message?: string
  }>
  subtotalCents?: number | null
  shippingCents?: number | null
  taxCents?: number | null
  discountCents?: number | null
}

export default function OrdersPage() {
  const { user, error, isLoading: authLoading } = useUser()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user, fetchOrders])

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

  const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getShippingHistory = (order: Order) => {
    if (!order.shippingHistory || order.shippingHistory.length === 0) return []
    return [...order.shippingHistory].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
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
              orders.map(order => {
                const subtotalCents =
                  order.subtotalCents ??
                  order.items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0)
                const taxCents = order.taxCents ?? 0
                const discountCents = order.discountCents ?? 0
                const computedShipping =
                  order.totalCents - subtotalCents - taxCents + discountCents
                const shippingCents = order.shippingCents ?? Math.max(computedShipping, 0)

                return (
                  <ResponsiveCard key={order.id} variant="glass" padding="md">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-white break-words">Commande #{order.id}</h3>
                        <p className="text-gray-400 text-sm sm:text-base">
                          Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:space-x-4">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(order.status)} inline-flex items-center`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 sm:ml-2">{getStatusText(order.status)}</span>
                        </span>
                        <span className="text-lg sm:text-xl font-bold text-white">
                          €{formatPrice(order.totalCents)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <h4 className="text-xs sm:text-sm font-medium text-gray-300 mb-3">Articles commandés :</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-start sm:items-center gap-2 text-xs sm:text-sm">
                            <span className="text-gray-300 flex-1 min-w-0 break-words">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="text-white font-medium whitespace-nowrap">
                              €{formatPrice(item.priceCents)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-4 mt-4 space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between text-gray-300">
                        <span>Sous-total</span>
                        <span className="font-medium">€{formatPrice(subtotalCents)}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Livraison</span>
                        <span className="font-medium">
                          {shippingCents > 0
                            ? `€${formatPrice(shippingCents)}`
                            : 'Offert'}
                        </span>
                      </div>
                      {taxCents > 0 && (
                        <div className="flex justify-between text-gray-300">
                          <span>Taxes</span>
                          <span className="font-medium">€{formatPrice(taxCents)}</span>
                        </div>
                      )}
                      {discountCents > 0 && (
                        <div className="flex justify-between text-gray-300">
                          <span>Remises</span>
                          <span className="font-medium">-€{formatPrice(discountCents)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-sm sm:text-base font-semibold text-white border-t border-white/10 pt-2 mt-2">
                        <span>Total</span>
                        <span>€{formatPrice(order.totalCents)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-0 mt-4">
                      {(order.invoicePdf || order.receiptUrl) && (
                        <a
                          href={order.invoicePdf || order.receiptUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-brand-green hover:text-white transition-colors font-medium sm:mr-4 text-center sm:text-left"
                        >
                          <span className="hidden sm:inline">{order.invoicePdf ? 'Télécharger la facture PDF' : 'Voir le reçu'}</span>
                          <span className="sm:hidden">{order.invoicePdf ? 'Facture PDF' : 'Reçu'}</span>
                        </a>
                      )}
                      <a
                        href={`/orders/${order.id}`}
                        className="text-brand-gold hover:text-white transition-colors text-xs sm:text-sm font-medium text-center sm:text-left"
                      >
                        Voir les détails
                      </a>
                    </div>

                    <div className="mt-6 border-t border-white/10 pt-4">
                      <h4 className="text-xs sm:text-sm font-medium text-gray-300 mb-3">Suivi de livraison</h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-sm">
                        <div className="space-y-2">
                          <p className="text-gray-400">
                            Statut livraison :{' '}
                            <span className="text-white font-medium">
                              {order.shippingStatus || getStatusText(order.status)}
                            </span>
                          </p>
                          {order.trackingNumber && (
                            <p className="text-gray-400">
                              Numéro de suivi :{' '}
                              <span className="text-white font-mono">{order.trackingNumber}</span>
                            </p>
                          )}
                          {order.carrier && (
                            <p className="text-gray-400">
                              Transporteur : <span className="text-white">{order.carrier}</span>
                            </p>
                          )}
                          {order.shippedAt && (
                            <p className="text-gray-400">
                              Expédiée le :{' '}
                              <span className="text-white">{formatDateTime(order.shippedAt)}</span>
                            </p>
                          )}
                          {order.estimatedDeliveryDate && (
                            <p className="text-gray-400">
                              Livraison estimée :{' '}
                              <span className="text-white">{formatDateTime(order.estimatedDeliveryDate)}</span>
                            </p>
                          )}
                          {order.deliveredAt && (
                            <p className="text-gray-400">
                              Livrée le :{' '}
                              <span className="text-white">{formatDateTime(order.deliveredAt)}</span>
                            </p>
                          )}
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                            <a
                              href={order.carrierTrackingUrl || `/track-order?orderId=${order.id}&email=${encodeURIComponent(order.customerEmail || '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-brand-gold hover:text-white transition-colors break-all sm:break-normal"
                            >
                              <span className="hidden sm:inline">Consulter le suivi détaillé</span>
                              <span className="sm:hidden">Suivi détaillé</span>
                            </a>
                            <a
                              href={`/track-order?orderId=${order.id}&email=${encodeURIComponent(order.customerEmail || '')}`}
                              className="text-xs text-gray-400 hover:text-white"
                            >
                              Historique complet
                            </a>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute left-2 top-0 bottom-0 w-px bg-white/10" />
                          <div className="ml-6 space-y-3">
                            {getShippingHistory(order).map((entry, index) => (
                              <div key={`${order.id}-shipping-${index}`} className="relative">
                                <span className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-brand-gold"></span>
                                <p className="text-white text-sm font-semibold">{entry.status}</p>
                                <p className="text-xs text-gray-400">{formatDateTime(entry.date)}</p>
                                {entry.message && (
                                  <p className="text-xs text-gray-300 mt-1">{entry.message}</p>
                                )}
                              </div>
                            ))}
                            {(!order.shippingHistory || order.shippingHistory.length === 0) && (
                              <p className="text-xs text-gray-500">
                                Les informations de suivi seront affichées ici dès qu’elles seront disponibles.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </ResponsiveCard>
                )
              })
            )}
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  )
}

