'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faHome, 
  faSearch,
  faArrowLeft,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons'

export default function NotFound() {
  return (
    <div className="bg-brand-black min-h-screen text-gray-300 pt-36 flex items-center justify-center">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            {/* 404 Animation */}
            <div className="relative mb-8">
              <div className="text-9xl font-bold gold-text-gradient opacity-20">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Garden Gold Green Logo"
                  width={120}
                  height={120}
                  className="opacity-60"
                />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              Page introuvable
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée. 
              Mais ne vous inquiétez pas, nos produits CBD premium vous attendent !
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/"
              className="btn-gold text-black font-bold py-4 px-8 rounded-full shadow-gold-glow flex items-center justify-center text-lg"
            >
              <FontAwesomeIcon icon={faHome} className="mr-2" />
              Retour à l'accueil
            </Link>
            
            <Link
              href="/products"
              className="bg-white/10 text-gray-300 hover:bg-white/20 font-bold py-4 px-8 rounded-full transition-colors flex items-center justify-center text-lg"
            >
              <FontAwesomeIcon icon={faSearch} className="mr-2" />
              Découvrir nos produits
            </Link>
          </div>

          {/* Popular Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Link
              href="/products"
              className="card-bg rounded-xl p-6 hover:bg-white/5 transition-colors text-center group"
            >
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-gold/30 transition-colors">
                <FontAwesomeIcon icon={faSearch} className="text-2xl text-brand-gold" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Nos Produits</h3>
              <p className="text-gray-400 text-sm">Découvrez notre gamme de produits CBD premium</p>
            </Link>
            
            <Link
              href="/about"
              className="card-bg rounded-xl p-6 hover:bg-white/5 transition-colors text-center group"
            >
              <div className="w-16 h-16 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-green/30 transition-colors">
                <FontAwesomeIcon icon={faQuestionCircle} className="text-2xl text-brand-green" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">À Propos</h3>
              <p className="text-gray-400 text-sm">En savoir plus sur Garden Gold Green</p>
            </Link>
            
            <Link
              href="/contact"
              className="card-bg rounded-xl p-6 hover:bg-white/5 transition-colors text-center group"
            >
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors">
                <FontAwesomeIcon icon={faArrowLeft} className="text-2xl text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Contact</h3>
              <p className="text-gray-400 text-sm">Besoin d'aide ? Contactez-nous</p>
            </Link>
          </div>

          {/* Search Suggestion */}
          <div className="card-bg rounded-xl p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-4">
              Vous cherchez quelque chose de spécifique ?
            </h3>
            <p className="text-gray-400 mb-6">
              Utilisez notre barre de recherche pour trouver rapidement ce que vous cherchez.
            </p>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher des produits..."
                  className="input-field w-full pl-12 pr-4"
                />
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}