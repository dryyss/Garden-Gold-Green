'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faArrowLeft, 
  faCheckCircle, 
  faTruck, 
  faUndo,
  faCalendarAlt,
  faBox,
  faSpinner,
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faPaperPlane,
  faDownload
} from '@fortawesome/free-solid-svg-icons'
import { ReturnRequest } from '@/components/ReturnRequest'
import { useUser } from '@auth0/nextjs-auth0/client'

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
  customerPhone?: string
  shippingAddress?: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    address?: string
    city?: string
    postalCode?: string
    country?: string
  }
  paymentIntentId?: string
  stripeSessionId?: string
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
  receiptUrl?: string | null
  invoicePdf?: string | null
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: authLoading } = useUser()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showReturnForm, setShowReturnForm] = useState(false)
  const [isResendingReceipt, setIsResendingReceipt] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!authLoading && user && params.id) {
      fetchOrder()
    }
  }, [user, params.id, authLoading])

  const fetchOrder = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/orders/${params.id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Commande non trouvée')
        } else {
          setError('Erreur lors du chargement de la commande')
        }
        return
      }

      const data = await response.json()
      setOrder(data.order)
    } catch (error) {
      console.error('Erreur lors du chargement de la commande:', error)
      setError('Erreur lors du chargement de la commande')
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
        return 'En attente de paiement'
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

  const formatDateTime = (value?: string | null) => {
    if (!value) return null
    const date = new Date(value)
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const sortedHistory = useMemo(() => {
    if (!order?.shippingHistory) return []
    return [...order.shippingHistory].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }, [order?.shippingHistory])

  const subtotalCents = useMemo(() => {
    if (!order) return 0
    return (
      order.subtotalCents ??
      order.items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0)
    )
  }, [order])

  const taxCents = order?.taxCents ?? 0
  const discountCents = order?.discountCents ?? 0
  const computedShipping = order
    ? order.totalCents - subtotalCents - taxCents + discountCents
    : 0
  const shippingCents = order?.shippingCents ?? Math.max(computedShipping, 0)

  const canReturn = (order: Order) => {
    if (order.status !== 'delivered') return false
    if (!order.deliveredAt) return false
    
    const deliveredDate = new Date(order.deliveredAt)
    const now = new Date()
    const daysSinceDelivery = Math.floor((now.getTime() - deliveredDate.getTime()) / (1000 * 60 * 60 * 24))
    
    return daysSinceDelivery <= 14 // 14 jours pour retourner
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="text-brand-gold text-4xl animate-spin mb-4" />
          <p className="text-gray-400">Chargement de la commande...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Erreur</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link href="/orders" className="btn-gold px-6 py-2 rounded-full">
            Retour aux commandes
          </Link>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Commande non trouvée</h1>
          <Link href="/orders" className="btn-gold px-6 py-2 rounded-full">
            Retour aux commandes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-brand-black pt-24">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              href="/orders"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Retour aux commandes
            </Link>
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-bold text-white">Commande #{order.id}</h1>
            <p className="text-gray-400">
              Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations de la commande */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statut de la commande */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Statut de la commande</h2>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-2">{getStatusText(order.status)}</span>
                </span>
              </div>
              
              {order.deliveredAt && (
                <p className="text-gray-400 text-sm">
                  Livrée le {new Date(order.deliveredAt).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>

            {/* Articles commandés */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-6">Articles commandés</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                    <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                      {item.product?.images ? (
                        <Image
                          src={(() => {
                            try {
                              const imgs = JSON.parse(item.product.images) as string[]
                              return imgs[0] || '/logo.png'
                            } catch {
                              return '/logo.png'
                            }
                          })()}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faBox} className="text-gray-400 text-xl" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{item.name}</h3>
                      <p className="text-gray-400 text-sm">Quantité: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">€{formatPrice(item.priceCents)}</p>
                      <p className="text-gray-400 text-sm">
                        Total: €{formatPrice(item.priceCents * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-white/10 pt-4 mt-6">
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>€{formatPrice(subtotalCents)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span>{shippingCents > 0 ? `€${formatPrice(shippingCents)}` : 'Offert'}</span>
                  </div>
                  {taxCents > 0 && (
                    <div className="flex justify-between">
                      <span>Taxes</span>
                      <span>€{formatPrice(taxCents)}</span>
                    </div>
                  )}
                  {discountCents > 0 && (
                    <div className="flex justify-between">
                      <span>Remises</span>
                      <span>-€{formatPrice(discountCents)}</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center text-xl font-bold text-white border-t border-white/10 pt-3 mt-3">
                  <span>Total de la commande</span>
                  <span>€{formatPrice(order.totalCents)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {order.status === 'delivered' && canReturn(order) && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">Retour</h2>
                <p className="text-gray-400 mb-4">
                  Vous pouvez demander un retour jusqu'au {new Date(new Date(order.deliveredAt!).getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
                </p>
                <button
                  onClick={() => setShowReturnForm(true)}
                  className="bg-brand-gold text-brand-black px-6 py-2 rounded-lg hover:bg-brand-gold/90 transition-colors font-semibold"
                >
                  <FontAwesomeIcon icon={faUndo} className="mr-2" />
                  Demander un retour
                </button>
              </div>
            )}
          </div>

          {/* Informations de livraison */}
          <div className="space-y-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Informations de livraison</h2>
              
              {order.shippingAddress ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faUser} className="text-brand-gold" />
                    <span className="text-gray-300">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </span>
                  </div>
                  
                  {order.shippingAddress.email && (
                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon icon={faEnvelope} className="text-brand-gold" />
                      <span className="text-gray-300">{order.shippingAddress.email}</span>
                    </div>
                  )}
                  
                  {order.shippingAddress.phone && (
                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon icon={faPhone} className="text-brand-gold" />
                      <span className="text-gray-300">{order.shippingAddress.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-start space-x-3">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-brand-gold mt-1" />
                    <div className="text-gray-300">
                      <p>{order.shippingAddress.address}</p>
                      <p>{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">Aucune adresse de livraison enregistrée</p>
              )}
            </div>

            {/* Informations de paiement */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Paiement</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Méthode</span>
                  <span className="text-white">Carte bancaire</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Statut</span>
                  <span className="text-brand-green">Payé</span>
                </div>
                {order.paymentIntentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">ID de transaction</span>
                    <span className="text-gray-300 text-xs font-mono">{order.paymentIntentId}</span>
                  </div>
                )}
              </div>
              
              {/* Actions reçu/facture */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                {(order.invoicePdf || order.receiptUrl) ? (
                  <a
                    href={order.invoicePdf || order.receiptUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-brand-green/20 hover:bg-brand-green/30 text-brand-green font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                    <span>{order.invoicePdf ? 'Télécharger la facture PDF' : 'Voir le reçu Stripe'}</span>
                  </a>
                ) : (
                  <p className="text-gray-400 text-sm text-center py-2">
                    Aucune facture disponible pour cette commande
                  </p>
                )}
                <button
                  onClick={async () => {
                    if (!confirm('Renvoyer le reçu/facture par email ?')) return
                    
                    setIsResendingReceipt(true)
                    try {
                      const response = await fetch(`/api/orders/${order.id}/resend-receipt`, {
                        method: 'POST',
                      })
                      
                      const data = await response.json()
                      
                      if (response.ok) {
                        alert('Reçu renvoyé avec succès !')
                      } else {
                        alert('Erreur: ' + (data.error || 'Impossible de renvoyer le reçu'))
                      }
                    } catch (error) {
                      console.error('Erreur:', error)
                      alert('Erreur lors du renvoi du reçu')
                    } finally {
                      setIsResendingReceipt(false)
                    }
                  }}
                  disabled={isResendingReceipt}
                  className="flex items-center justify-center gap-2 w-full bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResendingReceipt ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faPaperPlane} />
                      <span>Renvoyer le reçu par email</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire de retour */}
        {showReturnForm && order && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-brand-black rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <ReturnRequest 
                orderId={order.id}
                items={order.items.map(item => ({
                  id: item.id,
                  productName: item.name,
                  quantity: item.quantity,
                  price: item.priceCents / 100,
                  image: '',
                  orderDate: order.createdAt,
                  deliveryDate: order.deliveredAt || order.createdAt,
                  // TODO: affiner la logique de retour possible
                  canReturn: true,
                }))}
                onReturnRequested={() => {
                  setShowReturnForm(false)
                  // Optionnel: recharger les données de la commande
                  fetchOrder()
                }}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}