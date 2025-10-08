'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faArrowLeft, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { Breadcrumb } from '@/components/Breadcrumb'

export default function CheckoutCancelPage() {
  const breadcrumbItems = [
    { label: 'Accueil', href: '/' },
    { label: 'Panier', href: '/cart' },
    { label: 'Paiement annulé', href: '/checkout/cancel' },
  ]

  return (
    <main className="bg-brand-black min-h-screen py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="max-w-2xl mx-auto">
          <div className="card-bg rounded-2xl p-8 md:p-12 text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500/20 mb-6">
              <FontAwesomeIcon
                icon={faTimesCircle}
                className="w-12 h-12 text-red-500"
              />
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Paiement Annulé
            </h1>

            {/* Description */}
            <p className="text-gray-300 text-lg mb-8">
              Votre paiement a été annulé. Aucun montant n'a été débité.
            </p>

            {/* Info Box */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-bold text-white mb-3">
                Que s'est-il passé ?
              </h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>• Vous avez annulé le processus de paiement</li>
                <li>• Votre panier est toujours actif</li>
                <li>• Aucune transaction n'a été effectuée</li>
                <li>• Vos articles sont toujours disponibles</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/cart"
                className="flex-1 btn-gold text-black font-bold py-4 px-6 rounded-xl text-center flex items-center justify-center gap-2 hover:scale-105 transition-transform"
              >
                <FontAwesomeIcon icon={faShoppingCart} />
                Retour au panier
              </Link>

              <Link
                href="/products"
                className="flex-1 bg-white/10 text-white font-bold py-4 px-6 rounded-xl text-center flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Continuer mes achats
              </Link>
            </div>

            {/* Help Section */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">
                Besoin d'aide ?
              </h3>
              <p className="text-gray-400 mb-6">
                Si vous rencontrez des difficultés avec le paiement, n'hésitez pas à nous contacter.
              </p>
              <Link
                href="/contact"
                className="text-brand-gold hover:text-brand-gold/80 transition-colors"
              >
                Contactez notre support →
              </Link>
            </div>
          </div>

          {/* Additional Help */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card-bg rounded-xl p-6 text-center">
              <div className="text-brand-gold text-2xl mb-2">💳</div>
              <p className="text-gray-300 text-sm">Paiement 100% sécurisé</p>
            </div>
            <div className="card-bg rounded-xl p-6 text-center">
              <div className="text-brand-gold text-2xl mb-2">🔒</div>
              <p className="text-gray-300 text-sm">Données protégées</p>
            </div>
            <div className="card-bg rounded-xl p-6 text-center">
              <div className="text-brand-gold text-2xl mb-2">📞</div>
              <p className="text-gray-300 text-sm">Support disponible 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

