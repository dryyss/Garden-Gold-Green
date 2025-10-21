'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faArrowLeft,
  faShoppingCart,
  faHeart,
  faShare,
  faStar,
  faCheck,
  faPlus,
  faMinus,
  faTruck,
  faShield,
  faLeaf,
  faFlask,
  faUser,
  faCalendar,
  faThumbsUp,
  faThumbsDown,
  faComment,
  faLightbulb,
  faInfoCircle,
  faExclamationTriangle,
  faClock,
  faDroplet,
  faThermometerHalf,
  faWeight,
  faCertificate,
  faAward,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons'
import { useCart } from '@/contexts/CartContext'
import { useNotifications } from '@/contexts/NotificationContext'
import { StarRating } from '@/components/StarRating'
import { QuantitySelector } from '@/components/QuantitySelector'
import { AddToCartButton } from '@/components/AddToCartButton'
import { ImageCarousel } from '@/components/ImageCarousel'
import { ProductCarousel } from '@/components/ProductCarousel'

interface Product {
  id: string
  name: string
  price: number
  image: string
  images?: string[]
  category: string
  rating: number
  reviewCount: number
  inStock: boolean
  isNew: boolean
  isBestSeller: boolean
  slug: string
  description?: string
  detailedDescription?: string
  cbdPercent?: number
  thcPercent?: number
  weight?: string
  origin?: string
  extractionMethod?: string
  labTested?: boolean
  organic?: boolean
  usageInstructions?: string
  benefits?: string[]
  sideEffects?: string[]
  dosage?: string
  storage?: string
  expiryDate?: string
  batchNumber?: string
  ingredients?: string[]
  allergens?: string[]
  warnings?: string[]
}

interface Review {
  id: string
  user: string
  rating: number
  date: string
  title: string
  comment: string
  verified: boolean
  helpful: number
  notHelpful: number
}

interface RelatedProduct {
  id: string
  name: string
  price: number
  image: string
  slug: string
  rating: number
  reviewCount: number
}

