'use client'

import { lazy, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faLeaf, 
  faFlaskVial, 
  faHandHoldingHeart,
  faStar,
  faStarHalfStroke,
  faArrowRight,
  faShield,
  faTruck,
  faHeadset,
  faAward,
  faUsers,
  faGlobe,
  faHeart,
  faCheckCircle,
  faPlay,
  faShoppingBag,
  faGift
} from '@fortawesome/free-solid-svg-icons'
import { HeroLogo } from '@/components/HeroLogo'
import { useTranslation } from '@/contexts/TranslationContext'
import { useState, useEffect } from 'react'

// Lazy load des composants lourds
const ProductGridCarousel = lazy(() => import('@/components/ProductGridCarousel').then(m => ({ default: m.ProductGridCarousel })))
const Newsletter = lazy(() => import('@/components/Newsletter').then(m => ({ default: m.Newsletter })))

// Transformer les données de l'ancienne structure vers la nouvelle
function transformProduct(product: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  return {
    ...product,
    name: product.title,
    price: product.priceCents / 100, // Convertir les centimes en euros
    image: product.images?.[0] || '/logo2.png',
    category: product.categories?.[0]?.name || 'CBD Products',
    rating: 4.5, // Valeur par défaut
    reviewCount: 50, // Valeur fixe pour éviter l'erreur d'hydratation
    inStock: product.totalStock > 0 || product.stock > 0,
    totalStock: product.totalStock || product.stock || 0,
    isNew: false, // Valeur fixe pour éviter l'erreur d'hydratation
    isBestSeller: false // Valeur fixe pour éviter l'erreur d'hydratation
  }
}

