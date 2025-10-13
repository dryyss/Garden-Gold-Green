'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faArrowLeft, 
  faCheckCircle, 
  faTruck, 
  faUndo,
  faCalendarAlt,
  faBox
} from '@fortawesome/free-solid-svg-icons'
import { ReturnRequest } from '@/components/ReturnRequest'

interface OrderItem {
  id: string
  productName: string
  quantity: number
  price: number
  image: string
  orderDate: string
  deliveryDate: string
  canReturn: boolean
}

interface Order {
  id: string
  status: string
  total: number
  items: OrderItem[]
  orderDate: string
  deliveryDate?: string
}

export default function OrderDetailPage() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showReturnForm, setShowReturnForm] = useState(false)

  useEffect(() => {
    fetchOrder()
  }, [params.id])

  const fetchOrder = async () => {
    try {
      // Simuler un appel API
      const mockOrder: Order = {
        id: params.id as string,
        status: 'delivered',
        total: 89.97,
        items: [
          {
            id: 'item-1',
            productName: 'Huile CBD 10% - Premium',
            quantity: 1,
            price: 49.99,
            image: '/logo.png',
            orderDate: '2024-01-15',
            deliveryDate: '2024-01-18',
            canReturn: true
          },
          {
            id: 'item-2',
            productName: 'Fleur CBD - Amnesia Haze',
            quantity: 2,
            price: 39.98,
            image: '/logo.png',
            orderDate: '2024-01-15',
            deliveryDate: '2024-01-18',
            canReturn: true
          }
        ],
        orderDate: '2024-01-15',
        deliveryDate: '2024-01-18'
      }
      
      setOrder(mockOrder)
    } catch (error) {
      console.error('Erreur lors du chargement de la commande:', error)
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
      default:
        return <FontAwesomeIcon icon={faBox} className="text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Livrée'
      case 'shipped':
        return 'Expédiée'
      case 'pending':
        return 'En attente'
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement de la commande...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
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
    <main className="min-h-screen bg-black pt-24">
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
              Passée le {new Date(order.orderDate).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations de la commande */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statut */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Statut de la commande</h2>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.status)}
                  <span className="text-white font-medium">
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
              
              {order.deliveryDate && (
                <div className="flex items-center text-gray-400">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  <span>Livrée le {new Date(order.deliveryDate).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
            </div>

            {/* Articles */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Articles commandés</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      width={60}
                      height={60}
                      className="object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{item.productName}</h3>
                      <p className="text-gray-400">Quantité: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">
                        {(item.price * item.quantity).toFixed(2)}€
                      </p>
                      {item.canReturn && (
                        <span className="text-xs text-brand-green">
                          Retour possible
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bouton de retour */}
            {order.status === 'delivered' && order.items.some(item => item.canReturn) && (
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Demande de retour
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Vous avez 14 jours pour demander un retour après la livraison.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowReturnForm(true)}
                    className="btn-outline-gold px-6 py-2 rounded-full flex items-center space-x-2"
                  >
                    <FontAwesomeIcon icon={faUndo} />
                    <span>Demander un retour</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Résumé */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Résumé</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-400">
                  <span>Sous-total</span>
                  <span>{order.total.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Livraison</span>
                  <span>Gratuite</span>
                </div>
                <hr className="border-gray-600" />
                <div className="flex justify-between text-white font-semibold text-lg">
                  <span>Total</span>
                  <span>{order.total.toFixed(2)}€</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/"
                  className="w-full btn-gold py-2 rounded-lg text-center block"
                >
                  Commander à nouveau
                </Link>
                <button className="w-full btn-outline-gold py-2 rounded-lg">
                  Télécharger la facture
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire de retour */}
        {showReturnForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Demande de retour</h2>
                <button
                  onClick={() => setShowReturnForm(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ×
                </button>
              </div>
              <ReturnRequest 
                orderId={order.id}
                items={order.items}
                onReturnRequested={() => setShowReturnForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}