'use client'

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCheckCircle, 
  faEnvelope, 
  faTruck,
  faArrowRight,
  faDownload
} from '@fortawesome/free-solid-svg-icons'

interface OrderSuccessProps {
  orderNumber?: string
  estimatedDelivery?: string
}

export function OrderSuccess({ 
  orderNumber = 'GG-2024-001', 
  estimatedDelivery = '3-5 jours ouvrés'
}: OrderSuccessProps) {
  return (
    <div className="bg-brand-black min-h-screen text-gray-300 pt-24">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon avec animation */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-green/20 flex items-center justify-center mx-auto mb-6 sm:mb-8 border border-brand-green animate-pulse">
            <FontAwesomeIcon icon={faCheckCircle} className="text-brand-green text-2xl sm:text-3xl" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 gold-text-gradient">
            Commande Confirmée !
          </h1>
          
          <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 px-2">
            Merci pour votre commande. Nous avons bien reçu votre paiement et 
            nous préparons votre colis avec soin.
          </p>

          {/* Order Details - Responsive */}
          <div className="card-bg rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 text-left shadow-lg">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Détails de votre commande</h2>
            
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-400 text-sm sm:text-base">Numéro de commande</span>
                <span className="text-white font-semibold text-sm sm:text-base">{orderNumber}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-400 text-sm sm:text-base">Statut</span>
                <span className="text-brand-green font-semibold text-sm sm:text-base flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-green rounded-full"></span>
                  Confirmée
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-400 text-sm sm:text-base">Livraison estimée</span>
                <span className="text-white font-semibold text-sm sm:text-base">{estimatedDelivery}</span>
              </div>
            </div>
          </div>

          {/* Next Steps - Responsive */}
          <div className="card-bg rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
            <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">Prochaines étapes</h3>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faEnvelope} className="text-brand-gold text-sm sm:text-base" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-white font-semibold text-sm sm:text-base">Email de confirmation</p>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Vous recevrez un email avec tous les détails de votre commande
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-green/20 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faTruck} className="text-brand-green text-sm sm:text-base" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-white font-semibold text-sm sm:text-base">Préparation et expédition</p>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Votre commande sera préparée et expédiée dans les 24h
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-silver/20 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faDownload} className="text-brand-silver text-sm sm:text-base" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-white font-semibold text-sm sm:text-base">Suivi de livraison</p>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Vous recevrez un numéro de suivi pour suivre votre colis
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Responsive */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
            <Link 
              href="/products" 
              className="btn-gold text-black font-bold py-3 px-6 sm:px-8 rounded-full shadow-gold-glow flex items-center justify-center hover:scale-105 transition-transform text-sm sm:text-base"
            >
              Continuer mes achats
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Link>
            
            <Link 
              href="/" 
              className="bg-transparent border-2 border-brand-green text-brand-green font-bold py-3 px-6 sm:px-8 rounded-full hover:bg-brand-green hover:text-black transition-all duration-300 flex items-center justify-center hover:scale-105 text-sm sm:text-base"
            >
              Retour à l&apos;accueil
            </Link>
          </div>

          {/* Support - Responsive */}
          <div className="mt-8 sm:mt-12 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Des questions ? Contactez notre service client au{' '}
              <a href="tel:+33123456789" className="text-brand-gold hover:underline font-semibold">
                +33 1 23 45 67 89
              </a>
              {' '}ou par email à{' '}
              <a href="mailto:support@gardengoldgreen.com" className="text-brand-gold hover:underline font-semibold">
                support@gardengoldgreen.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}



