'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faUndo, faCalendarAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons'

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

interface ReturnRequestProps {
  orderId: string
  items: OrderItem[]
  onReturnRequested?: () => void
}

export function ReturnRequest({ orderId, items, onReturnRequested }: ReturnRequestProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [returnReason, setReturnReason] = useState('')
  const [returnType, setReturnType] = useState<'refund' | 'exchange'>('refund')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedItems.length === 0 || !returnReason.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/returns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          items: selectedItems,
          reason: returnReason,
          type: returnType,
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        onReturnRequested?.()
      }
    } catch (error) {
      console.error('Erreur lors de la demande de retour:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const returnableItems = items.filter(item => item.canReturn)
  const totalRefund = selectedItems.reduce((sum, itemId) => {
    const item = items.find(i => i.id === itemId)
    return sum + (item ? item.price * item.quantity : 0)
  }, 0)

  if (isSubmitted) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <FontAwesomeIcon 
          icon={faCheckCircle} 
          className="text-6xl text-brand-green mb-4" 
        />
        <h3 className="text-2xl font-bold text-white mb-2">
          Demande de retour envoyée !
        </h3>
        <p className="text-gray-300 mb-4">
          Votre demande de retour a été transmise à notre équipe. 
          Vous recevrez un email avec les instructions dans les 24h.
        </p>
        <div className="bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-400">
            Numéro de demande : #{orderId}-RETURN
          </p>
        </div>
      </div>
    )
  }

  if (returnableItems.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <FontAwesomeIcon 
          icon={faBox} 
          className="text-4xl text-gray-500 mb-4" 
        />
        <h3 className="text-xl font-bold text-white mb-2">
          Aucun retour possible
        </h3>
        <p className="text-gray-400">
          Les articles de cette commande ne peuvent plus être retournés.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center mb-6">
        <FontAwesomeIcon 
          icon={faUndo} 
          className="text-2xl text-brand-gold mr-3" 
        />
        <h3 className="text-2xl font-bold text-white">
          Demande de retour
        </h3>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Sélection des articles */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-3">
            Articles à retourner
          </h4>
          <div className="space-y-3">
            {returnableItems.map((item) => (
              <div 
                key={item.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedItems.includes(item.id)
                    ? 'border-brand-gold bg-brand-gold/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onClick={() => handleItemSelection(item.id)}
              >
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleItemSelection(item.id)}
                    className="w-4 h-4 text-brand-gold bg-gray-700 border-gray-600 rounded focus:ring-brand-gold"
                  />
                  <img 
                    src={item.image} 
                    alt={item.productName}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h5 className="font-semibold text-white">
                      {item.productName}
                    </h5>
                    <p className="text-sm text-gray-400">
                      Quantité: {item.quantity} • {item.price.toFixed(2)}€
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">
                      Livré le {new Date(item.deliveryDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Type de retour */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-3">
            Type de retour
          </h4>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="refund"
                checked={returnType === 'refund'}
                onChange={(e) => setReturnType(e.target.value as 'refund' | 'exchange')}
                className="w-4 h-4 text-brand-gold bg-gray-700 border-gray-600 focus:ring-brand-gold"
              />
              <span className="ml-2 text-white">Remboursement</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="exchange"
                checked={returnType === 'exchange'}
                onChange={(e) => setReturnType(e.target.value as 'refund' | 'exchange')}
                className="w-4 h-4 text-brand-gold bg-gray-700 border-gray-600 focus:ring-brand-gold"
              />
              <span className="ml-2 text-white">Échange</span>
            </label>
          </div>
        </div>

        {/* Motif du retour */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-white mb-3">
            Motif du retour
          </label>
          <select
            value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
            required
          >
            <option value="">Sélectionnez un motif</option>
            <option value="defective">Produit défectueux</option>
            <option value="wrong_item">Mauvais article reçu</option>
            <option value="not_as_described">Article ne correspond pas à la description</option>
            <option value="changed_mind">Changement d'avis</option>
            <option value="too_small">Taille trop petite</option>
            <option value="too_large">Taille trop grande</option>
            <option value="other">Autre</option>
          </select>
        </div>

        {/* Résumé */}
        {selectedItems.length > 0 && (
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h5 className="font-semibold text-white mb-2">Résumé</h5>
            <p className="text-gray-300">
              {selectedItems.length} article(s) sélectionné(s)
            </p>
            <p className="text-brand-gold font-semibold">
              Montant du remboursement : {totalRefund.toFixed(2)}€
            </p>
          </div>
        )}

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={isSubmitting || selectedItems.length === 0 || !returnReason}
          className="w-full btn-gold py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
        </button>
      </form>
    </div>
  )
}
