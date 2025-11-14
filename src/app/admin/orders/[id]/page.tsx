"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminGuard } from '@/components/AdminGuard'
import { Breadcrumb } from '@/components/Breadcrumb'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBox,
  faCheckCircle,
  faClock,
  faPaperPlane,
  faRefresh,
  faTruck,
  faUser,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

type ShippingHistoryEntry = {
  date: string
  status: string
  message?: string
}

type Order = {
  id: string
  status: string
  totalCents: number
  currency: string
  customerEmail?: string | null
  customerName?: string | null
  customerPhone?: string | null
  trackingNumber?: string | null
  carrier?: string | null
  carrierTrackingUrl?: string | null
  shippingStatus?: string | null
  shippedAt?: string | null
  deliveredAt?: string | null
  estimatedDeliveryDate?: string | null
  shippingHistory?: ShippingHistoryEntry[]
  shippingAddress?: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    address?: string
    city?: string
    postalCode?: string
    country?: string
  } | null
  billingAddress?: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    address?: string
    city?: string
    postalCode?: string
    country?: string
  } | null
  paymentIntentId?: string | null
  stripeSessionId?: string | null
  createdAt: string
  items: Array<{
    productId: string
    name: string
    quantity: number
    priceCents: number
  }>
  subtotalCents?: number | null
  shippingCents?: number | null
  taxCents?: number | null
  discountCents?: number | null
}

const statusOptions = [
  { value: 'pending', label: 'En attente' },
  { value: 'paid', label: 'Payée' },
  { value: 'processing', label: 'En préparation' },
  { value: 'shipped', label: 'Expédiée' },
  { value: 'delivered', label: 'Livrée' },
  { value: 'cancelled', label: 'Annulée' },
  { value: 'refunded', label: 'Remboursée' },
]

const carriers = [
  { value: '', label: 'Non défini' },
  { value: 'La Poste', label: 'La Poste / Colissimo' },
  { value: 'Chronopost', label: 'Chronopost' },
  { value: 'DHL', label: 'DHL' },
  { value: 'UPS', label: 'UPS' },
  { value: 'FedEx', label: 'FedEx' },
  { value: 'Mondial Relay', label: 'Mondial Relay' },
]

type FormState = {
  status: string
  trackingNumber: string
  carrier: string
  carrierTrackingUrl: string
  shippingStatus: string
  shippedAt: string
  deliveredAt: string
  estimatedDeliveryDate: string
  historyStatus: string
  historyMessage: string
}

const emptyFormState: FormState = {
  status: 'processing',
  trackingNumber: '',
  carrier: '',
  carrierTrackingUrl: '',
  shippingStatus: '',
  shippedAt: '',
  deliveredAt: '',
  estimatedDeliveryDate: '',
  historyStatus: '',
  historyMessage: '',
}

function formatDateInput(value?: string | null) {
  if (!value) return ''
  return value.slice(0, 16)
}

