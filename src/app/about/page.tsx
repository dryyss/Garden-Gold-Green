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
    <main className="bg-brand-black min-h-screen pt-36">
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
            achieve optimal wellness through nature's most powerful plant.
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
                  farmers who shared our commitment to organic, sustainable practices, and 
                  together we built a supply chain that ensures every product meets our 
                  exacting standards.
                </p>
                <p>
                  Today, we're proud to be one of the most trusted names in the CBD industry, 
                  serving thousands of customers who rely on our products for their daily 
                  wellness routine. But we're not just selling products – we're building a 
                  community of people who believe in the power of nature to heal and restore.
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1599859024952-3430181536b1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Our hemp farm in Colorado"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-brand-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              These core principles guide everything we do, from seed to bottle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card-bg rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faLeaf} className="text-brand-green text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">100% Organic</h3>
              <p className="text-gray-400">
                We use only organic, non-GMO hemp grown without pesticides or harmful chemicals.
              </p>
            </div>

            <div className="card-bg rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faFlask} className="text-brand-gold text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Lab Tested</h3>
              <p className="text-gray-400">
                Every batch is tested by third-party labs for potency, purity, and safety.
              </p>
            </div>

            <div className="card-bg rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faHeart} className="text-brand-green text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Customer First</h3>
              <p className="text-gray-400">
                Your satisfaction and wellness are our top priorities in everything we do.
              </p>
            </div>

            <div className="card-bg rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faAward} className="text-brand-gold text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Premium Quality</h3>
              <p className="text-gray-400">
                We never compromise on quality, using only the finest ingredients and processes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-24 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">From Seed to Shelf</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our meticulous process ensures every product meets our high standards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-black">
                1
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Cultivation</h3>
              <p className="text-gray-400 leading-relaxed">
                We work with certified organic farms in Colorado to grow premium hemp 
                using sustainable, eco-friendly practices.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-black">
                2
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Extraction</h3>
              <p className="text-gray-400 leading-relaxed">
                Our state-of-the-art CO2 extraction process preserves the full spectrum 
                of beneficial cannabinoids and terpenes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-black">
                3
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Testing & Quality</h3>
              <p className="text-gray-400 leading-relaxed">
                Every batch undergoes rigorous third-party testing for potency, purity, 
                and safety before reaching you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-brand-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Passionate experts dedicated to bringing you the best CBD products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-bg rounded-xl p-8 text-center">
              <div className="w-24 h-24 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faUsers} className="text-brand-gold text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Dr. Sarah Johnson</h3>
              <p className="text-brand-gold mb-4">Chief Scientific Officer</p>
              <p className="text-gray-400 text-sm">
                PhD in Pharmacology with 15+ years of experience in cannabinoid research.
              </p>
            </div>

            <div className="card-bg rounded-xl p-8 text-center">
              <div className="w-24 h-24 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faLeaf} className="text-brand-gold text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Mike Rodriguez</h3>
              <p className="text-brand-gold mb-4">Head of Cultivation</p>
              <p className="text-gray-400 text-sm">
                Agricultural expert specializing in organic hemp cultivation and sustainability.
              </p>
            </div>

            <div className="card-bg rounded-xl p-8 text-center">
              <div className="w-24 h-24 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faGlobe} className="text-brand-gold text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Emily Chen</h3>
              <p className="text-brand-gold mb-4">Customer Experience Director</p>
              <p className="text-gray-400 text-sm">
                Dedicated to ensuring every customer has an exceptional experience with our products.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-24 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Certifications & Awards</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Recognized for our commitment to quality and excellence
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faShieldAlt} className="text-brand-green text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">USDA Organic</h3>
              <p className="text-gray-400 text-sm">Certified Organic</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faAward} className="text-brand-gold text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">ISO 9001</h3>
              <p className="text-gray-400 text-sm">Quality Management</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faCheckCircle} className="text-brand-green text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">GMP Certified</h3>
              <p className="text-gray-400 text-sm">Good Manufacturing</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faFlask} className="text-brand-gold text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Lab Verified</h3>
              <p className="text-gray-400 text-sm">Third-Party Tested</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-brand-black">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Experience the Garden Gold Green Difference?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied customers who trust us for their CBD needs. 
            Start your wellness journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="btn-gold text-black font-bold py-4 px-8 rounded-full shadow-gold-glow text-lg"
            >
              Shop Our Products
            </a>
            <a
              href="/contact"
              className="border border-white/20 text-white font-semibold py-4 px-8 rounded-full hover:bg-white/10 transition-colors text-lg"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}