export default function ProductPage({ product }: { product: Product }) {
  const { dispatch } = useCart()
  const { addNotification } = useNotifications()
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [isFavorited, setIsFavorited] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])

  // Générer des images multiples pour le carousel
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [
        product.image,
        product.image, // Dupliquer pour simuler plusieurs images
        product.image,
        product.image
      ]

  // Données fictives pour les avis
  const mockReviews: Review[] = [
    {
      id: '1',
      user: 'Marie L.',
      rating: 5,
      date: '2024-01-15',
      title: 'Excellent produit !',
      comment: 'J\'utilise ce produit depuis 2 semaines et je ressens déjà les bienfaits. Qualité exceptionnelle et goût agréable.',
      verified: true,
      helpful: 12,
      notHelpful: 1
    },
    {
      id: '2',
      user: 'Pierre M.',
      rating: 4,
      date: '2024-01-10',
      title: 'Très satisfait',
      comment: 'Bon rapport qualité-prix. Livraison rapide et emballage soigné. Je recommande !',
      verified: true,
      helpful: 8,
      notHelpful: 0
    },
    {
      id: '3',
      user: 'Sophie D.',
      rating: 5,
      date: '2024-01-08',
      title: 'Parfait pour le stress',
      comment: 'Ce produit m\'aide vraiment à gérer mon stress quotidien. Je le prends le soir et je dors mieux.',
      verified: false,
      helpful: 15,
      notHelpful: 2
    }
  ]

  // Données fictives pour les produits similaires
  const mockRelatedProducts: RelatedProduct[] = [
    {
      id: '2',
      name: 'CBD Huile 15%',
      price: 49.90,
      image: '/logo2.png',
      slug: 'cbd-huile-15',
      rating: 4.8,
      reviewCount: 67
    },
    {
      id: '3',
      name: 'CBD Gummies Relax',
      price: 29.90,
      image: '/logo2.png',
      slug: 'cbd-gummies-relax',
      rating: 4.6,
      reviewCount: 43
    },
    {
      id: '4',
      name: 'CBD Crème Muscles',
      price: 24.90,
      image: '/logo2.png',
      slug: 'cbd-creme-muscles',
      rating: 4.4,
      reviewCount: 28
    }
  ]

  useEffect(() => {
    setReviews(mockReviews)
    setRelatedProducts(mockRelatedProducts)
  }, [])

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        slug: product.slug,
        cbdPercent: product.cbdPercent
      }
    })
    addNotification({
      type: 'success',
      title: 'Produit ajouté au panier !'
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Découvrez ${product.name} sur Garden Gold Green`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      addNotification({
        type: 'success',
        title: 'Lien copié dans le presse-papiers !'
      })
    }
  }

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
    addNotification({
      type: 'success',
      title: isFavorited ? 'Retiré des favoris' : 'Ajouté aux favoris'
    })
  }

  const handleReviewHelpful = (reviewId: string, helpful: boolean) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            helpful: helpful ? review.helpful + 1 : review.helpful,
            notHelpful: !helpful ? review.notHelpful + 1 : review.notHelpful
          }
        : review
    ))
  }

  const tabs = [
    { id: 'description', label: 'Description', icon: faInfoCircle },
    { id: 'usage', label: 'Conseils d\'utilisation', icon: faLightbulb },
    { id: 'reviews', label: 'Avis clients', icon: faComment },
    { id: 'specifications', label: 'Spécifications', icon: faFlask }
  ]

  return (
    <div className="min-h-screen bg-brand-black pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            href="/products" 
            className="inline-flex items-center text-gray-400 hover:text-brand-gold transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Retour aux produits
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Images Carousel */}
          <div>
            <ImageCarousel
              images={productImages}
              alt={product.name}
              showThumbnails={true}
              showFullscreen={true}
              autoPlay={false}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <div className="text-brand-green font-semibold text-sm uppercase tracking-wide">
              {product.category}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-white">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <StarRating rating={product.rating} />
              <span className="text-gray-400 text-sm">
                ({product.reviewCount} avis)
              </span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-brand-gold">
              {product.price.toFixed(2)} €
            </div>

            {/* Description */}
            <p className="text-gray-300 leading-relaxed">
              {product.description || 'Produit CBD de qualité supérieure, soigneusement sélectionné et testé pour garantir pureté et efficacité.'}
            </p>

            {/* Features */}
            <div className="space-y-2">
              {product.cbdPercent && (
                <div className="flex items-center text-sm text-gray-300">
                  <FontAwesomeIcon icon={faLeaf} className="text-brand-green mr-3" />
                  CBD {product.cbdPercent}%
                </div>
              )}
              <div className="flex items-center text-sm text-gray-300">
                <FontAwesomeIcon icon={faFlask} className="text-brand-green mr-3" />
                Testé en laboratoire
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <FontAwesomeIcon icon={faCheck} className="text-brand-green mr-3" />
                100% naturel
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-white font-medium">Quantité :</span>
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  min={1}
                  max={10}
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-brand-gold text-black font-bold py-3 px-6 rounded-full hover:shadow-gold-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                  Ajouter au panier
                </button>

                <button
                  onClick={handleFavorite}
                  className={`p-3 rounded-full border-2 transition-colors ${
                    isFavorited 
                      ? 'border-red-500 text-red-500 bg-red-500/10' 
                      : 'border-gray-600 text-gray-400 hover:border-red-500 hover:text-red-500'
                  }`}
                >
                  <FontAwesomeIcon icon={faHeart} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-3 rounded-full border-2 border-gray-600 text-gray-400 hover:border-brand-gold hover:text-brand-gold transition-colors"
                >
                  <FontAwesomeIcon icon={faShare} />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-700">
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faTruck} className="text-brand-gold" />
                <div>
                  <div className="text-white font-medium text-sm">Livraison gratuite</div>
                  <div className="text-gray-400 text-xs">Dès 50€ d'achat</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faShield} className="text-brand-green" />
                <div>
                  <div className="text-white font-medium text-sm">Garantie qualité</div>
                  <div className="text-gray-400 text-xs">Produits testés</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faCheck} className="text-brand-gold" />
                <div>
                  <div className="text-white font-medium text-sm">Retour facile</div>
                  <div className="text-gray-400 text-xs">30 jours</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-brand-gold text-brand-gold'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-12">
          {activeTab === 'description' && (
            <div className="prose prose-invert max-w-none">
              <h3 className="text-2xl font-bold text-white mb-6">Description détaillée</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-white mb-4">À propos de ce produit</h4>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {product.detailedDescription || `Notre ${product.name} est un produit CBD de qualité premium, 
                    soigneusement sélectionné pour sa pureté et son efficacité. Chaque lot est testé en laboratoire 
                    pour garantir une concentration précise en CBD et l'absence de contaminants.`}
                  </p>
                  
                  <h4 className="text-xl font-semibold text-white mb-4">Bienfaits</h4>
                  <ul className="space-y-2 text-gray-300">
                    {(product.benefits || [
                      'Aide à la relaxation et au bien-être',
                      'Soutient un sommeil réparateur',
                      'Contribue à la gestion du stress',
                      'Favorise la récupération musculaire'
                    ]).map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <FontAwesomeIcon icon={faCheck} className="text-brand-green mr-3 mt-1 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold text-white mb-4">Composition</h4>
                  <div className="space-y-3">
                    {product.cbdPercent && (
                      <div className="flex justify-between py-2 border-b border-gray-700">
                        <span className="text-gray-300">CBD</span>
                        <span className="text-white font-medium">{product.cbdPercent}%</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-300">THC</span>
                      <span className="text-white font-medium">&lt; 0.2%</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-300">Origine</span>
                      <span className="text-white font-medium">{product.origin || 'Europe'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-300">Méthode d'extraction</span>
                      <span className="text-white font-medium">{product.extractionMethod || 'CO2 supercritique'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="prose prose-invert max-w-none">
              <h3 className="text-2xl font-bold text-white mb-6">Conseils d'utilisation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-white mb-4">Mode d'emploi</h4>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-brand-gold text-black rounded-full flex items-center justify-center font-bold text-sm">1</div>
                      <div>
                        <h5 className="text-white font-medium">Dosage initial</h5>
                        <p className="text-gray-300 text-sm">Commencez par {product.dosage || '5-10mg par jour'} pour évaluer votre tolérance.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-brand-gold text-black rounded-full flex items-center justify-center font-bold text-sm">2</div>
                      <div>
                        <h5 className="text-white font-medium">Moment de prise</h5>
                        <p className="text-gray-300 text-sm">Prenez le produit {product.usageInstructions || 'le matin ou le soir selon vos besoins'}.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-brand-gold text-black rounded-full flex items-center justify-center font-bold text-sm">3</div>
                      <div>
                        <h5 className="text-white font-medium">Augmentation progressive</h5>
                        <p className="text-gray-300 text-sm">Augmentez progressivement la dose si nécessaire, en respectant les recommandations.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold text-white mb-4">Précautions d'emploi</h4>
                  <div className="space-y-4">
                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 mt-1" />
                        <div>
                          <h5 className="text-yellow-400 font-medium">Contre-indications</h5>
                          <p className="text-gray-300 text-sm mt-1">
                            Ne pas utiliser pendant la grossesse, l'allaitement ou en cas de traitement médical.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="text-white font-medium">Conservation</h5>
                      <p className="text-gray-300 text-sm">
                        {product.storage || 'Conserver dans un endroit frais et sec, à l\'abri de la lumière.'}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="text-white font-medium">Durée de conservation</h5>
                      <p className="text-gray-300 text-sm">
                        {product.expiryDate || '24 mois à partir de la date de fabrication.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Avis clients</h3>
                <div className="flex items-center space-x-4">
                  <StarRating rating={product.rating} />
                  <span className="text-gray-400">({product.reviewCount} avis)</span>
                </div>
              </div>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="card-bg rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-brand-gold text-black rounded-full flex items-center justify-center font-bold">
                          {review.user.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">{review.user}</span>
                            {review.verified && (
                              <span className="bg-brand-green text-white text-xs px-2 py-1 rounded-full">
                                Vérifié
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <StarRating rating={review.rating} size="sm" />
                            <span>{new Date(review.date).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="text-white font-medium mb-2">{review.title}</h4>
                    <p className="text-gray-300 mb-4">{review.comment}</p>
                    
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleReviewHelpful(review.id, true)}
                        className="flex items-center space-x-1 text-gray-400 hover:text-brand-green transition-colors"
                      >
                        <FontAwesomeIcon icon={faThumbsUp} />
                        <span>Utile ({review.helpful})</span>
                      </button>
                      <button
                        onClick={() => handleReviewHelpful(review.id, false)}
                        className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <FontAwesomeIcon icon={faThumbsDown} />
                        <span>Pas utile ({review.notHelpful})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="prose prose-invert max-w-none">
              <h3 className="text-2xl font-bold text-white mb-6">Spécifications techniques</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-white mb-4">Informations produit</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-300">Nom du produit</span>
                      <span className="text-white font-medium">{product.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-300">Catégorie</span>
                      <span className="text-white font-medium">{product.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-300">Poids</span>
                      <span className="text-white font-medium">{product.weight || '10g'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-300">Numéro de lot</span>
                      <span className="text-white font-medium">{product.batchNumber || 'GGG-2024-001'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold text-white mb-4">Certifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon icon={faCertificate} className="text-brand-gold" />
                      <span className="text-gray-300">Testé en laboratoire</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon icon={faAward} className="text-brand-green" />
                      <span className="text-gray-300">Certifié biologique</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon icon={faShield} className="text-brand-gold" />
                      <span className="text-gray-300">Conforme aux normes européennes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Products Carousel */}
        <div className="mb-12">
          <ProductCarousel
            products={relatedProducts}
            title="Produits similaires"
            itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
            autoPlay={true}
            autoPlayInterval={5000}
          />
        </div>
      </div>
    </div>
  )
}