function formatCurrency(cents: number, currency: string) {
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
    }).format(cents / 100)
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency}`
  }
}

function sortHistory(entries: ShippingHistoryEntry[] = []) {
  return [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

function generateOrderNumber(orderId: string, createdAt?: string): string {
  // Si l'ID est déjà au format CMD-YYYYMMDD-NNNN, l'utiliser tel quel
  if (orderId.startsWith('CMD-')) {
    return orderId
  }
  
  // Sinon, générer un format similaire à partir de la date de création et de l'ID
  if (createdAt) {
    const date = new Date(createdAt)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    // Utiliser les 4 derniers caractères de l'ID pour créer un numéro déterministe
    const idSuffix = orderId.slice(-4).toUpperCase().replace(/[^0-9A-Z]/g, '0').padStart(4, '0')
    return `CMD-${year}${month}${day}-${idSuffix}`
  }
  
  // Fallback: utiliser les 8 premiers caractères en majuscules
  return orderId.substring(0, 8).toUpperCase()
}

function getPaymentStatusLabel(status: string): string {
  switch (status) {
    case 'paid':
      return 'Payée'
    case 'pending':
      return 'En attente de paiement'
    case 'processing':
      return 'Paiement en cours'
    case 'cancelled':
      return 'Annulée'
    case 'refunded':
      return 'Remboursée'
    default:
      return status
  }
}

function getPaymentStatusColor(status: string): string {
  switch (status) {
    case 'paid':
      return 'bg-green-400/20 text-green-400 border-green-400/30'
    case 'pending':
      return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30'
    case 'processing':
      return 'bg-blue-400/20 text-blue-400 border-blue-400/30'
    case 'cancelled':
    case 'refunded':
      return 'bg-red-400/20 text-red-400 border-red-400/30'
    default:
      return 'bg-gray-400/20 text-gray-400 border-gray-400/30'
  }
}

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [form, setForm] = useState<FormState>(emptyFormState)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingOrder, setIsLoadingOrder] = useState(true)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setIsLoadingOrder(true)
      try {
        const res = await fetch(`/api/orders/admin?search=${encodeURIComponent(orderId)}&limit=1`)
        const data = await res.json()
        if (data.success && data.orders && data.orders.length > 0) {
          const orderData = data.orders[0]
          setOrder(orderData)
          setForm({
            status: orderData.status,
            trackingNumber: orderData.trackingNumber || '',
            carrier: orderData.carrier || '',
            carrierTrackingUrl: orderData.carrierTrackingUrl || '',
            shippingStatus: orderData.shippingStatus || '',
            shippedAt: formatDateInput(orderData.shippedAt),
            deliveredAt: formatDateInput(orderData.deliveredAt),
            estimatedDeliveryDate: formatDateInput(orderData.estimatedDeliveryDate),
            historyStatus: '',
            historyMessage: '',
          })
        } else {
          setMessage('Commande non trouvée')
        }
      } catch (error) {
        console.error('Erreur chargement commande admin:', error)
        setMessage('Impossible de charger la commande.')
      } finally {
        setIsLoadingOrder(false)
      }
    }

    if (orderId) {
      load()
    }
  }, [orderId])

  const handleInputChange = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleResetHistory = () => {
    setForm(prev => ({
      ...prev,
      historyStatus: '',
      historyMessage: '',
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      const payload: Record<string, unknown> = {
        orderId: order?.id,
        status: form.status,
        trackingNumber: form.trackingNumber || null,
        carrier: form.carrier || null,
        carrierTrackingUrl: form.carrierTrackingUrl || null,
        shippingStatus: form.shippingStatus || null,
        shippedAt: form.shippedAt ? new Date(form.shippedAt).toISOString() : null,
        deliveredAt: form.deliveredAt ? new Date(form.deliveredAt).toISOString() : null,
        estimatedDeliveryDate: form.estimatedDeliveryDate
          ? new Date(form.estimatedDeliveryDate).toISOString()
          : null,
      }

      if (form.historyStatus) {
        payload.shippingHistoryEntry = {
          status: form.historyStatus,
          message: form.historyMessage,
        }
      }

      const res = await fetch('/api/orders/admin', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erreur serveur')
      }

      const data = await res.json()
      const updatedOrder: Order = data.order

      setOrder(updatedOrder)
      setForm({
        status: updatedOrder.status,
        trackingNumber: updatedOrder.trackingNumber || '',
        carrier: updatedOrder.carrier || '',
        carrierTrackingUrl: updatedOrder.carrierTrackingUrl || '',
        shippingStatus: updatedOrder.shippingStatus || '',
        shippedAt: formatDateInput(updatedOrder.shippedAt),
        deliveredAt: formatDateInput(updatedOrder.deliveredAt),
        estimatedDeliveryDate: formatDateInput(updatedOrder.estimatedDeliveryDate),
        historyStatus: '',
        historyMessage: '',
      })
      setMessage('Commande mise à jour avec succès.')
      handleResetHistory()
    } catch (error) {
      console.error('Erreur mise à jour commande:', error)
      setMessage(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setIsLoading(false)
    }
  }

  const shippingTimeline = () => {
    if (!order?.shippingHistory || order.shippingHistory.length === 0) return null
    return sortHistory(order.shippingHistory).map((entry, index) => (
      <div key={`history-${index}`} className="relative pl-8 pb-6">
        <span className="absolute left-0 top-1 flex h-4 w-4 -translate-x-1/2 items-center justify-center">
          <span className="h-3 w-3 rounded-full bg-brand-gold"></span>
        </span>
        <p className="text-sm text-white font-medium">{entry.status}</p>
        <p className="text-xs text-gray-400">{new Date(entry.date).toLocaleString('fr-FR')}</p>
        {entry.message && <p className="text-sm text-gray-300 mt-1">{entry.message}</p>}
      </div>
    ))
  }

  if (isLoadingOrder) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-brand-black text-white pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <FontAwesomeIcon icon={faRefresh} className="animate-spin text-4xl text-brand-gold mb-4" />
            <p className="text-gray-400">Chargement de la commande...</p>
          </div>
        </div>
      </AdminGuard>
    )
  }

  if (!order) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-brand-black text-white pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 mb-4">{message || 'Commande non trouvée'}</p>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 text-brand-gold hover:text-yellow-400"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Retour à la liste des commandes
            </Link>
          </div>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-brand-black text-white pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <Breadcrumb 
            items={[
              { label: 'Admin', href: '/admin' },
              { label: 'Commandes', href: '/admin/orders' },
              { label: order ? generateOrderNumber(order.id, order.createdAt) : 'Commande' }
            ]}
          />

          <header className="mb-10">
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Retour à la liste
            </Link>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <FontAwesomeIcon icon={faTruck} className="text-brand-gold" />
              Commande {generateOrderNumber(order.id, order.createdAt)}
            </h1>
            <p className="text-gray-400 max-w-2xl">
              Gérez le suivi et l'expédition de cette commande. Ajoutez un numéro de suivi, un transporteur,
              un statut d'expédition et des notes d'historique pour informer votre client en temps réel.
            </p>
          </header>

          {message && (
            <div className="mb-6 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200">
              {message}
            </div>
          )}

          {isLoading && (
            <div className="mb-6 rounded-lg border border-white/10 bg-black/40 px-4 py-4 flex items-center gap-3">
              <FontAwesomeIcon icon={faRefresh} className="animate-spin text-brand-gold" />
              <span>Mise à jour en cours…</span>
            </div>
          )}

          <div className="card-bg rounded-2xl p-6 border border-white/5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-400">Commande</p>
                <p className="text-xl font-semibold">{generateOrderNumber(order.id, order.createdAt)}</p>
                {!order.id.startsWith('CMD-') && (
                  <p className="text-xs text-gray-500 font-mono mt-1">ID: {order.id}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
                  <FontAwesomeIcon icon={faUser} />
                  <span>{order.customerName || 'Client'}</span>
                </span>
                {order.customerEmail && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
                    {order.customerEmail}
                  </span>
                )}
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
                  <FontAwesomeIcon icon={faClock} />
                  <span>{new Date(order.createdAt).toLocaleString('fr-FR')}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Statut de commande</label>
                  <select
                    value={form.status}
                    onChange={event => handleInputChange('status', event.target.value)}
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-brand-gold text-white"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Transporteur</label>
                  <select
                    value={form.carrier}
                    onChange={event => handleInputChange('carrier', event.target.value)}
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-brand-gold text-white"
                  >
                    {carriers.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Numéro de suivi</label>
                  <input
                    value={form.trackingNumber}
                    onChange={event => handleInputChange('trackingNumber', event.target.value)}
                    placeholder="6A1234567890"
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-brand-gold text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Sera inclus automatiquement dans l'email d'expédition.
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Lien de suivi</label>
                  <input
                    value={form.carrierTrackingUrl}
                    onChange={event => handleInputChange('carrierTrackingUrl', event.target.value)}
                    placeholder="https://…"
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-brand-gold text-white"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Statut d'expédition</label>
                  <input
                    value={form.shippingStatus}
                    onChange={event => handleInputChange('shippingStatus', event.target.value)}
                    placeholder="En transit, En préparation…"
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-brand-gold text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Date d'expédition</label>
                    <input
                      type="datetime-local"
                      value={form.shippedAt}
                      onChange={event => handleInputChange('shippedAt', event.target.value)}
                      className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-brand-gold text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Date de livraison</label>
                    <input
                      type="datetime-local"
                      value={form.deliveredAt}
                      onChange={event => handleInputChange('deliveredAt', event.target.value)}
                      className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-brand-gold text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Livraison estimée</label>
                  <input
                    type="datetime-local"
                    value={form.estimatedDeliveryDate}
                    onChange={event => handleInputChange('estimatedDeliveryDate', event.target.value)}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-brand-gold text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nouvelle étape de suivi</label>
                  <input
                    value={form.historyStatus}
                    onChange={event => handleInputChange('historyStatus', event.target.value)}
                    placeholder="Ex: Colis arrivé en agence locale"
                    className="w-full px-4 py-2 mb-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-brand-gold text-white"
                  />
                  <textarea
                    value={form.historyMessage}
                    onChange={event => handleInputChange('historyMessage', event.target.value)}
                    placeholder="Message optionnel"
                    rows={2}
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-brand-gold text-white"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={handleResetHistory}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      Réinitialiser le brouillon
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                    <FontAwesomeIcon icon={faTruck} />
                    Historique d'expédition
                  </h3>
                  <div className="relative">
                    <div className="absolute left-1 top-1 bottom-4 w-px bg-white/10" />
                    <div className="space-y-4 pl-2">
                      {shippingTimeline()}
                      {(!order.shippingHistory || order.shippingHistory.length === 0) && (
                        <p className="text-sm text-gray-400">Aucun événement enregistré pour le moment.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                    <FontAwesomeIcon icon={faPaperPlane} />
                    Récapitulatif
                  </h3>
                  <div className="space-y-3 text-sm">
                    {/* Informations client */}
                    <div>
                      <p className="text-gray-400 mb-2">Client :</p>
                      <div className="space-y-1">
                        {(order.customerName || order.shippingAddress?.firstName || order.shippingAddress?.lastName) && (
                          <p className="text-white font-medium">
                            {order.customerName || 
                             `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim() || 
                             'Non renseigné'}
                          </p>
                        )}
                        {order.customerEmail && (
                          <p className="text-gray-300">{order.customerEmail}</p>
                        )}
                        {order.customerPhone && (
                          <p className="text-gray-300 text-xs">{order.customerPhone}</p>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-3"></div>

                    {/* État du paiement */}
                    <div>
                      <p className="text-gray-400 mb-2">État du paiement :</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getPaymentStatusColor(order.status)}`}>
                        {getPaymentStatusLabel(order.status)}
                      </span>
                    </div>

                    {/* Montant */}
                    <div>
                      <p className="text-gray-400 mb-1">Montant total :</p>
                      <p className="text-white font-semibold">{formatCurrency(order.totalCents, order.currency)}</p>
                    </div>

                    {/* Adresse de livraison */}
                    {order.shippingAddress && (
                      <div className="pt-3 border-t border-white/10">
                        <p className="text-gray-400 mb-2 font-semibold">Adresse de livraison :</p>
                        <div className="text-gray-300 space-y-1">
                          {(order.shippingAddress.firstName || order.shippingAddress.lastName) && (
                            <p className="text-white font-medium">
                              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                            </p>
                          )}
                          {order.shippingAddress.address && (
                            <p>{order.shippingAddress.address}</p>
                          )}
                          {(order.shippingAddress.city || order.shippingAddress.postalCode) && (
                            <p>
                              {order.shippingAddress.postalCode} {order.shippingAddress.city}
                            </p>
                          )}
                          {order.shippingAddress.country && (
                            <p className="font-medium">{order.shippingAddress.country}</p>
                          )}
                          {order.shippingAddress.phone && (
                            <p className="text-xs text-gray-400 mt-1">Tél: {order.shippingAddress.phone}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Numéro de suivi */}
                    {order.trackingNumber && (
                      <div className="pt-3 border-t border-white/10">
                        <p className="text-gray-400 mb-1">Numéro de suivi :</p>
                        <p className="text-white font-mono">{order.trackingNumber}</p>
                      </div>
                    )}

                    {/* Statut livraison */}
                    {order.shippingStatus && (
                      <div>
                        <p className="text-gray-400 mb-1">Statut livraison :</p>
                        <p className="text-white">{order.shippingStatus}</p>
                      </div>
                    )}

                    {/* Articles */}
                    {order.items && order.items.length > 0 && (
                      <div className="pt-3 border-t border-white/10">
                        <p className="text-gray-400 mb-2 font-semibold">Articles :</p>
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <p key={idx} className="text-xs text-gray-300">
                              {item.name} x{item.quantity} - {formatCurrency(item.priceCents * item.quantity, order.currency)}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col md:flex-row md:justify-between md:items-center gap-3 pt-6 border-t border-white/10">
              <div className="text-xs text-gray-500">
                <p>
                  Une notification d'expédition est envoyée automatiquement lorsqu'un statut passe à « Expédiée ».
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-gold px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FontAwesomeIcon icon={faCheckCircle} />
                  Mettre à jour
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}

