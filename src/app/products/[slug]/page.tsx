'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faChevronRight, 
  faStar, 
  faStarHalfStroke,
  faCheckCircle,
  faMinus,
  faPlus,
  faCartShopping,
  faHeart,
  faShare,
  faCheck,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'
import { useCart } from '@/contexts/CartContext'
import { useAuth0 } from '@/hooks/useAuth0'
import { useNotifications } from '@/contexts/NotificationContext'
import { StarRating } from '@/components/StarRating'
import { ProductCard } from '@/components/ProductCard'
import { Breadcrumb } from '@/components/Breadcrumb'
import { ImageWithLoading, ProductImage } from '@/components/ImageWithLoading'
import { VariantSelector } from '@/components/VariantSelector'
import productsData from '@/data/products.json'

interface Variant {
  id: string
  weight: number
  unit: string
  priceCents: number
  stock: number
  sku: string
  isDefault: boolean
}

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  description: string
  longDescription: string
  rating: number
  reviewCount: number
  inStock: boolean
  features: string[]
  ingredients: string[]
  usage: string
  labResults: string
  relatedProducts: string[]
  variants: Variant[]
  totalStock: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const { dispatch } = useCart()
  const authContext = useAuth()
  const authState = authContext?.state || { isAuthenticated: false }
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [activeTab, setActiveTab] = useState('description')
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const { addNotification } = useNotifications()

  // Transformer les données de l'ancienne structure vers la nouvelle
  const transformProduct = (product: any): Product => {
    return {
      id: product.id,
      name: product.title,
      price: product.priceCents / 100, // Convertir les centimes en euros
      originalPrice: product.originalPriceCents ? product.originalPriceCents / 100 : undefined,
      images: product.images || [product.image || '/logo.png'],
      category: product.categories?.[0]?.name || 'CBD Products',
      description: product.description,
      longDescription: product.longDescription || "Notre produit phare, l'huile CBD Gold Standard, offre un mélange puissant et à spectre complet de cannabinoïdes et de terpènes. Soigneusement extraite de chanvre biologique pour soutenir l'équilibre, la récupération et le bien-être général.",
      rating: 4.5, // Valeur par défaut
      reviewCount: Math.floor(Math.random() * 100) + 10, // Valeur aléatoire
      inStock: product.totalStock > 0,
      variants: product.variants || [],
      totalStock: product.totalStock || product.stock || 0,
      features: [
        '100% Biologique et Non-OGM',
        'Testé en laboratoire tiers',
        'Fabriqué en France',
        'CBD à spectre complet',
        'Extraction CO2',
        'Sans THC'
      ],
      ingredients: [
        'Huile CBD à spectre complet',
        'Huile MCT (Noix de coco)',
        'Terpènes naturels',
        'Extrait de chanvre biologique'
      ],
      usage: 'Prendre 1-2 gouttes sous la langue, maintenir 30 secondes, puis avaler. Commencer avec une faible dose et augmenter progressivement selon les besoins.',
      labResults: 'Testé en laboratoire tiers pour la puissance, la pureté et la sécurité. Tous les résultats disponibles sur demande.',
      relatedProducts: ['2', '3', '4'] // IDs des produits liés
    }
  }

  useEffect(() => {
    // Simuler le chargement d'un produit depuis l'API
    const productSlug = params.slug as string
    const foundProduct = productsData.find(p => p.slug === productSlug || p.id === productSlug)
    
    if (foundProduct) {
      const transformedProduct = transformProduct(foundProduct)
      // Ajouter des images supplémentaires
      transformedProduct.images = [
        foundProduct.images?.[0] || foundProduct.image || '/logo.png',
        'https://storage.googleapis.com/uxpilot-auth.appspot.com/6150e371c9-cf959decb319ba5f18c3.png',
        'https://storage.googleapis.com/uxpilot-auth.appspot.com/efac7e243f-ef87256518694e833470.png',
        'https://storage.googleapis.com/uxpilot-auth.appspot.com/f28d3694b1-28c8a8a3cb15af90b81e.png'
      ]
      setProduct(transformedProduct)
      
      // Sélectionner la variante par défaut
      const defaultVariant = transformedProduct.variants.find(v => v.isDefault) || transformedProduct.variants[0]
      setSelectedVariant(defaultVariant)
    }
  }, [params.slug])

  const handleAddToCart = async () => {
    if (!product || !selectedVariant || isLoading || isAdded) return
    
    setIsLoading(true)
    
    try {
      // Ajouter chaque article individuellement
      for (let i = 0; i < quantity; i++) {
        dispatch({
          type: 'ADD_ITEM',
          payload: {
            id: `${product.id}-${selectedVariant.id}`,
            name: `${product.name} - ${selectedVariant.weight}${selectedVariant.unit}`,
            price: selectedVariant.priceCents / 100,
            image: product.images[0],
            quantity: 1
          }
        })
      }
      
      // Animation de succès
      setIsLoading(false)
      setIsAdded(true)
      
      // Notification de succès
      addNotification({
        type: 'success',
        title: 'Ajouté au panier !',
        message: `${quantity} x ${product.name} - ${selectedVariant.weight}${selectedVariant.unit}`,
        duration: 3000
      })
      
      // Réinitialiser après 2 secondes
      setTimeout(() => {
        setIsAdded(false)
        setQuantity(1)
      }, 2000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      setIsLoading(false)
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible d\'ajouter le produit au panier',
        duration: 3000
      })
    }
  }

  const handleVariantChange = (variant: Variant) => {
    setSelectedVariant(variant)
    setQuantity(1) // Réinitialiser la quantité lors du changement de variante
  }

  const handleAddToFavorites = () => {
    if (!authState?.isAuthenticated) {
      // Rediriger vers la page de connexion
      window.location.href = '/auth'
      return
    }
    
    // Logique pour ajouter aux favoris (à implémenter)
    console.log('Ajouter aux favoris:', product?.name)
    // TODO: Implémenter la logique de favoris
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href
      })
    } else {
      // Fallback: copier l'URL dans le presse-papiers
      navigator.clipboard.writeText(window.location.href)
      alert('Lien copié dans le presse-papiers !')
    }
  }

  if (!product) {
    return (
      <div className="bg-brand-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-400">Loading product...</p>
        </div>
      </div>
    )
  }

  const relatedProducts = productsData
    .filter(p => product?.relatedProducts?.includes(p.id))
    .map(transformProduct)

  return (
    <main className="bg-brand-black min-h-screen pt-24">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 py-4">
        <Breadcrumb 
          items={[
            { label: 'Boutique', href: '/products' },
            { label: product.category, href: `/products?category=${product.category.toLowerCase()}` },
            { label: product.name }
          ]}
          className="mb-8"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images */}
          <div>
            <div className="mb-4 rounded-xl overflow-hidden card-bg p-4">
              <ProductImage
                className="w-full h-auto object-cover rounded-lg"
                src={product.images[selectedImage]}
                alt={product.name}
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                    selectedImage === index
                      ? 'border-2 border-brand-gold'
                      : 'border-2 border-transparent hover:border-brand-gold'
                  } card-bg p-1`}
                  onClick={() => setSelectedImage(index)}
                >
                  <ProductImage
                    className="w-full h-full object-cover rounded-md"
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <span className="text-brand-green font-semibold text-sm uppercase tracking-wide">
              {product.category}
            </span>
            <h1 className="text-4xl font-bold text-white my-3">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <StarRating rating={product.rating} size="lg" />
              <span className="text-gray-400 ml-3">({product.reviewCount} avis)</span>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold gold-text-gradient">
                {selectedVariant ? (selectedVariant.priceCents / 100).toFixed(2) : product.price.toFixed(2)} €
              </span>
              {product.originalPrice && product.originalPrice > (selectedVariant ? selectedVariant.priceCents / 100 : product.price) && (
                <span className="text-gray-500 line-through text-lg">
                  {product.originalPrice.toFixed(2)} €
                </span>
              )}
            </div>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && selectedVariant && (
              <VariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onVariantChange={handleVariantChange}
                className="mb-8"
              />
            )}

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-white/20 rounded-full p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 text-gray-400 hover:text-white transition-colors"
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <span className="w-10 text-center font-semibold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min((selectedVariant?.stock || 99), quantity + 1))}
                  className="w-10 h-10 text-gray-400 hover:text-white transition-colors"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0 || isLoading || isAdded}
                className={`
                  font-bold py-3 px-8 rounded-full flex-grow text-lg flex items-center justify-center gap-2
                  transition-all duration-300
                  ${isAdded
                    ? 'bg-brand-green text-white shadow-green-glow'
                    : selectedVariant && selectedVariant.stock > 0
                    ? 'btn-gold text-black shadow-gold-glow hover:scale-105'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }
                  ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
                `}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Ajout...</span>
                  </>
                ) : isAdded ? (
                  <>
                    <FontAwesomeIcon icon={faCheck} className="w-5 h-5 animate-bounce" />
                    <span>Ajouté !</span>
                  </>
                ) : selectedVariant?.stock === 0 ? (
                  'Rupture de stock'
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCartShopping} />
                    <span>Ajouter au panier</span>
                  </>
                )}
              </button>
            </div>

            {/* Product Features */}
            <div className="space-y-3 mb-8">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-center text-sm">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-brand-green mr-3" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={handleAddToFavorites}
                className="flex items-center gap-2 text-gray-400 hover:text-brand-gold transition-colors"
              >
                <FontAwesomeIcon icon={faHeart} />
                <span>Ajouter aux favoris</span>
              </button>
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 text-gray-400 hover:text-brand-gold transition-colors"
              >
                <FontAwesomeIcon icon={faShare} />
                <span>Partager</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <section className="py-16 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="border-b border-white/10 mb-8">
            <nav className="flex space-x-8">
              {['description', 'usage', 'ingredients', 'lab-results'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-semibold pb-4 border-b-2 transition-all capitalize ${
                    activeTab === tab
                      ? 'text-white border-brand-gold'
                      : 'text-gray-400 border-transparent hover:text-white hover:border-brand-gold'
                  }`}
                >
                  {tab.replace('-', ' ')}
                </button>
              ))}
            </nav>
          </div>

          <div className="text-gray-300 leading-loose">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Libérez le pouvoir de la nature</h3>
                <p className="mb-4">{product.longDescription}</p>
                <p>Sourcé de chanvre cultivé au soleil dans les champs fertiles de France, chaque plante est cultivée avec des pratiques biologiques, sans pesticides ni herbicides. Nous utilisons un processus d'extraction CO2 de pointe pour assurer une pureté et une puissance maximales, préservant la bonté naturelle de la plante dans chaque goutte.</p>
              </div>
            )}

            {activeTab === 'usage' && (
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Comment utiliser</h3>
                <p className="mb-4">{product.usage}</p>
                <div className="bg-brand-black/50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-2">Dosage recommandé :</h4>
                  <ul className="space-y-2">
                    <li>• Débutants : 1-2 gouttes par jour</li>
                    <li>• Utilisateurs réguliers : 3-5 gouttes par jour</li>
                    <li>• Utilisateurs avancés : 6-10 gouttes par jour</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Ingrédients</h3>
                <ul className="space-y-2">
                  {product.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-brand-green mr-3" />
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'lab-results' && (
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Résultats de laboratoire</h3>
                <p className="mb-4">{product.labResults}</p>
                <div className="bg-brand-black/50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-4">Résultats des tests :</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400">Contenu CBD :</span>
                      <span className="text-white ml-2 font-semibold">1000mg</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Contenu THC :</span>
                      <span className="text-white ml-2 font-semibold">0.0%</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Pesticides :</span>
                      <span className="text-brand-green ml-2 font-semibold">Aucun détecté</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Métaux lourds :</span>
                      <span className="text-brand-green ml-2 font-semibold">Aucun détecté</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-24 bg-brand-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-2 gold-text-gradient">Vous pourriez aussi aimer</h2>
            <p className="text-lg text-gray-400">Complétez votre routine de bien-être avec ces sélections premium.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}