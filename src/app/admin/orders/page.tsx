"use client"

import { useEffect, useMemo, useState, useCallback } from 'react'
import Link from 'next/link'
import { AdminGuard } from '@/components/AdminGuard'
import { Breadcrumb } from '@/components/Breadcrumb'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBox,
  faEye,
  faRefresh,
  faSearch,
  faTruck,
} from '@fortawesome/free-solid-svg-icons'

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
  shippingHistory?: Array<{ date: string; status: string; message?: string }>
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


export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(false)

  const loadOrders = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/orders/admin?limit=100')
      const data = await res.json()
      if (data.success) {
        setOrders(data.orders || [])
        setFilteredOrders(data.orders || [])
      } else {
        console.error('Erreur chargement commandes admin:', data.error)
        // Afficher un message d'erreur si nécessaire
        if (data.error) {
          console.warn('⚠️', data.details || data.error)
        }
        setOrders([])
        setFilteredOrders([])
      }
    } catch (error) {
      console.error('Erreur chargement commandes admin:', error)
      setOrders([])
      setFilteredOrders([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  // Recharger les commandes toutes les 30 secondes pour avoir des données à jour
  useEffect(() => {
    const interval = setInterval(() => {
      loadOrders()
    }, 30000) // 30 secondes

    return () => clearInterval(interval)
  }, [loadOrders])

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-400/20 text-green-400'
      case 'shipped':
        return 'bg-blue-400/20 text-blue-400'
      case 'processing':
        return 'bg-yellow-400/20 text-yellow-400'
      case 'paid':
        return 'bg-purple-400/20 text-purple-400'
      case 'cancelled':
      case 'refunded':
        return 'bg-red-400/20 text-red-400'
      default:
        return 'bg-gray-400/20 text-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status)
    return option ? option.label : status
  }

  const totalOrders = useMemo(() => filteredOrders.length, [filteredOrders])

  return (
    <AdminGuard>
      <div className="min-h-screen bg-brand-black text-white pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <Breadcrumb 
            items={[
              { label: 'Admin', href: '/admin' },
              { label: 'Commandes', href: '/admin/orders' }
            ]}
          />

          <header className="mb-6 sm:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-3 sm:mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 sm:gap-3">
                <FontAwesomeIcon icon={faTruck} className="text-brand-gold" />
                <span className="text-xl sm:text-3xl">Gestion des expéditions</span>
              </h1>
              <button
                onClick={loadOrders}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-gold/20 text-brand-gold hover:bg-brand-gold/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                title="Actualiser les commandes"
              >
                <FontAwesomeIcon 
                  icon={faRefresh} 
                  className={isLoading ? 'animate-spin' : ''} 
                />
                <span className="hidden sm:inline">Actualiser</span>
                <span className="sm:hidden">Rafraîchir</span>
              </button>
            </div>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl">
              Consultez et mettez à jour le suivi des commandes. Ajoutez un numéro de suivi, un
              transporteur, un statut d'expédition et des notes d'historique pour informer vos clients en
              temps réel.
            </p>
          </header>

          <section className="card-bg rounded-2xl p-4 sm:p-6 mb-8">
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


          {isLoading && (
            <div className="mb-6 rounded-lg border border-white/10 bg-black/40 px-4 py-4 flex items-center gap-3">
              <FontAwesomeIcon icon={faRefresh} className="animate-spin text-brand-gold" />
              <span>Chargement des commandes…</span>
            </div>
          )}

          {/* Version desktop : tableau */}
          <div className="hidden lg:block card-bg rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-4 xl:px-6 py-4 text-left text-gray-400 font-medium text-sm xl:text-base">Commande</th>
                    <th className="px-4 xl:px-6 py-4 text-left text-gray-400 font-medium text-sm xl:text-base">Client</th>
                    <th className="px-4 xl:px-6 py-4 text-left text-gray-400 font-medium text-sm xl:text-base">Date</th>
                    <th className="px-4 xl:px-6 py-4 text-left text-gray-400 font-medium text-sm xl:text-base">Statut</th>
                    <th className="px-4 xl:px-6 py-4 text-left text-gray-400 font-medium text-sm xl:text-base">Montant</th>
                    <th className="px-4 xl:px-6 py-4 text-left text-gray-400 font-medium text-sm xl:text-base">Suivi</th>
                    <th className="px-4 xl:px-6 py-4 text-left text-gray-400 font-medium text-sm xl:text-base">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 && !isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                        Aucune commande ne correspond aux filtres sélectionnés.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => (
                      <tr key={order.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                        <td className="px-4 xl:px-6 py-4">
                          <p className="text-white font-medium text-sm xl:text-base">{generateOrderNumber(order.id, order.createdAt)}</p>
                          {!order.id.startsWith('CMD-') && (
                            <p className="text-gray-500 font-mono text-xs mt-1">ID: {order.id}</p>
                          )}
                        </td>
                        <td className="px-4 xl:px-6 py-4">
                          <div>
                            <p className="text-white text-sm xl:text-base">{order.customerName || 'Client'}</p>
                            {order.customerEmail && (
                              <p className="text-gray-400 text-xs xl:text-sm break-all">{order.customerEmail}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 xl:px-6 py-4 text-gray-300 text-xs xl:text-sm">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="px-4 xl:px-6 py-4">
                          <span className={`px-2 xl:px-3 py-1 rounded-full text-xs xl:text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="px-4 xl:px-6 py-4 text-white font-semibold text-sm xl:text-base">
                          {formatCurrency(order.totalCents, order.currency)}
                        </td>
                        <td className="px-4 xl:px-6 py-4">
                          {order.trackingNumber ? (
                            <span className="text-gray-300 font-mono text-xs xl:text-sm break-all">{order.trackingNumber}</span>
                          ) : (
                            <span className="text-gray-500 text-xs xl:text-sm">—</span>
                          )}
                        </td>
                        <td className="px-4 xl:px-6 py-4">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex items-center gap-1 xl:gap-2 px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg bg-brand-gold/20 text-brand-gold hover:bg-brand-gold/30 transition-colors text-xs xl:text-sm font-medium"
                          >
                            <FontAwesomeIcon icon={faEye} />
                            <span className="hidden xl:inline">Voir détails</span>
                            <span className="xl:hidden">Voir</span>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Version mobile : cartes */}
          <div className="lg:hidden space-y-4">
            {filteredOrders.length === 0 && !isLoading ? (
              <div className="card-bg rounded-xl p-8 text-center text-gray-400">
                Aucune commande ne correspond aux filtres sélectionnés.
              </div>
            ) : (
              filteredOrders.map(order => (
                <div key={order.id} className="card-bg rounded-xl p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white font-semibold text-base">{generateOrderNumber(order.id, order.createdAt)}</p>
                      {order.customerName && (
                        <p className="text-gray-300 text-sm mt-1">{order.customerName}</p>
                      )}
                      {order.customerEmail && (
                        <p className="text-gray-400 text-xs mt-1 break-all">{order.customerEmail}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs">Date</p>
                      <p className="text-gray-300">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Montant</p>
                      <p className="text-white font-semibold">{formatCurrency(order.totalCents, order.currency)}</p>
                    </div>
                  </div>

                  {order.trackingNumber && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Suivi</p>
                      <p className="text-gray-300 font-mono text-sm break-all">{order.trackingNumber}</p>
                    </div>
                  )}

                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="block w-full text-center py-2 rounded-lg bg-brand-gold/20 text-brand-gold hover:bg-brand-gold/30 transition-colors text-sm font-medium"
                  >
                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                    Voir détails
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}
