'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTruck, 
  faBox, 
  faCheckCircle, 
  faSpinner,
  faArrowLeft,
  faSearch,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons'

interface OrderItem {
  id: string
  productId: string
  name: string
  priceCents: number
  quantity: number
  product?: {
    id: string
    name: string
    image: string
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
  shippingAddress?: {
    street?: string
    city?: string
    postalCode?: string
    country?: string
  }
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

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setOrder(null)
    setSearched(true)

    try {
      const response = await fetch('/api/orders/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId.trim(),
          email: email.trim().toLowerCase(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors de la recherche de la commande')
      }

      const data = await response.json()
      setOrder(data.order)
    } catch (error) {
      console.error('Erreur:', error)
      setError(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <FontAwesomeIcon icon={faCheckCircle} className="text-brand-green text-2xl" />
      case 'shipped':
        return <FontAwesomeIcon icon={faTruck} className="text-brand-gold text-2xl" />
      case 'paid':
      case 'processing':
        return <FontAwesomeIcon icon={faBox} className="text-blue-400 text-2xl" />
      default:
        return <FontAwesomeIcon icon={faBox} className="text-gray-400 text-2xl" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: 'En attente de paiement', color: 'text-orange-400 bg-orange-400/20' }
      case 'paid':
        return { text: 'Payée', color: 'text-blue-400 bg-blue-400/20' }
      case 'processing':
        return { text: 'En cours de traitement', color: 'text-blue-400 bg-blue-400/20' }
      case 'shipped':
        return { text: 'Expédiée', color: 'text-brand-gold bg-brand-gold/20' }
      case 'delivered':
        return { text: 'Livrée', color: 'text-brand-green bg-brand-green/20' }
      case 'cancelled':
        return { text: 'Annulée', color: 'text-red-400 bg-red-400/20' }
      case 'refunded':
        return { text: 'Remboursée', color: 'text-gray-400 bg-gray-400/20' }
      default:
        return { text: status, color: 'text-gray-400 bg-gray-400/20' }
    }
  }

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const subtotalCents = order
    ? order.subtotalCents ?? order.items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0)
    : 0
  const taxCents = order?.taxCents ?? 0
  const discountCents = order?.discountCents ?? 0
  const computedShipping = order ? order.totalCents - subtotalCents - taxCents + discountCents : 0
  const shippingCents = order?.shippingCents ?? Math.max(computedShipping, 0)

  const shippingHistory = order?.shippingHistory
    ? [...order.shippingHistory].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    : []

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-16">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link 
              href="/"
              className="text-gray-400 hover:text-brand-gold transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Retour à l'accueil</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-gold/20 border-2 border-brand-gold mb-6">
              <FontAwesomeIcon icon={faTruck} className="text-brand-gold text-3xl" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Suivez votre commande
            </h1>
            <p className="text-gray-400 text-lg">
              Entrez votre numéro de commande et votre email pour suivre l'état de livraison
            </p>
          </div>

          {/* Search Form */}
          <div className="card-bg rounded-2xl p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="orderId" className="block text-white font-medium mb-2">
                  Numéro de commande *
                </label>
                <input
                  type="text"
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Ex: ORD-123456"
                  required
                  className="w-full px-4 py-3 bg-brand-black border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-white font-medium mb-2">
                  Email de facturation *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="w-full px-4 py-3 bg-brand-black border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-gold text-black font-semibold py-3 px-6 rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    <span>Recherche en cours...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSearch} />
                    <span>Rechercher la commande</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="card-bg rounded-2xl p-6 border border-red-500/20 bg-red-500/10">
              <p className="text-red-400 text-center">{error}</p>
            </div>
          )}

          {/* Order Details */}
          {order && (
            <div className="card-bg rounded-2xl p-8">
              {/* Status Header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Numéro de commande</p>
                  <p className="text-white font-mono font-bold text-xl">{order.id}</p>
                </div>
                <div className="text-center">
                  {getStatusIcon(order.status)}
                  <p className={`mt-2 px-4 py-1 rounded-full text-sm font-medium ${getStatusText(order.status).color}`}>
                    {getStatusText(order.status).text}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-8">
                <h3 className="text-white font-semibold mb-4">Historique de la commande</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-white text-sm" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Commande créée</p>
                      <p className="text-gray-400 text-sm">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  {order.status === 'shipped' && (
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center flex-shrink-0">
                        <FontAwesomeIcon icon={faTruck} className="text-black text-sm" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Commande expédiée</p>
                        <p className="text-gray-400 text-sm">{formatDate(order.updatedAt)}</p>
                      </div>
                    </div>
                  )}

                  {order.status === 'delivered' && order.deliveredAt && (
                    <>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center flex-shrink-0">
                          <FontAwesomeIcon icon={faTruck} className="text-black text-sm" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Commande expédiée</p>
                          <p className="text-gray-400 text-sm">{formatDate(order.updatedAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center flex-shrink-0">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-white text-sm" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Commande livrée</p>
                          <p className="text-gray-400 text-sm">{formatDate(order.deliveredAt)}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-8">
                <h3 className="text-white font-semibold mb-4">Articles commandés</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={item.id || item.productId || `${item.name}-${index}`}
                      className="flex items-center justify-between py-3 border-b border-white/10 last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        {item.product?.image && (
                          <img
                            src={item.product.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-gray-400 text-sm">Quantité: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-white font-semibold">
                        {(item.priceCents * item.quantity / 100).toFixed(2)} {order.currency}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="mb-8">
                  <h3 className="text-white font-semibold mb-4">Adresse de livraison</h3>
                  <div className="flex items-start gap-3 bg-brand-black/50 rounded-lg p-4">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-brand-gold mt-1" />
                    <div className="text-gray-300">
                      {order.shippingAddress.street && <p>{order.shippingAddress.street}</p>}
                      {order.shippingAddress.postalCode && order.shippingAddress.city && (
                        <p>{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
                      )}
                      {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-brand-black/50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Sous-total</span>
                  <span className="text-white font-medium">{formatPrice(subtotalCents)} {order.currency}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Livraison</span>
                  <span className="text-white font-medium">
                    {shippingCents > 0 ? `€${formatPrice(shippingCents)}` : 'Offert'}
                  </span>
                </div>
                {taxCents > 0 && (
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400">Taxes</span>
                    <span className="text-white font-medium">€{formatPrice(taxCents)}</span>
                  </div>
                )}
                {discountCents > 0 && (
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400">Remises</span>
                    <span className="text-white font-medium">-€{formatPrice(discountCents)}</span>
                  </div>
                )}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-white font-bold text-lg">Total</span>
                  <span className="text-brand-gold font-bold text-lg">
                    {formatPrice(order.totalCents)} {order.currency}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 pt-8 border-t border-white/10 text-center">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-brand-gold text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-500 transition-all"
                >
                  <FontAwesomeIcon icon={faSearch} />
                  <span>Continuer mes achats</span>
                </Link>
              </div>
            </div>
          )}

          {/* Help Text if no search yet */}
          {!searched && !error && (
            <div className="card-bg rounded-2xl p-6 text-center">
              <p className="text-gray-400 text-sm">
                Vous avez perdu votre numéro de commande ?{' '}
                <Link href="/contact" className="text-brand-gold hover:underline">
                  Contactez notre service client
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

