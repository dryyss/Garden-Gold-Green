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
  faShare
} from '@fortawesome/free-solid-svg-icons'
import { useCart } from '@/contexts/CartContext'
import { useUser } from '@auth0/nextjs-auth0'
import { StarRating } from '@/components/StarRating'
import { ProductCard } from '@/components/ProductCard'
import SubscriptionPlans from '@/components/SubscriptionPlans'
import CreateSubscriptionModal from '@/components/CreateSubscriptionModal'
import { useSubscriptions } from '@/hooks/useSubscriptions'
import { SubscriptionPlanWithDetails } from '@/types/subscription'

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
}

export default function ProductDetailPage() {
  const params = useParams()
  const { dispatch } = useCart()
  const { user } = useUser()
  const { 
    plans, 
    loadingPlans, 
    fetchPlans, 
    createSubscription, 
    loadingAction 
  } = useSubscriptions()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedStrength, setSelectedStrength] = useState('1000mg - Standard Potency')
  const [activeTab, setActiveTab] = useState('description')
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Simuler le chargement d'un produit depuis l'API
    const productSlug = params.slug as string
    const foundProduct = productsData.find(p => p.slug === productSlug)
    
    if (foundProduct) {
      const transformedProduct = transformProduct(foundProduct)
      setProduct(transformedProduct)
      
      // Charger les plans d'abonnement pour ce produit
      fetchPlans(foundProduct.id)
    }
  }, [params.slug, fetchPlans])

  const handlePlanSelect = (plan: SubscriptionPlanWithDetails) => {
    setSelectedPlan(plan)
    setShowSubscriptionModal(true)
  }

  const handleCreateSubscription = async (data: {
    planId: string;
    quantity: number;
    shippingAddress: any;
    paymentMethodId?: string;
  }) => {
    if (!user?.sub) {
      alert('Vous devez être connecté pour créer un abonnement')
      return
    }

    try {
      await createSubscription({
        userId: user.sub,
        ...data
      })
      
      setShowSubscriptionModal(false)
      setSelectedPlan(null)
      alert('Abonnement créé avec succès !')
    } catch (error) {
      console.error('Erreur lors de la création de l\'abonnement:', error)
      alert('Erreur lors de la création de l\'abonnement')
    }
  }

  const transformProduct = (foundProduct: any): Product => {
    return {
      ...foundProduct,
      images: [
        foundProduct.image,
        'https://storage.googleapis.com/uxpilot-auth.appspot.com/6150e371c9-cf959decb319ba5f18c3.png',
        'https://storage.googleapis.com/uxpilot-auth.appspot.com/efac7e243f-ef87256518694e833470.png',
        'https://storage.googleapis.com/uxpilot-auth.appspot.com/f28d3694b1-28c8a8a3cb15af90b81e.png'
      ],
      longDescription: "Our flagship product, the Gold Standard CBD Oil, offers a potent, full-spectrum blend of cannabinoids and terpenes. Meticulously extracted from organic hemp to support balance, recovery, and overall well-being. The Garden Gold Green Standard is more than just CBD; it's a holistic experience. Our full-spectrum oil contains a rich profile of beneficial cannabinoids, including CBD, CBG, and CBC, along with natural terpenes that work synergistically to enhance the therapeutic effects—a phenomenon known as the 'entourage effect.'",
      features: [
        '100% Organic & Non-GMO',
        'Third-Party Lab Tested',
        'Made in the USA',
        'Full Spectrum CBD',
        'CO2 Extracted',
        'No THC'
      ],
      ingredients: [
        'Full Spectrum CBD Oil',
        'MCT Oil (Coconut)',
        'Natural Terpenes',
        'Organic Hemp Extract'
      ],
      usage: 'Take 1-2 drops under the tongue, hold for 30 seconds, then swallow. Start with a low dose and gradually increase as needed.',
      labResults: 'Third-party lab tested for potency, purity, and safety. All results available upon request.',
      relatedProducts: ['emerald-soothe-balm', 'green-serenity-gummies', 'silver-purity-vape']
    }
  }

  useEffect(() => {
    if (params.slug) {
      const loadProduct = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/products?slug=${params.slug}`)
          const data = await response.json()
          if (data.success && data.product) {
            setProduct(transformProduct(data.product))
          }
        } catch (error) {
          console.error('Erreur lors du chargement du produit:', error)
        } finally {
          setLoading(false)
        }
      }
      loadProduct()
    }
  }, [params.slug])

  const handleAddToCart = async () => {
    if (!product) return
    
    setIsLoading(true)
    try {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          quantity: quantity
        }
      })
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsLoading(false)
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

  const relatedProducts = productsData.filter(p => product.relatedProducts.includes(p.id))

  return (
    <main className="bg-brand-black min-h-screen pt-24">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 py-4">
        <div className="text-sm text-gray-400 mb-8">
          <Link href="/products" className="hover:text-brand-gold">Shop</Link>
          <FontAwesomeIcon icon={faChevronRight} className="mx-2 text-xs" />
          <span className="text-white">{product.category}</span>
          <FontAwesomeIcon icon={faChevronRight} className="mx-2 text-xs" />
          <span className="text-white">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images */}
          <div>
            <div className="mb-4 rounded-xl overflow-hidden card-bg p-4">
              <Image
                className="w-full h-auto object-cover rounded-lg"
                src={product.images[selectedImage]}
                alt={product.name}
                width={600}
                height={400}
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
                  <Image
                    className="w-full h-full object-cover rounded-md"
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    width={100}
                    height={100}
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
              <span className="text-gray-400 ml-3">({product.reviewCount} Reviews)</span>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold gold-text-gradient">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-gray-500 line-through text-lg">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Strength Selection */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">Strength:</label>
              <select
                value={selectedStrength}
                onChange={(e) => setSelectedStrength(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300"
              >
                <option>1000mg - Standard Potency</option>
                <option>2000mg - Extra Strength</option>
                <option>3000mg - Max Potency</option>
              </select>
            </div>

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
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 text-gray-400 hover:text-white transition-colors"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || isLoading}
                className={`btn-gold text-black font-bold py-3 px-8 rounded-full shadow-gold-glow flex-grow text-lg flex items-center justify-center gap-2 ${
                  !product.inStock || isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FontAwesomeIcon icon={faCartShopping} />
                {isLoading ? 'Adding...' : 'Add to Cart'}
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
              <button className="flex items-center gap-2 text-gray-400 hover:text-brand-gold transition-colors">
                <FontAwesomeIcon icon={faHeart} />
                <span>Add to Wishlist</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-brand-gold transition-colors">
                <FontAwesomeIcon icon={faShare} />
                <span>Share</span>
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
              {['description', 'usage', 'ingredients', 'lab-results', 'subscriptions'].map((tab) => (
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
                <h3 className="text-2xl font-semibold text-white mb-4">Unleash the Power of Nature</h3>
                <p className="mb-4">{product.longDescription}</p>
                <p>Sourced from sun-grown hemp in the fertile fields of Colorado, each plant is cultivated with organic practices, free from pesticides and herbicides. We use a state-of-the-art CO2 extraction process to ensure maximum purity and potency, preserving the plant's natural goodness in every single drop.</p>
              </div>
            )}

            {activeTab === 'usage' && (
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">How to Use</h3>
                <p className="mb-4">{product.usage}</p>
                <div className="bg-brand-black/50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-2">Recommended Dosage:</h4>
                  <ul className="space-y-2">
                    <li>• Beginners: 1-2 drops daily</li>
                    <li>• Regular users: 3-5 drops daily</li>
                    <li>• Advanced users: 6-10 drops daily</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Ingredients</h3>
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
                <h3 className="text-2xl font-semibold text-white mb-4">Lab Results</h3>
                <p className="mb-4">{product.labResults}</p>
                <div className="bg-brand-black/50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-4">Test Results:</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400">CBD Content:</span>
                      <span className="text-white ml-2 font-semibold">1000mg</span>
                    </div>
                    <div>
                      <span className="text-gray-400">THC Content:</span>
                      <span className="text-white ml-2 font-semibold">0.0%</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Pesticides:</span>
                      <span className="text-brand-green ml-2 font-semibold">None Detected</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Heavy Metals:</span>
                      <span className="text-brand-green ml-2 font-semibold">None Detected</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'subscriptions' && (
              <div>
                <h3 className="text-2xl font-semibold text-white mb-6">Abonnements</h3>
                <p className="text-gray-300 mb-8">
                  Économisez avec nos packs d'abonnement et recevez vos produits CBD préférés automatiquement.
                </p>
                
                {loadingPlans ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400">Chargement des plans d'abonnement...</div>
                  </div>
                ) : plans && plans.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                      <div
                        key={plan.id}
                        className="bg-brand-black/50 border border-white/10 rounded-lg p-6 hover:border-brand-gold transition-colors cursor-pointer"
                        onClick={() => handlePlanSelect(plan)}
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-3">
                            {plan.interval === 'weekly' ? '📅' : 
                             plan.interval === 'monthly' ? '🗓️' : '🎁'}
                          </div>
                          <h4 className="text-lg font-semibold text-white mb-2">
                            {plan.name}
                          </h4>
                          <div className="mb-4">
                            <div className="text-2xl font-bold text-brand-gold">
                              {(plan.priceCents / 100).toFixed(2)}€
                            </div>
                            <div className="text-sm text-gray-400">
                              par {plan.interval === 'weekly' ? 'semaine' : 
                                   plan.interval === 'monthly' ? 'mois' : 'an'}
                            </div>
                          </div>
                          {plan.discount && plan.discount > 0 && (
                            <div className="mb-4 p-2 bg-green-900/30 border border-green-500/30 rounded">
                              <div className="text-green-400 font-semibold text-sm">
                                Économisez {plan.discount}%
                              </div>
                            </div>
                          )}
                          <div className="text-sm text-gray-300 mb-4">
                            {plan.description}
                          </div>
                          <button className="w-full bg-brand-gold text-black font-semibold py-2 px-4 rounded hover:bg-yellow-400 transition-colors">
                            Choisir ce plan
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400">Aucun plan d'abonnement disponible pour ce produit.</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-24 bg-brand-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-2 gold-text-gradient">You Might Also Like</h2>
            <p className="text-lg text-gray-400">Complete your wellness routine with these premium selections.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      </section>

      {/* Modal de création d'abonnement */}
      <CreateSubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => {
          setShowSubscriptionModal(false)
          setSelectedPlan(null)
        }}
        selectedPlan={selectedPlan}
        onConfirmSubscription={handleCreateSubscription}
        isLoading={loadingAction}
      />
    </main>
  )
}