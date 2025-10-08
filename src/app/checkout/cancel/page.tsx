'use client'

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faShoppingBag, faHome, faCreditCard } from '@fortawesome/free-solid-svg-icons'

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-brand-black pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Échec */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FontAwesomeIcon icon={faExclamationTriangle} className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">
              Paiement annulé
            </h1>
            
            <p className="text-gray-300 text-lg">
              Votre paiement a été annulé. Aucun montant n'a été débité de votre compte.
            </p>
          </div>

          {/* Raisons possibles */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Que s'est-il passé ?
            </h2>
            
            <div className="space-y-3 text-gray-300">
              <p>• Vous avez fermé la fenêtre de paiement</p>
              <p>• Une erreur technique s'est produite</p>
              <p>• Vous avez changé d'avis</p>
              <p>• Problème avec votre carte bancaire</p>
            </div>
          </div>

          {/* Solutions */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              Que pouvez-vous faire ?
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-black">1</span>
                </div>
                <div>
                  <p className="text-white font-medium">Réessayer le paiement</p>
                  <p className="text-gray-300 text-sm">
                    Retournez à votre panier et réessayez le paiement.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-black">2</span>
                </div>
                <div>
                  <p className="text-white font-medium">Vérifier votre carte</p>
                  <p className="text-gray-300 text-sm">
                    Assurez-vous que votre carte bancaire est valide et dispose de fonds suffisants.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-black">3</span>
                </div>
                <div>
                  <p className="text-white font-medium">Nous contacter</p>
                  <p className="text-gray-300 text-sm">
                    Si le problème persiste, n'hésitez pas à nous contacter.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cart"
              className="bg-brand-gold text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-2"
            >
              <FontAwesomeIcon icon={faCreditCard} />
              <span>Réessayer le paiement</span>
            </Link>
            
            <Link
              href="/products"
              className="bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
            >
              <FontAwesomeIcon icon={faShoppingBag} />
              <span>Continuer mes achats</span>
            </Link>
            
            <Link
              href="/"
              className="border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center space-x-2"
            >
              <FontAwesomeIcon icon={faHome} />
              <span>Retour à l'accueil</span>
            </Link>
          </div>

          {/* Support */}
          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm">
              Besoin d'aide ?{' '}
              <Link href="/contact" className="text-brand-gold hover:text-yellow-400">
                Contactez notre support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
