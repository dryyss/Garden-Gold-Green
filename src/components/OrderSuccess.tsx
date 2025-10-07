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
  onContinueShopping?: () => void
}

export function OrderSuccess({ 
  orderNumber = 'GG-2024-001', 
  estimatedDelivery = '3-5 jours ouvrés',
  onContinueShopping
}: OrderSuccessProps) {
  return (
    <div className="bg-brand-black min-h-screen text-gray-300 pt-24">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-brand-green/20 flex items-center justify-center mx-auto mb-8 border border-brand-green">
            <FontAwesomeIcon icon={faCheckCircle} className="text-brand-green text-3xl" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-white mb-6 gold-text-gradient">
            Commande Confirmée !
          </h1>
          
          <p className="text-lg text-gray-300 mb-8">
            Merci pour votre commande. Nous avons bien reçu votre paiement et 
            nous préparons votre colis avec soin.
          </p>

          {/* Order Details */}
          <div className="card-bg rounded-xl p-6 mb-8 text-left">
            <h2 className="text-xl font-bold text-white mb-4">Détails de votre commande</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Numéro de commande</span>
                <span className="text-white font-semibold">{orderNumber}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Statut</span>
                <span className="text-brand-green font-semibold">Confirmée</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Livraison estimée</span>
                <span className="text-white font-semibold">{estimatedDelivery}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="card-bg rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-white mb-4">Prochaines étapes</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faEnvelope} className="text-brand-gold text-sm" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold">Email de confirmation</p>
                  <p className="text-gray-400 text-sm">
                    Vous recevrez un email avec tous les détails de votre commande
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-brand-green/20 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faTruck} className="text-brand-green text-sm" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold">Préparation et expédition</p>
                  <p className="text-gray-400 text-sm">
                    Votre commande sera préparée et expédiée dans les 24h
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-brand-silver/20 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faDownload} className="text-brand-silver text-sm" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold">Suivi de livraison</p>
                  <p className="text-gray-400 text-sm">
                    Vous recevrez un numéro de suivi pour suivre votre colis
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products" 
              className="btn-gold text-black font-bold py-3 px-8 rounded-full shadow-gold-glow flex items-center justify-center"
            >
              Continuer mes achats
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Link>
            
            <Link 
              href="/" 
              className="bg-transparent border-2 border-brand-green text-brand-green font-bold py-3 px-8 rounded-full hover:bg-brand-green hover:text-black transition-all duration-300 flex items-center justify-center"
            >
              Retour à l'accueil
            </Link>
          </div>

          {/* Support */}
          <div className="mt-12 p-4 bg-white/5 rounded-lg">
            <p className="text-gray-400 text-sm">
              Des questions ? Contactez notre service client au{' '}
              <a href="tel:+33123456789" className="text-brand-gold hover:underline">
                +33 1 23 45 67 89
              </a>
              {' '}ou par email à{' '}
              <a href="mailto:support@gardengoldgreen.com" className="text-brand-gold hover:underline">
                support@gardengoldgreen.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}