'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useAuth0Context } from '@/contexts/Auth0Context'
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
  faTruck,
  faTag,
  faXmark,
  faCheck
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import Image from 'next/image'
import { QuantitySelector } from '@/components/QuantitySelector'
import { AddToCartButton } from '@/components/AddToCartButton'
import { ProductRecommendations } from '@/components/ProductRecommendations'
import { CartSaveModal } from '@/components/CartSaveModal'
import { Breadcrumb } from '@/components/Breadcrumb'
import { ImageWithLoading } from '@/components/ImageWithLoading'
import { CartLoadingGuard } from '@/components/CartLoadingGuard'
import { PaymentMethodSelector } from '@/components/PaymentMethodSelector'

export default function CartPage() {
  return (
    <CartLoadingGuard>
      <CartPageContent />
    </CartLoadingGuard>
  )
}

function CartPageContent() {
  const { state, dispatch } = useCart()
  const authContext = useAuth()
  const authState = authContext?.state || { isAuthenticated: false }
  const { state: auth0State } = useAuth0Context()
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [productImages, setProductImages] = useState<Record<string, string>>({})
  
  // Récupérer les images manquantes depuis l'API
  useEffect(() => {
    const fetchMissingImages = async () => {
      const itemsWithoutImages = state.items.filter(item => !item.image || item.image === '/logo2.png')
      if (itemsWithoutImages.length === 0) return
      
      try {
        const response = await fetch('/api/products/all')
        const data = await response.json()
        if (data.success && data.products) {
          const imagesMap: Record<string, string> = {}
          data.products.forEach((product: any) => {
            let images: string[] = []
            try {
              if (typeof product.images === 'string') {
                images = JSON.parse(product.images)
              } else if (Array.isArray(product.images)) {
                images = product.images
              }
            } catch {
              images = []
            }
            const image = images[0] || '/logo2.png'
            imagesMap[product.id] = image
          })
          setProductImages(imagesMap)
          
          // Mettre à jour les items du panier avec les images manquantes
          const updatedItems = state.items.map(item => {
            if (!item.image || item.image === '/logo2.png') {
              const productImage = imagesMap[item.id] || '/logo2.png'
              return { ...item, image: productImage }
            }
            return item
          })
          
          // Si des images ont été trouvées, mettre à jour le panier
          const hasChanges = updatedItems.some((item, index) => item.image !== state.items[index].image)
          if (hasChanges) {
            dispatch({ type: 'LOAD_CART', payload: updatedItems })
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des images:', error)
      }
    }
    
    fetchMissingImages()
  }, [state.items, dispatch])
  
  // État pour le code promo
  const [promoCodeInput, setPromoCodeInput] = useState('')
  const [isValidatingPromo, setIsValidatingPromo] = useState(false)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [promoSuccess, setPromoSuccess] = useState(false)

  // Calculer le total
  const subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  const shipping = subtotal > 100 ? 0 : 9.90
  const discountAmount = state.discountAmount ? state.discountAmount / 100 : 0 // Convertir centimes en euros
  const total = Math.max(0, subtotal + shipping - discountAmount)

  // Fonction pour appliquer un code promo
  const handleApplyPromo = async () => {
    // Vérifier si l'utilisateur est connecté (via Auth0 ou Auth)
    const isAuthenticated = auth0State.isAuthenticated || authState?.isAuthenticated
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion
      window.location.href = '/auth'
      return
    }

    if (!promoCodeInput.trim()) {
      setPromoError('Veuillez entrer un code promo')
      return
    }

    setIsValidatingPromo(true)
    setPromoError(null)

    try {
      const productIds = state.items.map(item => item.id)
      const cartTotalCents = Math.round(subtotal * 100) // Convertir en centimes

      const response = await fetch('/api/promotions/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoCodeInput.trim().toUpperCase(),
          cartTotal: cartTotalCents,
          productIds
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur de validation' }))
        throw new Error(errorData.error || 'Erreur lors de la validation du code promo')
      }

      const data = await response.json()

      if (data.success) {
        dispatch({
          type: 'APPLY_PROMO',
          payload: {
            code: data.promotion.code,
            discountAmount: data.discountAmount,
            discountType: data.promotion.discountType
          }
        })
        setPromoCodeInput('')
        setPromoError(null)
        setPromoSuccess(true)
        // Masquer le message de succès après 3 secondes
        setTimeout(() => setPromoSuccess(false), 3000)
      } else {
        setPromoError(data.error || 'Code promo invalide')
        setPromoSuccess(false)
      }
    } catch (error) {
      console.error('Erreur validation code promo:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la validation du code promo'
      setPromoError(errorMessage)
      setPromoSuccess(false)
    } finally {
      setIsValidatingPromo(false)
    }
  }

  // Fonction pour retirer le code promo
  const handleRemovePromo = () => {
    dispatch({ type: 'REMOVE_PROMO' })
    setPromoCodeInput('')
    setPromoError(null)
    setPromoSuccess(false)
  }

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
    // Vérifier si l'utilisateur est connecté (via Auth0 ou Auth)
    const isAuthenticated = auth0State.isAuthenticated || authState?.isAuthenticated
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion
      window.location.href = '/auth'
      return
    }
    
    // Logique pour ajouter aux favoris (à implémenter)
    const item = state.items.find(item => item.id === itemId)
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
          <div className="mb-6">
            <Breadcrumb 
              items={[
                { label: 'Boutique', href: '/products' },
                { label: 'Panier' }
              ]}
            />
          </div>

          {/* Header */}
          <div className="flex items-center mb-6 sm:mb-8">
            <Link 
              href="/products" 
              className="text-gray-400 hover:text-brand-gold transition-colors mr-3 sm:mr-4"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-lg sm:text-xl" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center">
              <FontAwesomeIcon icon={faShoppingCart} className="mr-2 sm:mr-3 text-brand-gold text-lg sm:text-xl" />
              Panier
            </h1>
          </div>

          {/* Panier vide */}
          <div className="text-center py-12 sm:py-16">
            <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 bg-white/5 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faShoppingCart} className="text-4xl sm:text-6xl text-gray-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Votre panier est vide</h2>
            <p className="text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base px-4">
              Découvrez notre sélection de produits CBD premium et trouvez ce qui vous convient le mieux.
            </p>
            <Link 
              href="/products"
              className="btn-gold text-black font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 inline-flex items-center text-sm sm:text-base"
            >
              Découvrir nos produits
            </Link>
          </div>

          {/* Produits recommandés */}
          <ProductRecommendations 
            products={[]}
            title="Vous pourriez aussi aimer"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-black pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb 
            items={[
              { label: 'Boutique', href: '/products' },
              { label: 'Panier' }
            ]}
          />
        </div>

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center mb-4 sm:mb-0">
            <Link 
              href="/products" 
              className="text-gray-400 hover:text-brand-gold transition-colors mr-3 sm:mr-4"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-lg sm:text-xl" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center">
              <FontAwesomeIcon icon={faShoppingCart} className="mr-2 sm:mr-3 text-brand-gold text-lg sm:text-xl" />
              Panier ({state.totalItems})
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button
              onClick={() => setIsSaveModalOpen(true)}
              className="text-brand-gold hover:text-brand-gold/80 transition-colors flex items-center justify-center sm:justify-start py-2 px-3 sm:px-0 rounded-lg sm:rounded-none bg-white/5 sm:bg-transparent"
            >
              <FontAwesomeIcon icon={faGift} className="mr-2 text-sm sm:text-base" />
              <span className="text-sm sm:text-base">Sauvegarder</span>
            </button>
            <button
              onClick={clearCart}
              className="text-red-400 hover:text-red-300 transition-colors flex items-center justify-center sm:justify-start py-2 px-3 sm:px-0 rounded-lg sm:rounded-none bg-red-900/20 sm:bg-transparent"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2 text-sm sm:text-base" />
              <span className="text-sm sm:text-base">Vider le panier</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des produits */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="bg-white/5 rounded-xl p-4 sm:p-6 hover:bg-white/10 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    {/* Image du produit */}
                    <div className="w-24 h-24 sm:w-32 sm:h-32 relative flex-shrink-0 mx-auto sm:mx-0 overflow-hidden rounded-lg">
                      {item.slug ? (
                        <Link href={`/products/${item.slug}`} className="block w-full h-full">
                          <ImageWithLoading
                            src={item.image || '/logo2.png'}
                            alt={item.name}
                            fill
                            className="object-cover rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
                          />
                        </Link>
                      ) : (
                        <ImageWithLoading
                          src={item.image || '/logo2.png'}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      )}
                    </div>

                    {/* Détails du produit */}
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <h3 className="font-semibold text-white mb-1 line-clamp-2 text-sm sm:text-base">
                        {item.slug ? (
                          <Link 
                            href={`/products/${item.slug}`}
                            className="hover:text-brand-gold transition-colors"
                          >
                            {item.name}
                          </Link>
                        ) : (
                          item.name
                        )}
                      </h3>
                      <p className="text-brand-gold font-bold text-base sm:text-lg">
                        {item.price.toFixed(2)} €
                      </p>
                      {item.cbdPercent && (
                        <p className="text-xs sm:text-sm text-gray-400">
                          CBD {item.cbdPercent}%
                        </p>
                      )}
                    </div>

                    {/* Sélecteur de quantité et prix total */}
                    <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                      <div className="flex items-center space-x-3">
                        <QuantitySelector
                          quantity={item.quantity}
                          onQuantityChange={(newQuantity) => handleQuantityChange(item.id, newQuantity)}
                          min={1}
                          max={99}
                        />
                      </div>

                      {/* Prix total et actions */}
                      <div className="text-center sm:text-right">
                        <p className="text-white font-bold text-base sm:text-lg mb-2">
                          {(item.price * item.quantity).toFixed(2)} €
                        </p>
                        <div className="flex justify-center sm:justify-end space-x-2">
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
                </div>
              ))}
            </div>

            {/* Code promo */}
            <div className="mt-6 sm:mt-8 bg-gradient-to-r from-brand-gold/10 to-brand-green/10 rounded-xl p-4 sm:p-6 border border-brand-gold/20">
              <h3 className="text-white font-semibold mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                <FontAwesomeIcon icon={faTag} className="mr-2 text-brand-gold text-sm sm:text-base" />
                Code promo
              </h3>
              {state.promoCode ? (
                <div className="flex items-center justify-between bg-brand-green/20 rounded-lg p-3 border border-brand-green/30">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faCheck} className="text-brand-green mr-2" />
                    <span className="text-white font-semibold">{state.promoCode}</span>
                    <span className="text-brand-green ml-2 text-sm">
                      -{discountAmount.toFixed(2)}€
                    </span>
                  </div>
                  <button
                    onClick={handleRemovePromo}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                    title="Retirer le code promo"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <input
                      type="text"
                      value={promoCodeInput}
                      onChange={(e) => {
                        setPromoCodeInput(e.target.value.toUpperCase())
                        setPromoError(null)
                        setPromoSuccess(false)
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleApplyPromo()
                        }
                      }}
                      placeholder="Entrez votre code promo"
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 sm:px-4 py-2 sm:py-2 text-white placeholder-gray-400 focus:outline-none focus:border-brand-gold text-sm sm:text-base"
                      disabled={isValidatingPromo}
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={isValidatingPromo || !promoCodeInput.trim()}
                      className="btn-gold text-black font-semibold px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isValidatingPromo ? 'Validation...' : 'Appliquer'}
                    </button>
                  </div>
                  {promoError && (
                    <div className="flex items-center gap-2 text-red-400 text-xs sm:text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                      <FontAwesomeIcon icon={faXmark} className="text-xs" />
                      <p>{promoError}</p>
                    </div>
                  )}
                  {promoSuccess && !state.promoCode && (
                    <div className="flex items-center gap-2 text-brand-green text-xs sm:text-sm bg-brand-green/10 border border-brand-green/20 rounded-lg p-2">
                      <FontAwesomeIcon icon={faCheck} className="text-xs" />
                      <p>Code promo appliqué avec succès !</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Résumé de commande */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="bg-white/5 rounded-xl p-4 sm:p-6 sticky top-20 sm:top-24">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Résumé de commande</h3>
              
              {/* Détails des prix */}
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between text-gray-300 text-sm sm:text-base">
                  <span>Sous-total ({state.totalItems} articles)</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                {state.promoCode && discountAmount > 0 && (
                  <div className="flex justify-between text-brand-green text-sm sm:text-base">
                    <span>Remise ({state.promoCode})</span>
                    <span>-{discountAmount.toFixed(2)} €</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-300 text-sm sm:text-base">
                  <span>Livraison</span>
                  <span className={shipping === 0 ? 'text-brand-green' : ''}>
                    {shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)} €`}
                  </span>
                </div>
                <div className="border-t border-white/20 pt-2 sm:pt-3">
                  <div className="flex justify-between text-lg sm:text-xl font-bold text-white">
                    <span>Total</span>
                    <span className="text-brand-gold">{total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              {/* Avantages */}
              <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6 text-xs sm:text-sm text-gray-400">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faShield} className="mr-2 text-brand-green text-xs sm:text-sm" />
                  <span>Paiement sécurisé</span>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faTruck} className="mr-2 text-brand-gold text-xs sm:text-sm" />
                  <span>Livraison rapide</span>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faGift} className="mr-2 text-brand-green text-xs sm:text-sm" />
                  <span>Retour gratuit sous 30 jours</span>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="space-y-2 sm:space-y-3">
                {/* Payment Method Selector */}
                <PaymentMethodSelector 
                  onPaymentSuccess={() => {
                    // Paiement réussi
                  }}
                  onPaymentError={(error) => {
                    console.error('Erreur de paiement:', error)
                  }}
                />
                
                {/* Lien pour continuer les achats */}
                <Link
                  href="/products"
                  className="w-full bg-white/10 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center text-sm sm:text-base"
                >
                  Continuer mes achats
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Produits recommandés */}
        <ProductRecommendations 
          products={[]}
          title="Vous pourriez aussi aimer"
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



