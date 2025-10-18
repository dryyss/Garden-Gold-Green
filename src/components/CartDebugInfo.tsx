'use client'

import { useCart } from '@/contexts/CartContext'

export function CartDebugInfo() {
  const { state } = useCart()

  // Ne s'affiche qu'en mode développement
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs z-50">
      <div className="font-bold mb-2">🐛 Debug Panier</div>
      <div>Items: {state.items.length}</div>
      <div>Total: {state.totalItems}</div>
      <div>Prix: {state.totalPrice.toFixed(2)}€</div>
      <div>Ouvert: {state.isOpen ? 'Oui' : 'Non'}</div>
    </div>
  )
}
