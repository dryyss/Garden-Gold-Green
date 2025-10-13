import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faLeaf, 
  faFlaskVial, 
  faHandHoldingHeart,
  faStar,
  faStarHalfStroke
} from '@fortawesome/free-solid-svg-icons'
import { AddToCartButton } from '@/components/AddToCartButton'
import { Newsletter } from '@/components/Newsletter'

export default function Home() {
  return (
    <div className="bg-brand-black">
      {/* Hero Section */}
      <section className="relative h-[900px] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 hero-bg"></div>
        <div className="absolute inset-0 hero-overlay"></div>
        <div className="relative z-10 flex flex-col items-center px-4">
          <div className="mb-8">
        <Image
              className="h-64 w-64" 
              src="/logo.png" 
              alt="3G - Garden Gold Green logo, metallic gold, emerald green, and shiny silver, on a dark background with light reflections"
              width={256}
              height={256}
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            Experience Nature&apos;s Finest Elixir
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Discover our premium collection of CBD products, meticulously crafted to bring you balance, serenity, and unparalleled purity.
          </p>
          <div className="flex space-x-4">
            <button className="btn-gold text-black font-semibold py-3 px-8 rounded-full shadow-gold-glow">
              Shop Collection
            </button>
            <button className="bg-transparent border-2 border-brand-green text-brand-green font-semibold py-3 px-8 rounded-full hover:bg-brand-green hover:text-black transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-24 bg-brand-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-2 gold-text-gradient">Our Signature Selection</h2>
            <p className="text-lg text-gray-400">Handpicked for purity and potency. The best of Garden Gold Green.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="card-bg rounded-xl overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-gold-glow">
              <div className="h-72 overflow-hidden">
                <Image 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  src="/products/cbd-oil-10.svg" 
                  alt="Elegant glass dropper bottle with gold cap for CBD oil, on a dark, luxurious background with a subtle leaf shadow, product photography style"
                  width={400}
                  height={288}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">3G Gold Standard CBD Oil</h3>
                <p className="text-gray-400 mb-4">1000mg Full Spectrum</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold gold-text-gradient">$79.99</span>
                      <AddToCartButton 
                        product={{
                          id: 'featured-1',
                          title: '3G Gold Standard CBD Oil',
                          priceCents: 7999,
                          currency: 'EUR',
                          image: '/products/cbd-oil-10.svg',
                          cbdPercent: 10,
                          slug: '3g-gold-standard-cbd-oil'
                        }}
                      />
                    </div>
              </div>
            </div>

            <div className="card-bg rounded-xl overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-gold-glow">
              <div className="h-72 overflow-hidden">
                <Image 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  src="/products/cbd-cream.svg" 
                  alt="Luxurious jar of CBD cream with gold and green labeling, sitting on a marble surface with a green plant in the background, high-end cosmetic photography"
                  width={400}
                  height={288}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Emerald Soothe CBD Balm</h3>
                <p className="text-gray-400 mb-4">500mg Topical Relief</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold gold-text-gradient">$54.99</span>
                      <AddToCartButton 
                        product={{
                          id: 'featured-2',
                          title: 'Emerald Soothe CBD Balm',
                          priceCents: 5499,
                          currency: 'EUR',
                          image: '/products/cbd-cream.svg',
                          cbdPercent: 2,
                          slug: 'emerald-soothe-cbd-balm'
                        }}
                      />
                    </div>
              </div>
            </div>

            <div className="card-bg rounded-xl overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-gold-glow">
              <div className="h-72 overflow-hidden">
                <Image 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  src="/products/cbd-gummies.svg" 
                  alt="Premium packaging for CBD gummies, dark box with gold foil lettering, showing a few colorful gummies next to it, lifestyle product shot"
                  width={400}
                  height={288}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Green Serenity Gummies</h3>
                <p className="text-gray-400 mb-4">25mg per Gummy</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold gold-text-gradient">$49.99</span>
                      <AddToCartButton 
                        product={{
                          id: 'featured-3',
                          title: 'Green Serenity Gummies',
                          priceCents: 4999,
                          currency: 'EUR',
                          image: '/products/cbd-gummies.svg',
                          cbdPercent: 5,
                          slug: 'green-serenity-gummies'
                        }}
                      />
                    </div>
              </div>
            </div>

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

      {/* CTA Section */}
      <section className="py-24 bg-brand-black">
        <div className="container mx-auto px-6">
          <Newsletter variant="hero" />
        </div>
      </section>
    </div>
  )
}