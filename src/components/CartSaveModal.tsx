'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faCheck, faSave } from '@fortawesome/free-solid-svg-icons'
import { useCart } from '@/contexts/CartContext'
import { useNotifications } from '@/contexts/NotificationContext'

interface CartSaveModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSaveModal({ isOpen, onClose }: CartSaveModalProps) {
  const { state } = useCart()
  const { addNotification } = useNotifications()
  const [cartName, setCartName] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  if (!isOpen) return null

  const handleSave = async () => {
    if (!cartName.trim()) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Veuillez donner un nom à votre panier',
      })
      return
    }

    setIsSaving(true)

    try {
      // Sauvegarder le panier dans localStorage
      const savedCarts = JSON.parse(localStorage.getItem('garden-gold-green-saved-carts') || '[]')
      
      const newCart = {
        id: Date.now().toString(),
        name: cartName,
        items: state.items,
        savedAt: new Date().toISOString(),
      }

      savedCarts.push(newCart)
      localStorage.setItem('garden-gold-green-saved-carts', JSON.stringify(savedCarts))

      addNotification({
        type: 'success',
        title: 'Panier sauvegardé !',
        message: `"${cartName}" a été sauvegardé avec succès`,
      })

      setCartName('')
      onClose()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de sauvegarder le panier',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="card-bg rounded-2xl p-8 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <FontAwesomeIcon icon={faSave} className="text-brand-gold" />
            Sauvegarder le panier
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <p className="text-gray-400">
            Donnez un nom à votre panier pour le retrouver facilement plus tard.
          </p>

          <div>
            <label htmlFor="cartName" className="block text-sm font-medium text-gray-300 mb-2">
              Nom du panier
            </label>
            <input
              type="text"
              id="cartName"
              value={cartName}
              onChange={(e) => setCartName(e.target.value)}
              placeholder="Ex: Commande mensuelle, Cadeaux Noël..."
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold transition-colors"
              maxLength={50}
            />
            <p className="text-xs text-gray-500 mt-1">
              {cartName.length}/50 caractères
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4">
            <p className="text-sm text-gray-400">
              <strong className="text-white">{state.items.length}</strong> produit{state.items.length > 1 ? 's' : ''} dans ce panier
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !cartName.trim()}
            className="flex-1 btn-gold text-black font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-gold-glow hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Sauvegarde...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCheck} />
                <span>Sauvegarder</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

