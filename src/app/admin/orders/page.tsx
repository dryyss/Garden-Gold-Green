"use client"

import { useEffect, useMemo, useState } from 'react'
import { AdminGuard } from '@/components/AdminGuard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBox,
  faCheckCircle,
  faClock,
  faPaperPlane,
  faRefresh,
  faSearch,
  faTruck,
  faUser,
} from '@fortawesome/free-solid-svg-icons'

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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [forms, setForms] = useState<Record<string, FormState>>({})
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/orders/admin?limit=100')
        const data = await res.json()
        if (data.success) {
          setOrders(data.orders)
          setFilteredOrders(data.orders)
          const initialForms: Record<string, FormState> = {}
          data.orders.forEach((order: Order) => {
            initialForms[order.id] = {
              status: order.status,
              trackingNumber: order.trackingNumber || '',
              carrier: order.carrier || '',
              carrierTrackingUrl: order.carrierTrackingUrl || '',
              shippingStatus: order.shippingStatus || '',
              shippedAt: formatDateInput(order.shippedAt),
              deliveredAt: formatDateInput(order.deliveredAt),
              estimatedDeliveryDate: formatDateInput(order.estimatedDeliveryDate),
              historyStatus: '',
              historyMessage: '',
            }
          })
          setForms(initialForms)
        }
      } catch (error) {
        console.error('Erreur chargement commandes admin:', error)
        setMessage("Impossible de charger les commandes.")
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  useEffect(() => {
    const lower = search.toLowerCase()
    const result = orders.filter(order => {
      const matchesSearch =
        !lower ||
        order.id.toLowerCase().includes(lower) ||
        (order.customerEmail?.toLowerCase().includes(lower) ?? false) ||
        (order.customerName?.toLowerCase().includes(lower) ?? false)
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter
      return matchesSearch && matchesStatus
    })
    setFilteredOrders(result)
  }, [orders, search, statusFilter])

  const handleInputChange = (orderId: string, field: keyof FormState, value: string) => {
    setForms(prev => ({
      ...prev,
      [orderId]: {
        ...(prev[orderId] || emptyFormState),
        [field]: value,
      },
    }))
  }

  const handleResetHistory = (orderId: string) => {
    setForms(prev => ({
      ...prev,
      [orderId]: {
        ...(prev[orderId] || emptyFormState),
        historyStatus: '',
        historyMessage: '',
      },
    }))
  }

  const handleSave = async (order: Order) => {
    const form = forms[order.id] || emptyFormState
    setIsLoading(true)
    setMessage(null)

    try {
      const payload: Record<string, unknown> = {
        orderId: order.id,
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

      setOrders(prev => prev.map(current => (current.id === updatedOrder.id ? updatedOrder : current)))
      setMessage('Commande mise à jour avec succès.')
      handleResetHistory(order.id)
    } catch (error) {
      console.error('Erreur mise à jour commande:', error)
      setMessage(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setIsLoading(false)
    }
  }

  const shippingTimeline = (order: Order) => {
    return sortHistory(order.shippingHistory || []).map((entry, index) => (
      <div key={`${order.id}-history-${index}`} className="relative pl-8 pb-6">
        <span className="absolute left-0 top-1 flex h-4 w-4 -translate-x-1/2 items-center justify-center">
          <span className="h-3 w-3 rounded-full bg-brand-gold"></span>
        </span>
        <p className="text-sm text-white font-medium">{entry.status}</p>
        <p className="text-xs text-gray-400">{new Date(entry.date).toLocaleString('fr-FR')}</p>
        {entry.message && <p className="text-sm text-gray-300 mt-1">{entry.message}</p>}
      </div>
    ))
  }

  const totalOrders = useMemo(() => filteredOrders.length, [filteredOrders])

  return (
    <AdminGuard>
      <div className="min-h-screen bg-brand-black text-white pt-24 pb-16">
        <div className="container mx-auto px-6">
          <header className="mb-10">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <FontAwesomeIcon icon={faTruck} className="text-brand-gold" />
              Gestion des expéditions
            </h1>
            <p className="text-gray-400 max-w-2xl">
              Consultez et mettez à jour le suivi des commandes. Ajoutez un numéro de suivi, un
              transporteur, un statut d’expédition et des notes d’historique pour informer vos clients en
              temps réel.
            </p>
          </header>

          <section className="card-bg rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Rechercher</label>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    placeholder="Commande, email, client…"
                    className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Statut</label>
                <select
                  value={statusFilter}
                  onChange={event => setStatusFilter(event.target.value)}
                  className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-brand-gold"
                >
                  <option value="all">Tous les statuts</option>
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <div className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-300 flex items-center gap-2">
                  <FontAwesomeIcon icon={faBox} />
                  <span>
                    {totalOrders} commande{totalOrders > 1 ? 's' : ''} affichée{totalOrders > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </section>

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

          <div className="space-y-6">
            {filteredOrders.map(order => {
              const form = forms[order.id] || emptyFormState
              return (
                <div key={order.id} className="card-bg rounded-2xl p-6 border border-white/5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Commande</p>
                      <p className="text-xl font-semibold">{order.id}</p>
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
                          onChange={event => handleInputChange(order.id, 'status', event.target.value)}
                          className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-brand-gold"
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
                          onChange={event => handleInputChange(order.id, 'carrier', event.target.value)}
                          className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-brand-gold"
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
                          onChange={event => handleInputChange(order.id, 'trackingNumber', event.target.value)}
                          placeholder="6A1234567890"
                          className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-brand-gold"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Sera inclus automatiquement dans l’email d’expédition.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Lien de suivi</label>
                        <input
                          value={form.carrierTrackingUrl}
                          onChange={event => handleInputChange(order.id, 'carrierTrackingUrl', event.target.value)}
                          placeholder="https://…"
                          className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Statut d’expédition</label>
                        <input
                          value={form.shippingStatus}
                          onChange={event => handleInputChange(order.id, 'shippingStatus', event.target.value)}
                          placeholder="En transit, En préparation…"
                          className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-brand-gold"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Date d’expédition</label>
                          <input
                            type="datetime-local"
                            value={form.shippedAt}
                            onChange={event => handleInputChange(order.id, 'shippedAt', event.target.value)}
                            className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-brand-gold"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Date de livraison</label>
                          <input
                            type="datetime-local"
                            value={form.deliveredAt}
                            onChange={event => handleInputChange(order.id, 'deliveredAt', event.target.value)}
                            className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-brand-gold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Livraison estimée</label>
                        <input
                          type="datetime-local"
                          value={form.estimatedDeliveryDate}
                          onChange={event => handleInputChange(order.id, 'estimatedDeliveryDate', event.target.value)}
                          className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-brand-gold"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Nouvelle étape de suivi</label>
                        <input
                          value={form.historyStatus}
                          onChange={event => handleInputChange(order.id, 'historyStatus', event.target.value)}
                          placeholder="Ex: Colis arrivé en agence locale"
                          className="w-full px-4 py-2 mb-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-brand-gold"
                        />
                        <textarea
                          value={form.historyMessage}
                          onChange={event => handleInputChange(order.id, 'historyMessage', event.target.value)}
                          placeholder="Message optionnel"
                          rows={2}
                          className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-brand-gold"
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            type="button"
                            onClick={() => handleResetHistory(order.id)}
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
                          Historique d’expédition
                        </h3>
                        <div className="relative">
                          <div className="absolute left-1 top-1 bottom-4 w-px bg-white/10" />
                          <div className="space-y-4 pl-2">
                            {shippingTimeline(order)}
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
                        <p className="text-sm text-gray-300">
                          Montant : {formatCurrency(order.totalCents, order.currency)}
                        </p>
                        {order.trackingNumber && (
                          <p className="text-sm text-gray-300">
                            Suivi : <span className="font-mono">{order.trackingNumber}</span>
                          </p>
                        )}
                        {order.shippingStatus && (
                          <p className="text-sm text-gray-300">
                            Statut livraison : {order.shippingStatus}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                    <div className="text-xs text-gray-500">
                      <p>Une notification d’expédition est envoyée automatiquement lorsqu’un statut passe à « Expédiée ».</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleSave(order)}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 rounded-lg bg-brand-gold px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FontAwesomeIcon icon={faCheckCircle} />
                        Mettre à jour
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}

            {filteredOrders.length === 0 && !isLoading && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-gray-400">
                Aucune commande ne correspond aux filtres sélectionnés.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}