export default function HomePage() {
  const { t } = useTranslation()
  const [allProducts, setAllProducts] = useState<any[]>([])

  // Charger les produits depuis l'API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products/all')
        const data = await response.json()
        if (data.success && data.products) {
          setAllProducts(data.products)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error)
      }
    }
    loadProducts()
  }, [])

  // Récupérer les produits les plus populaires
  const featuredProducts = allProducts
    .filter(product => product.published)
    .slice(0, 6)
    .map(transformProduct)

  const bestSellers = allProducts
    .filter(product => product.published)
    .slice(6, 12)
    .map(transformProduct)

  const newProducts = allProducts
    .filter(product => product.published)
    .slice(12, 18)
    .map(transformProduct)

  return (
    <div className="bg-brand-black">
      {/* Hero Section */}
      <section className="relative h-[900px] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 hero-bg"></div>
        <div className="absolute inset-0 hero-overlay"></div>
        <div className="relative z-10 flex flex-col items-center px-4">
          <div className="mb-8 pt-8 sm:pt-12 md:pt-16">
            <HeroLogo />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            {t('home.hero.mainTitle')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            {t('home.hero.mainSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/products" className="btn-gold text-black font-semibold py-3 px-8 rounded-full shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 flex items-center justify-center">
              {t('home.hero.ctaCollection')}
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Link>
            <Link href="/learn" className="bg-transparent border-2 border-brand-green text-brand-green font-semibold py-3 px-8 rounded-full hover:bg-brand-green hover:text-black transition-all duration-300 flex items-center justify-center">
              {t('home.hero.ctaLearnMore')}
              <FontAwesomeIcon icon={faPlay} className="ml-2" />
            </Link>
          </div>
          
          {/* Stats rapides */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-gold mb-1">10K+</div>
              <div className="text-sm text-gray-400">{t('home.hero.stats.satisfiedCustomers')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-green mb-1">100%</div>
              <div className="text-sm text-gray-400">{t('home.hero.stats.organic')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-gold mb-1">50+</div>
              <div className="text-sm text-gray-400">{t('home.hero.stats.premiumProducts')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-green mb-1">24/7</div>
              <div className="text-sm text-gray-400">{t('home.hero.stats.customerSupport')}</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-24 bg-brand-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-2 gold-text-gradient">{t('home.featuredProducts.title')}</h2>
            <p className="text-lg text-gray-400">{t('home.featuredProducts.subtitle')}</p>
          </div>
          <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div></div>}>
            <ProductGridCarousel
              products={featuredProducts}
              itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
              showNavigation={true}
              showDots={true}
              autoPlay={true}
              autoPlayInterval={4000}
            />
          </Suspense>
          <div className="text-center mt-12">
            <Link href="/products" className="btn-gold text-black font-semibold py-3 px-8 rounded-full shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 inline-flex items-center">
              {t('home.featuredProducts.viewAll')}
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Avantages Section */}
      <section className="py-24 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-2 gold-text-gradient">{t('home.benefits.title')}</h2>
            <p className="text-lg text-gray-400">{t('home.benefits.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-gold/30 transition-colors">
                <FontAwesomeIcon icon={faShield} className="text-brand-gold text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{t('home.benefits.qualityGuarantee.title')}</h3>
              <p className="text-gray-400">{t('home.benefits.qualityGuarantee.description')}</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-green/30 transition-colors">
                <FontAwesomeIcon icon={faTruck} className="text-brand-green text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{t('home.benefits.fastDelivery.title')}</h3>
              <p className="text-gray-400">{t('home.benefits.fastDelivery.description')}</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-gold/30 transition-colors">
                <FontAwesomeIcon icon={faHeadset} className="text-brand-gold text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{t('home.benefits.support247.title')}</h3>
              <p className="text-gray-400">{t('home.benefits.support247.description')}</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-green/30 transition-colors">
                <FontAwesomeIcon icon={faAward} className="text-brand-green text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{t('home.benefits.certifications.title')}</h3>
              <p className="text-gray-400">{t('home.benefits.certifications.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-24 bg-brand-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-2 gold-text-gradient">{t('home.bestSellers.title')}</h2>
            <p className="text-lg text-gray-400">{t('home.bestSellers.subtitle')}</p>
          </div>
          <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div></div>}>
            <ProductGridCarousel
              products={bestSellers}
              itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
              showNavigation={true}
              showDots={true}
              autoPlay={true}
              autoPlayInterval={5000}
            />
          </Suspense>
        </div>
      </section>

      {/* Brand Promise Section */}
      <section className="py-24 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 w-full">
            <Image
                    className="rounded-xl shadow-2xl" 
                    src="/logo.png" 
                    alt="Close-up of a vibrant green cannabis leaf with glistening golden CBD oil dripping from the tip, dark background, macro photography, dramatic lighting"
                    width={600}
                    height={400}
                  />
            </div>
            <div className="lg:w-1/2 w-full">
              <h2 className="text-4xl font-bold mb-6 gold-text-gradient">{t('home.brandPromise.title')}</h2>
              <p className="text-gray-300 mb-8 text-lg">{t('home.brandPromise.description')}</p>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-green/10 flex items-center justify-center mr-4 border border-brand-green">
                    <FontAwesomeIcon icon={faLeaf} className="text-brand-green text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-lg">{t('home.brandPromise.organic.title')}</h4>
                    <p className="text-gray-400">{t('home.brandPromise.organic.description')}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-green/10 flex items-center justify-center mr-4 border border-brand-green">
                    <FontAwesomeIcon icon={faFlaskVial} className="text-brand-green text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-lg">{t('home.brandPromise.labTested.title')}</h4>
                    <p className="text-gray-400">{t('home.brandPromise.labTested.description')}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-green/10 flex items-center justify-center mr-4 border border-brand-green">
                    <FontAwesomeIcon icon={faHandHoldingHeart} className="text-brand-green text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-lg">{t('home.brandPromise.ethical.title')}</h4>
                    <p className="text-gray-400">{t('home.brandPromise.ethical.description')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-brand-black">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4 gold-text-gradient">{t('home.howItWorks.title')}</h2>
          <p className="text-lg text-gray-400 mb-16 max-w-2xl mx-auto">{t('home.howItWorks.subtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 hidden md:block" style={{transform: 'translateY(-50%)'}}></div>
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent hidden md:block" style={{transform: 'translateY(-50%)'}}></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-brand-black border-2 border-brand-gold mb-6 shadow-gold-glow">
                <span className="text-3xl font-bold gold-text-gradient">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('home.howItWorks.step1.title')}</h3>
              <p className="text-gray-400">{t('home.howItWorks.step1.description')}</p>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-brand-black border-2 border-brand-gold mb-6 shadow-gold-glow">
                <span className="text-3xl font-bold gold-text-gradient">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('home.howItWorks.step2.title')}</h3>
              <p className="text-gray-400">{t('home.howItWorks.step2.description')}</p>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-brand-black border-2 border-brand-gold mb-6 shadow-gold-glow">
                <span className="text-3xl font-bold gold-text-gradient">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('home.howItWorks.step3.title')}</h3>
              <p className="text-gray-400">{t('home.howItWorks.step3.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-2 gold-text-gradient">{t('home.testimonials.title')}</h2>
            <p className="text-lg text-gray-400">{t('home.testimonials.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="card-bg p-8 rounded-xl">
              <div className="flex items-center mb-4">
          <Image
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg" 
                  className="w-12 h-12 rounded-full mr-4 border-2 border-brand-gold" 
                  alt="User avatar"
                  width={48}
                  height={48}
                />
                <div>
                  <h4 className="font-semibold text-white">{t('home.testimonials.testimonial1.name')}</h4>
                  <p className="text-sm text-gray-400">{t('home.testimonials.verifiedBuyer')}</p>
                </div>
              </div>
              <div className="text-brand-gold mb-4">
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
              </div>
              <p className="text-gray-300">&quot;{t('home.testimonials.testimonial1.comment')}&quot;</p>
            </div>
            <div className="card-bg p-8 rounded-xl">
              <div className="flex items-center mb-4">
          <Image
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" 
                  className="w-12 h-12 rounded-full mr-4 border-2 border-brand-gold" 
                  alt="User avatar"
                  width={48}
                  height={48}
                />
                <div>
                  <h4 className="font-semibold text-white">{t('home.testimonials.testimonial2.name')}</h4>
                  <p className="text-sm text-gray-400">{t('home.testimonials.verifiedBuyer')}</p>
                </div>
              </div>
              <div className="text-brand-gold mb-4">
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
              </div>
              <p className="text-gray-300">&quot;{t('home.testimonials.testimonial2.comment')}&quot;</p>
            </div>
            <div className="card-bg p-8 rounded-xl">
              <div className="flex items-center mb-4">
          <Image
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg" 
                  className="w-12 h-12 rounded-full mr-4 border-2 border-brand-gold" 
                  alt="User avatar"
                  width={48}
                  height={48}
                />
                <div>
                  <h4 className="font-semibold text-white">{t('home.testimonials.testimonial3.name')}</h4>
                  <p className="text-sm text-gray-400">{t('home.testimonials.verifiedBuyer')}</p>
                </div>
              </div>
              <div className="text-brand-gold mb-4">
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStarHalfStroke} />
              </div>
              <p className="text-gray-300">&quot;{t('home.testimonials.testimonial3.comment')}&quot;</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nouveautés Section */}
      <section className="py-24 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-2 gold-text-gradient">{t('home.newProducts.title')}</h2>
            <p className="text-lg text-gray-400">{t('home.newProducts.subtitle')}</p>
          </div>
          <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div></div>}>
            <ProductGridCarousel
              products={newProducts}
              itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
              showNavigation={true}
              showDots={true}
              autoPlay={true}
              autoPlayInterval={6000}
            />
          </Suspense>
        </div>
      </section>

      {/* Communauté Section */}
      <section className="py-24 bg-brand-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-2 gold-text-gradient">{t('home.community.title')}</h2>
            <p className="text-lg text-gray-400">{t('home.community.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faUsers} className="text-brand-gold text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">10,000+</h3>
              <p className="text-gray-400">{t('home.community.activeMembers')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faGlobe} className="text-brand-green text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">15+</h3>
              <p className="text-gray-400">{t('home.community.countriesServed')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faHeart} className="text-brand-gold text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">98%</h3>
              <p className="text-gray-400">{t('home.community.customerSatisfaction')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Offre Spéciale Section */}
      <section className="py-24 bg-gradient-to-r from-brand-gold/10 to-brand-green/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-2 gold-text-gradient">{t('home.welcomeOffer.title')}</h2>
            <p className="text-lg text-gray-400">{t('home.welcomeOffer.subtitle')}</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="card-bg rounded-2xl p-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-brand-gold rounded-full flex items-center justify-center mr-4">
                  <FontAwesomeIcon icon={faGift} className="text-black text-3xl" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-white">{t('home.welcomeOffer.code')}</h3>
                  <p className="text-gray-400">{t('home.welcomeOffer.validOn')}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-brand-green text-2xl mb-2" />
                  <p className="text-white font-medium">{t('home.welcomeOffer.freeShipping')}</p>
                </div>
                <div className="text-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-brand-green text-2xl mb-2" />
                  <p className="text-white font-medium">{t('home.welcomeOffer.freeReturn')}</p>
                </div>
                <div className="text-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-brand-green text-2xl mb-2" />
                  <p className="text-white font-medium">{t('home.welcomeOffer.prioritySupport')}</p>
                </div>
              </div>
              <Link href="/products" className="btn-gold text-black font-semibold py-4 px-8 rounded-full shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 inline-flex items-center text-lg">
                <FontAwesomeIcon icon={faShoppingBag} className="mr-2" />
                {t('home.welcomeOffer.cta')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-2 gold-text-gradient">{t('home.faq.title')}</h2>
            <p className="text-lg text-gray-400">{t('home.faq.subtitle')}</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card-bg rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">{t('home.faq.q1.question')}</h3>
                <p className="text-gray-400">{t('home.faq.q1.answer')}</p>
              </div>
              <div className="card-bg rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">{t('home.faq.q2.question')}</h3>
                <p className="text-gray-400">{t('home.faq.q2.answer')}</p>
              </div>
              <div className="card-bg rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">{t('home.faq.q3.question')}</h3>
                <p className="text-gray-400">{t('home.faq.q3.answer')}</p>
              </div>
              <div className="card-bg rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">{t('home.faq.q4.question')}</h3>
                <p className="text-gray-400">{t('home.faq.q4.answer')}</p>
              </div>
            </div>
            <div className="text-center mt-12">
              <Link href="/faq" className="text-brand-gold hover:text-yellow-300 transition-colors font-medium">
                {t('home.faq.viewAll')}
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-brand-black">
        <div className="container mx-auto px-6">
          <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="animate-pulse text-gray-400">Chargement...</div></div>}>
            <Newsletter variant="hero" />
          </Suspense>
        </div>
      </section>
    </div>
  )
}