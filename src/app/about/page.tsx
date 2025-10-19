'use client'

import React from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faLeaf, 
  faFlask, 
  faHeart, 
  faAward,
  faUsers,
  faGlobe,
  faShieldAlt,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons'

export default function AboutPage() {
  return (
    <main className="bg-brand-black min-h-screen pt-24">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="hero-bg absolute inset-0"></div>
        <div className="hero-overlay absolute inset-0"></div>
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About <span className="gold-text-gradient">Garden Gold Green</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We are passionate about bringing you the highest quality CBD products, 
            crafted with care and backed by science. Our mission is to help you 
            achieve optimal wellness through nature&apos;s most powerful plant.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Our Story</h2>
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                  Founded in 2018 by a team of wellness enthusiasts and agricultural experts, 
                  Garden Gold Green began with a simple vision: to make premium CBD products 
                  accessible to everyone while maintaining the highest standards of quality and purity.
                </p>
                <p>
                  Our journey started in the fertile fields of Colorado, where we discovered 
                  the perfect growing conditions for premium hemp. We partnered with local 
                  farmers who shared our commitment to sustainable, organic farming practices.
                </p>
                <p>
                  Today, we&apos;re proud to serve thousands of customers worldwide, helping them 
                  discover the natural benefits of CBD for their health and wellness journey.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative w-full h-96 rounded-2xl overflow-hidden">
                <Image
                  src="/images/about-hemp-fields.jpg"
                  alt="Hemp fields in Colorado"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Our Values</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything we do is guided by our core values of quality, transparency, and customer care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card-bg rounded-2xl p-8 text-center border border-white/10">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faLeaf} className="text-brand-gold text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Natural & Pure</h3>
              <p className="text-gray-300">
                We use only the finest, organically grown hemp and natural ingredients in all our products.
              </p>
            </div>

            <div className="card-bg rounded-2xl p-8 text-center border border-white/10">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faFlask} className="text-brand-gold text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Lab Tested</h3>
              <p className="text-gray-300">
                Every batch is rigorously tested by third-party laboratories to ensure purity and potency.
              </p>
            </div>

            <div className="card-bg rounded-2xl p-8 text-center border border-white/10">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faHeart} className="text-brand-gold text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Customer First</h3>
              <p className="text-gray-300">
                Your satisfaction and well-being are our top priorities. We&apos;re here to support you every step of the way.
              </p>
            </div>

            <div className="card-bg rounded-2xl p-8 text-center border border-white/10">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faAward} className="text-brand-gold text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Premium Quality</h3>
              <p className="text-gray-300">
                We never compromise on quality. Every product meets our strict standards for excellence.
              </p>
            </div>

            <div className="card-bg rounded-2xl p-8 text-center border border-white/10">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faUsers} className="text-brand-gold text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Community</h3>
              <p className="text-gray-300">
                We believe in building a community of wellness enthusiasts who support each other&apos;s journey.
              </p>
            </div>

            <div className="card-bg rounded-2xl p-8 text-center border border-white/10">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faGlobe} className="text-brand-gold text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Sustainability</h3>
              <p className="text-gray-300">
                We&apos;re committed to sustainable practices that protect our planet for future generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-24 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Our Process</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From seed to shelf, we maintain the highest standards at every step of our production process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-brand-gold text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Seed Selection</h3>
              <p className="text-gray-300">
                We carefully select the finest hemp seeds from certified organic farms.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-brand-gold text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Organic Growing</h3>
              <p className="text-gray-300">
                Our hemp is grown using sustainable, organic farming practices without pesticides.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-brand-gold text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Extraction</h3>
              <p className="text-gray-300">
                We use state-of-the-art CO2 extraction to preserve the plant&apos;s beneficial compounds.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-brand-gold text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Testing & Quality</h3>
              <p className="text-gray-300">
                Every product is tested by third-party labs to ensure purity and potency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Why Choose Garden Gold Green?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We&apos;re not just another CBD company. Here&apos;s what sets us apart from the competition.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-brand-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-brand-gold text-sm" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Third-Party Tested</h3>
                  <p className="text-gray-300">
                    All our products are tested by independent laboratories to ensure they meet our high standards.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-brand-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-brand-gold text-sm" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">100% Organic</h3>
                  <p className="text-gray-300">
                    Our hemp is grown without pesticides, herbicides, or other harmful chemicals.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-brand-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-brand-gold text-sm" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Full Spectrum</h3>
                  <p className="text-gray-300">
                    Our products contain the full spectrum of cannabinoids for maximum effectiveness.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-brand-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-brand-gold text-sm" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Money-Back Guarantee</h3>
                  <p className="text-gray-300">
                    If you&apos;re not completely satisfied, we&apos;ll refund your purchase, no questions asked.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative w-full h-96 rounded-2xl overflow-hidden">
                <Image
                  src="/images/about-lab-testing.jpg"
                  alt="Lab testing process"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-brand-gold/10 to-brand-green/10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Wellness Journey?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover our premium CBD products and experience the difference that quality makes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="btn-gold text-black font-bold py-4 px-8 rounded-full shadow-gold-glow inline-flex items-center justify-center"
            >
              Shop Our Products
            </a>
            <a
              href="/contact"
              className="bg-white/10 text-white hover:bg-white/20 font-bold py-4 px-8 rounded-full inline-flex items-center justify-center transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
