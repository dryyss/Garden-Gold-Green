'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faHome, 
  faArrowLeft, 
  faSearch,
  faShoppingBag,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'

export default function NotFound() {
  return (
    <main className="bg-brand-black min-h-screen flex items-center justify-center py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <Image
              className="h-16 w-16 mr-4"
              src="/logo.png"
              alt="Garden Gold Green logo"
              width={64}
              height={64}
            />
            <div>
              <h1 className="text-3xl font-bold text-white">GARDEN GOLD GREEN</h1>
              <p className="text-gray-400 text-sm">Premium CBD Collection</p>
            </div>
          </div>

          {/* 404 Content */}
          <div className="card-bg rounded-2xl p-12 shadow-2xl mb-8">
            <div className="mb-8">
              <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-400 text-3xl" />
              </div>
              <h2 className="text-6xl font-bold text-white mb-4">404</h2>
              <h3 className="text-2xl font-semibold text-white mb-4">Page introuvable</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée. 
                Il se peut que l&apos;URL soit incorrecte ou que la page ait été supprimée.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="btn-gold text-black font-bold py-3 px-8 rounded-full shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faHome} />
                Retour à l&apos;accueil
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="bg-white/10 text-white font-semibold py-3 px-8 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Page précédente
              </button>
            </div>
          </div>

          {/* Helpful Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/products"
              className="card-bg rounded-xl p-6 hover:bg-white/5 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-green/30 transition-colors">
                <FontAwesomeIcon icon={faShoppingBag} className="text-brand-green text-xl" />
              </div>
              <h4 className="text-white font-semibold mb-2">Nos produits</h4>
              <p className="text-gray-400 text-sm">Découvrez notre collection premium de CBD</p>
            </Link>

            <Link
              href="/search"
              className="card-bg rounded-xl p-6 hover:bg-white/5 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-gold/30 transition-colors">
                <FontAwesomeIcon icon={faSearch} className="text-brand-gold text-xl" />
              </div>
              <h4 className="text-white font-semibold mb-2">Rechercher</h4>
              <p className="text-gray-400 text-sm">Trouvez ce que vous cherchez</p>
            </Link>

            <Link
              href="/contact"
              className="card-bg rounded-xl p-6 hover:bg-white/5 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600/30 transition-colors">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-blue-400 text-xl" />
              </div>
              <h4 className="text-white font-semibold mb-2">Support</h4>
              <p className="text-gray-400 text-sm">Besoin d&apos;aide ? Contactez-nous</p>
            </Link>
          </div>

          {/* Popular Products */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-white mb-6">Produits populaires</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/products/huile-cbd-10"
                className="card-bg rounded-lg p-4 hover:bg-white/5 transition-all duration-300"
              >
                <div className="w-full h-32 bg-gradient-to-br from-brand-green/20 to-brand-gold/20 rounded-lg mb-3"></div>
                <h4 className="text-white font-medium text-sm">Huile CBD 10%</h4>
                <p className="text-brand-gold font-semibold text-sm">29,90 €</p>
              </Link>
              
              <Link
                href="/products/baume-cbd"
                className="card-bg rounded-lg p-4 hover:bg-white/5 transition-all duration-300"
              >
                <div className="w-full h-32 bg-gradient-to-br from-brand-gold/20 to-brand-green/20 rounded-lg mb-3"></div>
                <h4 className="text-white font-medium text-sm">Baume CBD</h4>
                <p className="text-brand-gold font-semibold text-sm">34,90 €</p>
              </Link>
              
              <Link
                href="/products/gummies-cbd"
                className="card-bg rounded-lg p-4 hover:bg-white/5 transition-all duration-300"
              >
                <div className="w-full h-32 bg-gradient-to-br from-brand-green/20 to-blue-600/20 rounded-lg mb-3"></div>
                <h4 className="text-white font-medium text-sm">Gummies CBD</h4>
                <p className="text-brand-gold font-semibold text-sm">59,99 €</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
