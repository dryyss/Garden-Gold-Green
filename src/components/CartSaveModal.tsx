'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSave, faBookmark, faDownload } from '@fortawesome/free-solid-svg-icons'
import { useCart } from '@/contexts/CartContext'

interface CartSaveModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSaveModal({ isOpen, onClose }: CartSaveModalProps) {
  const { state } = useCart()
  const [saveName, setSaveName] = useState('')
  const [savedCarts, setSavedCarts] = useState<any[]>([])

  // Charger les paniers sauvegardés depuis localStorage
  useState(() => {
    const saved = localStorage.getItem('savedCarts')
    if (saved) {
      setSavedCarts(JSON.parse(saved))
    }
  })

  const handleSaveCart = () => {
    if (!saveName.trim()) return

    const cartData = {
      id: Date.now().toString(),
      name: saveName,
      items: state.items,
      totalItems: state.totalItems,
      totalPrice: state.totalPrice,
      savedAt: new Date().toISOString()
    }

    const updatedSavedCarts = [...savedCarts, cartData]
    setSavedCarts(updatedSavedCarts)
    localStorage.setItem('savedCarts', JSON.stringify(updatedSavedCarts))
    
    setSaveName('')
    onClose()
  }

  const handleLoadCart = (cartId: string) => {
    const cartToLoad = savedCarts.find(cart => cart.id === cartId)
    if (cartToLoad) {
      // Ici, vous pourriez dispatcher une action pour charger le panier
      // dispatch({ type: 'LOAD_SAVED_CART', payload: cartToLoad.items })
      onClose()
    }
  }

  const handleDeleteSavedCart = (cartId: string) => {
    const updatedSavedCarts = savedCarts.filter(cart => cart.id !== cartId)
    setSavedCarts(updatedSavedCarts)
    localStorage.setItem('savedCarts', JSON.stringify(updatedSavedCarts))
  }

  const exportCart = () => {
    const cartData = {
      items: state.items,
      totalItems: state.totalItems,
      totalPrice: state.totalPrice,
      exportedAt: new Date().toISOString()
    }

    const dataStr = JSON.stringify(cartData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `panier-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    
    URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-black rounded-xl p-6 w-full max-w-md border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center">
            <FontAwesomeIcon icon={faBookmark} className="mr-2 text-brand-gold" />
            Sauvegarder le panier
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Sauvegarder un nouveau panier */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nom du panier
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Ex: Panier CBD huiles"
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-brand-gold"
            />
            <button
              onClick={handleSaveCart}
              disabled={!saveName.trim()}
              className="btn-gold text-black font-semibold px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>

        {/* Paniers sauvegardés */}
        {savedCarts.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-300 mb-3">
              Paniers sauvegardés ({savedCarts.length})
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {savedCarts.map((cart) => (
                <div key={cart.id} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{cart.name}</p>
                    <p className="text-sm text-gray-400">
                      {cart.totalItems} articles • {cart.totalPrice.toFixed(2)} €
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(cart.savedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleLoadCart(cart.id)}
                      className="text-brand-gold hover:text-brand-gold/80 transition-colors p-1"
                      title="Charger ce panier"
                    >
                      <FontAwesomeIcon icon={faBookmark} className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleDeleteSavedCart(cart.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-1"
                      title="Supprimer"
                    >
                      <FontAwesomeIcon icon={faTimes} className="text-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={exportCart}
            className="flex-1 bg-white/10 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Exporter
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSave, faBookmark, faDownload } from '@fortawesome/free-solid-svg-icons'
import { useCart } from '@/contexts/CartContext'

interface CartSaveModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSaveModal({ isOpen, onClose }: CartSaveModalProps) {
  const { state } = useCart()
  const [saveName, setSaveName] = useState('')
  const [savedCarts, setSavedCarts] = useState<any[]>([])

  // Charger les paniers sauvegardés depuis localStorage
  useState(() => {
    const saved = localStorage.getItem('savedCarts')
    if (saved) {
      setSavedCarts(JSON.parse(saved))
    }
  })

  const handleSaveCart = () => {
    if (!saveName.trim()) return

    const cartData = {
      id: Date.now().toString(),
      name: saveName,
      items: state.items,
      totalItems: state.totalItems,
      totalPrice: state.totalPrice,
      savedAt: new Date().toISOString()
    }

    const updatedSavedCarts = [...savedCarts, cartData]
    setSavedCarts(updatedSavedCarts)
    localStorage.setItem('savedCarts', JSON.stringify(updatedSavedCarts))
    
    setSaveName('')
    onClose()
  }

  const handleLoadCart = (cartId: string) => {
    const cartToLoad = savedCarts.find(cart => cart.id === cartId)
    if (cartToLoad) {
      // Ici, vous pourriez dispatcher une action pour charger le panier
      // dispatch({ type: 'LOAD_SAVED_CART', payload: cartToLoad.items })
      onClose()
    }
  }

  const handleDeleteSavedCart = (cartId: string) => {
    const updatedSavedCarts = savedCarts.filter(cart => cart.id !== cartId)
    setSavedCarts(updatedSavedCarts)
    localStorage.setItem('savedCarts', JSON.stringify(updatedSavedCarts))
  }

  const exportCart = () => {
    const cartData = {
      items: state.items,
      totalItems: state.totalItems,
      totalPrice: state.totalPrice,
      exportedAt: new Date().toISOString()
    }

    const dataStr = JSON.stringify(cartData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `panier-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    
    URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-black rounded-xl p-6 w-full max-w-md border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center">
            <FontAwesomeIcon icon={faBookmark} className="mr-2 text-brand-gold" />
            Sauvegarder le panier
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Sauvegarder un nouveau panier */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nom du panier
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Ex: Panier CBD huiles"
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-brand-gold"
            />
            <button
              onClick={handleSaveCart}
              disabled={!saveName.trim()}
              className="btn-gold text-black font-semibold px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>

        {/* Paniers sauvegardés */}
        {savedCarts.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-300 mb-3">
              Paniers sauvegardés ({savedCarts.length})
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {savedCarts.map((cart) => (
                <div key={cart.id} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{cart.name}</p>
                    <p className="text-sm text-gray-400">
                      {cart.totalItems} articles • {cart.totalPrice.toFixed(2)} €
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(cart.savedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleLoadCart(cart.id)}
                      className="text-brand-gold hover:text-brand-gold/80 transition-colors p-1"
                      title="Charger ce panier"
                    >
                      <FontAwesomeIcon icon={faBookmark} className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleDeleteSavedCart(cart.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-1"
                      title="Supprimer"
                    >
                      <FontAwesomeIcon icon={faTimes} className="text-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={exportCart}
            className="flex-1 bg-white/10 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Exporter
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}
