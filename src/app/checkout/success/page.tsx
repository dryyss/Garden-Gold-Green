'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faShoppingBag, faEnvelope, faHome } from '@fortawesome/free-solid-svg-icons'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const paymentIntentId = searchParams.get('payment_intent')
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (paymentIntentId) {
      // Récupérer les détails de la commande
      fetch(`/api/orders/${paymentIntentId}`)
        .then(res => res.json())
        .then(data => {
          setOrderDetails(data)
          setIsLoading(false)
        })
        .catch(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [paymentIntentId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-black pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-black pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Succès */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FontAwesomeIcon icon={faCheckCircle} className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">
              Paiement confirmé !
            </h1>
            
            <p className="text-gray-300 text-lg">
              Merci pour votre achat. Votre commande a été traitée avec succès.
            </p>
          </div>

          {/* Détails de la commande */}
          {orderDetails && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                Détails de votre commande
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Numéro de commande :</span>
                  <span className="text-white font-mono">#{orderDetails.id}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-300">Email :</span>
                  <span className="text-white">{orderDetails.customerEmail}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-300">Montant :</span>
                  <span className="text-white font-semibold">
                    {orderDetails.totalAmount}€
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-300">Statut :</span>
                  <span className="text-green-400 font-semibold">
                    Paiement confirmé
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Prochaines étapes */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              Prochaines étapes
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-black">1</span>
                </div>
                <div>
                  <p className="text-white font-medium">Email de confirmation</p>
                  <p className="text-gray-300 text-sm">
                    Vous recevrez un email de confirmation dans les prochaines minutes.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-black">2</span>
                </div>
                <div>
                  <p className="text-white font-medium">Préparation de votre commande</p>
                  <p className="text-gray-300 text-sm">
                    Nous préparons vos produits avec soin.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-black">3</span>
                </div>
                <div>
                  <p className="text-white font-medium">Expédition</p>
                  <p className="text-gray-300 text-sm">
                    Vous recevrez un email avec le numéro de suivi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-brand-gold text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-2"
            >
              <FontAwesomeIcon icon={faShoppingBag} />
              <span>Continuer mes achats</span>
            </Link>
            
            <Link
              href="/orders"
              className="bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
            >
              <FontAwesomeIcon icon={faEnvelope} />
              <span>Voir mes commandes</span>
            </Link>
            
            <Link
              href="/"
              className="border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center space-x-2"
            >
              <FontAwesomeIcon icon={faHome} />
              <span>Retour à l'accueil</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}