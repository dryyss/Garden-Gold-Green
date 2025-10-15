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
import { Newsletter } from '@/components/Newsletter'
import { ProductCard } from '@/components/ProductCard'
import { HeroLogo } from '@/components/HeroLogo'
import productsData from '@/data/products.json'

// Transformer les données de l'ancienne structure vers la nouvelle
function transformProduct(product: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  return {
    ...product,
    name: product.title,
    price: product.priceCents / 100, // Convertir les centimes en euros
    image: product.images?.[0] || '/logo2.png',
    category: product.categories?.[0]?.name || 'CBD Products',
    rating: 4.5, // Valeur par défaut
    reviewCount: Math.floor(Math.random() * 100) + 10, // Valeur aléatoire
    inStock: product.totalStock > 0 || product.stock > 0,
    totalStock: product.totalStock || product.stock || 0,
    isNew: Math.random() > 0.7, // 30% de chance d'être nouveau
    isBestSeller: Math.random() > 0.8 // 20% de chance d'être best seller
  }
}

export default function Home() {
  // Récupérer les produits les plus populaires
  const featuredProducts = productsData
    .filter(product => product.published)
    .slice(0, 6)
    .map(transformProduct)

  const bestSellers = productsData
    .filter(product => product.published)
    .slice(6, 12)
    .map(transformProduct)

  const newProducts = productsData
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
          <div className="mb-8">
            <HeroLogo />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            Experience Nature&apos;s Finest Elixir
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Discover our premium collection of CBD products, meticulously crafted to bring you balance, serenity, and unparalleled purity.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/products" className="btn-gold text-black font-semibold py-3 px-8 rounded-full shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 flex items-center justify-center">
              Découvrir la Collection
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Link>
            <Link href="/learn" className="bg-transparent border-2 border-brand-green text-brand-green font-semibold py-3 px-8 rounded-full hover:bg-brand-green hover:text-black transition-all duration-300 flex items-center justify-center">
              En Savoir Plus
              <FontAwesomeIcon icon={faPlay} className="ml-2" />
            </Link>
          </div>
          
          {/* Stats rapides */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-gold mb-1">10K+</div>
              <div className="text-sm text-gray-400">Clients Satisfaits</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-green mb-1">100%</div>
              <div className="text-sm text-gray-400">Biologique</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-gold mb-1">50+</div>
              <div className="text-sm text-gray-400">Produits Premium</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-green mb-1">24/7</div>
              <div className="text-sm text-gray-400">Support Client</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-24 bg-brand-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-2 gold-text-gradient">Notre Sélection Signature</h2>
            <p className="text-lg text-gray-400">Sélectionnés pour leur pureté et leur puissance. Le meilleur de Garden Gold Green.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/products" className="btn-gold text-black font-semibold py-3 px-8 rounded-full shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 inline-flex items-center">
              Voir Tous les Produits
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Avantages Section */}
      <section className="py-24 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-2 gold-text-gradient">Pourquoi Choisir Garden Gold Green ?</h2>
            <p className="text-lg text-gray-400">Des avantages qui font la différence</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-gold/30 transition-colors">
                <FontAwesomeIcon icon={faShield} className="text-brand-gold text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Garantie Qualité</h3>
              <p className="text-gray-400">Testés en laboratoire tiers pour garantir pureté et sécurité</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-green/30 transition-colors">
                <FontAwesomeIcon icon={faTruck} className="text-brand-green text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Livraison Rapide</h3>
              <p className="text-gray-400">Expédition sous 24h et livraison gratuite dès 50€</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-gold/30 transition-colors">
                <FontAwesomeIcon icon={faHeadset} className="text-brand-gold text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Support 24/7</h3>
              <p className="text-gray-400">Notre équipe d&apos;experts est là pour vous accompagner</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-green/30 transition-colors">
                <FontAwesomeIcon icon={faAward} className="text-brand-green text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Certifications</h3>
              <p className="text-gray-400">Produits certifiés biologiques et respectueux de l&apos;environnement</p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-24 bg-brand-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-2 gold-text-gradient">Nos Best-Sellers</h2>
            <p className="text-lg text-gray-400">Les produits préférés de notre communauté</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Promise Section */}
      <section className="py-24 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 w-full">
            <Image
                    className="rounded-xl shadow-2xl" 
                    src="https://via.placeholder.com/600x400/00C853/FFFFFF?text=Cannabis+Leaf+Premium" 
                    alt="Close-up of a vibrant green cannabis leaf with glistening golden CBD oil dripping from the tip, dark background, macro photography, dramatic lighting"
                    width={600}
                    height={400}
                  />
            </div>
            <div className="lg:w-1/2 w-full">
              <h2 className="text-4xl font-bold mb-6 gold-text-gradient">The Garden Gold Green Standard</h2>
              <p className="text-gray-300 mb-8 text-lg">We are dedicated to cultivating and delivering the purest CBD experience. Our process combines organic farming practices with state-of-the-art extraction technology, ensuring every drop is potent, pure, and free from impurities. Nature&apos;s wisdom, perfected by science.</p>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-green/10 flex items-center justify-center mr-4 border border-brand-green">
                    <FontAwesomeIcon icon={faLeaf} className="text-brand-green text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-lg">100% Organic</h4>
                    <p className="text-gray-400">Sourced from non-GMO, organically grown hemp farms.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-green/10 flex items-center justify-center mr-4 border border-brand-green">
                    <FontAwesomeIcon icon={faFlaskVial} className="text-brand-green text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-lg">Lab Tested Purity</h4>
                    <p className="text-gray-400">Third-party lab tested for quality, potency, and safety.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-green/10 flex items-center justify-center mr-4 border border-brand-green">
                    <FontAwesomeIcon icon={faHandHoldingHeart} className="text-brand-green text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-lg">Ethically Crafted</h4>
                    <p className="text-gray-400">Sustainably sourced and cruelty-free production.</p>
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
          <h2 className="text-4xl font-bold mb-4 gold-text-gradient">Your Path to Wellness</h2>
          <p className="text-lg text-gray-400 mb-16 max-w-2xl mx-auto">Embrace a life of balance and well-being in three simple steps.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 hidden md:block" style={{transform: 'translateY(-50%)'}}></div>
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent hidden md:block" style={{transform: 'translateY(-50%)'}}></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-brand-black border-2 border-brand-gold mb-6 shadow-gold-glow">
                <span className="text-3xl font-bold gold-text-gradient">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Discover Your Product</h3>
              <p className="text-gray-400">Explore our curated selection and find the perfect CBD solution for your lifestyle and needs.</p>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-brand-black border-2 border-brand-gold mb-6 shadow-gold-glow">
                <span className="text-3xl font-bold gold-text-gradient">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Incorporate Daily</h3>
              <p className="text-gray-400">Easily integrate our premium CBD into your daily routine for consistent, natural support.</p>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-brand-black border-2 border-brand-gold mb-6 shadow-gold-glow">
                <span className="text-3xl font-bold gold-text-gradient">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Feel the Difference</h3>
              <p className="text-gray-400">Experience the enhanced sense of calm, balance, and overall well-being.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-2 gold-text-gradient">Voices of Our Community</h2>
            <p className="text-lg text-gray-400">See how Garden Gold Green is making a difference.</p>
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
                  <h4 className="font-semibold text-white">Jessica M.</h4>
                  <p className="text-sm text-gray-400">Verified Buyer</p>
                </div>
              </div>
              <div className="text-brand-gold mb-4">
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
              </div>
              <p className="text-gray-300">&quot;The Gold Standard oil has been a game-changer for my stress levels. The quality is immediately noticeable. Will be a customer for life!&quot;</p>
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
                  <h4 className="font-semibold text-white">David L.</h4>
                  <p className="text-sm text-gray-400">Verified Buyer</p>
                </div>
              </div>
              <div className="text-brand-gold mb-4">
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
              </div>
              <p className="text-gray-300">&quot;I use the Emerald Soothe Balm after my workouts, and the relief is amazing. It smells great and isn&apos;t greasy. Highly recommend it.&quot;</p>
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
                  <h4 className="font-semibold text-white">Sarah K.</h4>
                  <p className="text-sm text-gray-400">Verified Buyer</p>
                </div>
              </div>
              <div className="text-brand-gold mb-4">
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStarHalfStroke} />
              </div>
              <p className="text-gray-300">&quot;The Serenity Gummies are my favorite way to unwind in the evening. They taste delicious and help me get a restful night&apos;s sleep.&quot;</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nouveautés Section */}
      <section className="py-24 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-2 gold-text-gradient">Nouveautés</h2>
            <p className="text-lg text-gray-400">Découvrez nos dernières créations</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Communauté Section */}
      <section className="py-24 bg-brand-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-2 gold-text-gradient">Rejoignez Notre Communauté</h2>
            <p className="text-lg text-gray-400">Plus de 10 000 membres nous font confiance</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faUsers} className="text-brand-gold text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">10,000+</h3>
              <p className="text-gray-400">Membres actifs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faGlobe} className="text-brand-green text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">15+</h3>
              <p className="text-gray-400">Pays servis</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faHeart} className="text-brand-gold text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">98%</h3>
              <p className="text-gray-400">Satisfaction client</p>
            </div>
          </div>
        </div>
      </section>

      {/* Offre Spéciale Section */}
      <section className="py-24 bg-gradient-to-r from-brand-gold/10 to-brand-green/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-2 gold-text-gradient">Offre de Bienvenue</h2>
            <p className="text-lg text-gray-400">Profitez de 20% de réduction sur votre première commande</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="card-bg rounded-2xl p-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-brand-gold rounded-full flex items-center justify-center mr-4">
                  <FontAwesomeIcon icon={faGift} className="text-black text-3xl" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-white">Code: WELCOME20</h3>
                  <p className="text-gray-400">Valable sur tous les produits</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-brand-green text-2xl mb-2" />
                  <p className="text-white font-medium">Livraison gratuite</p>
                </div>
                <div className="text-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-brand-green text-2xl mb-2" />
                  <p className="text-white font-medium">Retour gratuit</p>
                </div>
                <div className="text-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-brand-green text-2xl mb-2" />
                  <p className="text-white font-medium">Support prioritaire</p>
                </div>
              </div>
              <Link href="/products" className="btn-gold text-black font-semibold py-4 px-8 rounded-full shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 inline-flex items-center text-lg">
                <FontAwesomeIcon icon={faShoppingBag} className="mr-2" />
                Profiter de l&apos;Offre
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-2 gold-text-gradient">Questions Fréquentes</h2>
            <p className="text-lg text-gray-400">Tout ce que vous devez savoir sur nos produits CBD</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card-bg rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Les produits CBD sont-ils légaux ?</h3>
                <p className="text-gray-400">Oui, nos produits CBD sont parfaitement légaux en France. Ils contiennent moins de 0,2% de THC, conformément à la réglementation européenne.</p>
              </div>
              <div className="card-bg rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Comment choisir la bonne concentration ?</h3>
                <p className="text-gray-400">Commencez par une faible concentration (5-10%) si vous êtes débutant, puis augmentez progressivement selon vos besoins.</p>
              </div>
              <div className="card-bg rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Quels sont les délais de livraison ?</h3>
                <p className="text-gray-400">Nous expédions sous 24h et la livraison est gratuite dès 50€ d&apos;achat. Comptez 2-3 jours ouvrés pour la réception.</p>
              </div>
              <div className="card-bg rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Puis-je retourner mes produits ?</h3>
                <p className="text-gray-400">Oui, vous avez 14 jours pour retourner vos produits non ouverts. Les frais de retour sont à notre charge.</p>
              </div>
            </div>
            <div className="text-center mt-12">
              <Link href="/faq" className="text-brand-gold hover:text-yellow-300 transition-colors font-medium">
                Voir toutes les questions fréquentes
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-brand-black">
        <div className="container mx-auto px-6">
          <Newsletter variant="hero" />
        </div>
      </section>
    </div>
  )
}