'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faShoppingCart, 
  faTrash, 
  faPlus, 
  faMinus, 
  faArrowLeft,
  faCreditCard,
  faUser,
  faHeart,
  faShare,
  faGift,
  faShield,
  faTruck
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import Image from 'next/image'
import { QuantitySelector } from '@/components/QuantitySelector'
import { AddToCartButton } from '@/components/AddToCartButton'
import { ProductRecommendations } from '@/components/ProductRecommendations'
import { CartSaveModal } from '@/components/CartSaveModal'
import { Breadcrumb } from '@/components/Breadcrumb'
import { ImageWithLoading } from '@/components/ImageWithLoading'
import productsData from '@/data/products.json'

export default function CartPage() {
  const { state, dispatch } = useCart()
  const authContext = useAuth()
  const authState = authContext?.state || { isAuthenticated: false }
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  
  // Calculer le total
  const subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  const shipping = subtotal > 100 ? 0 : 9.90
  const tax = subtotal * 0.2 // TVA 20%
  const total = subtotal + shipping + tax

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: itemId })
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity: newQuantity } })
    }
  }

  const handleRemoveItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const handleAddToFavorites = (itemId: string) => {
    if (!authState?.isAuthenticated) {
      // Rediriger vers la page de connexion
      window.location.href = '/auth'
      return
    }
    
    // Logique pour ajouter aux favoris (à implémenter)
    const item = state.items.find(item => item.id === itemId)
    console.log('Ajouter aux favoris:', item?.name)
    // TODO: Implémenter la logique de favoris
  }

  const handleShare = (itemId: string) => {
    const item = state.items.find(item => item.id === itemId)
    const shareData = {
      title: item?.name,
      text: `Découvrez ${item?.name} sur Garden Gold Green`,
      url: `${window.location.origin}/products/${itemId}`
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      // Fallback: copier l'URL dans le presse-papiers
      navigator.clipboard.writeText(shareData.url)
      alert('Lien copié dans le presse-papiers !')
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-black pt-24">
        <div className="container mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <Breadcrumb 
            items={[
              { label: 'Boutique', href: '/products' },
              { label: 'Panier' }
            ]}
            className="mb-6"
          />

          {/* Header */}
          <div className="flex items-center mb-8">
            <Link 
              href="/products" 
              className="text-gray-400 hover:text-brand-gold transition-colors mr-4"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
            </Link>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <FontAwesomeIcon icon={faShoppingCart} className="mr-3 text-brand-gold" />
              Panier
            </h1>
          </div>

          {/* Panier vide */}
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-8 bg-white/5 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faShoppingCart} className="text-6xl text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Votre panier est vide</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Découvrez notre sélection de produits CBD premium et trouvez ce qui vous convient le mieux.
            </p>
            <Link 
              href="/products"
              className="btn-gold text-black font-semibold py-3 px-8 rounded-full shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 inline-flex items-center"
            >
              Découvrir nos produits
            </Link>
          </div>

          {/* Produits recommandés */}
          <ProductRecommendations 
            currentCartItems={state.items}
            title="Vous pourriez aussi aimer"
            maxItems={4}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-black pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: 'Boutique', href: '/products' },
            { label: 'Panier' }
          ]}
          className="mb-6"
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link 
              href="/products" 
              className="text-gray-400 hover:text-brand-gold transition-colors mr-4"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
            </Link>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <FontAwesomeIcon icon={faShoppingCart} className="mr-3 text-brand-gold" />
              Panier ({state.totalItems})
            </h1>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setIsSaveModalOpen(true)}
              className="text-brand-gold hover:text-brand-gold/80 transition-colors flex items-center"
            >
              <FontAwesomeIcon icon={faGift} className="mr-2" />
              Sauvegarder
            </button>
            <button
              onClick={clearCart}
              className="text-red-400 hover:text-red-300 transition-colors flex items-center"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2" />
              Vider le panier
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des produits */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors">
                  <div className="flex items-center space-x-4">
                    {/* Image du produit */}
                    <div className="w-20 h-20 relative flex-shrink-0">
                      <ImageWithLoading
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>

                    {/* Détails du produit */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white mb-1 line-clamp-2">{item.name}</h3>
                      <p className="text-brand-gold font-bold text-lg">
                        {item.price.toFixed(2)} €
                      </p>
                      {item.cbdPercent && (
                        <p className="text-sm text-gray-400">
                          CBD {item.cbdPercent}%
                        </p>
                      )}
                    </div>

                    {/* Sélecteur de quantité */}
                    <div className="flex items-center space-x-3">
                      <QuantitySelector
                        quantity={item.quantity}
                        onQuantityChange={(newQuantity) => handleQuantityChange(item.id, newQuantity)}
                        min={1}
                        max={99}
                      />
                    </div>

                    {/* Prix total et actions */}
                    <div className="text-right">
                      <p className="text-white font-bold text-lg mb-2">
                        {(item.price * item.quantity).toFixed(2)} €
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-400 hover:text-red-300 transition-colors p-1"
                          title="Supprimer"
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-sm" />
                        </button>
                        <button 
                          onClick={() => handleAddToFavorites(item.id)}
                          className="text-gray-400 hover:text-brand-gold transition-colors p-1" 
                          title="Ajouter aux favoris"
                        >
                          <FontAwesomeIcon icon={faHeart} className="text-sm" />
                        </button>
                        <button 
                          onClick={() => handleShare(item.id)}
                          className="text-gray-400 hover:text-brand-gold transition-colors p-1" 
                          title="Partager"
                        >
                          <FontAwesomeIcon icon={faShare} className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Code promo */}
            <div className="mt-8 bg-gradient-to-r from-brand-gold/10 to-brand-green/10 rounded-xl p-6 border border-brand-gold/20">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <FontAwesomeIcon icon={faGift} className="mr-2 text-brand-gold" />
                Code promo
              </h3>
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Entrez votre code promo"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-brand-gold"
                />
                <button className="btn-gold text-black font-semibold px-6 py-2 rounded-lg">
                  Appliquer
                </button>
              </div>
            </div>
          </div>

          {/* Résumé de commande */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 rounded-xl p-6 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-6">Résumé de commande</h3>
              
              {/* Détails des prix */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Sous-total ({state.totalItems} articles)</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Livraison</span>
                  <span className={shipping === 0 ? 'text-brand-green' : ''}>
                    {shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)} €`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>TVA (20%)</span>
                  <span>{tax.toFixed(2)} €</span>
                </div>
                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between text-xl font-bold text-white">
                    <span>Total</span>
                    <span className="text-brand-gold">{total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              {/* Avantages */}
              <div className="space-y-2 mb-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faShield} className="mr-2 text-brand-green" />
                  <span>Paiement sécurisé</span>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faTruck} className="mr-2 text-brand-gold" />
                  <span>Livraison rapide</span>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faGift} className="mr-2 text-brand-green" />
                  <span>Retour gratuit sous 30 jours</span>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="space-y-3">
                {authState.isAuthenticated ? (
                  <Link
                    href="/checkout"
                    className="w-full btn-gold text-black font-semibold py-3 px-6 rounded-lg shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                    Commander maintenant
                  </Link>
                ) : (
                  <Link
                    href="/auth"
                    className="w-full bg-brand-green text-white font-semibold py-3 px-6 rounded-lg hover:bg-brand-green/90 transition-colors flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Se connecter pour commander
                  </Link>
                )}
                
                <Link
                  href="/products"
                  className="w-full bg-white/10 text-white font-semibold py-3 px-6 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center"
                >
                  Continuer mes achats
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Produits recommandés */}
        <ProductRecommendations 
          currentCartItems={state.items}
          title="Vous pourriez aussi aimer"
          maxItems={4}
        />
      </div>

      {/* Modal de sauvegarde */}
      <CartSaveModal 
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
      />
    </div>
  )
}