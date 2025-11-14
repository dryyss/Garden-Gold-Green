'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCheckCircle, 
  faHome, 
  faShoppingBag,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'
import { usePaymentSuccess } from '@/hooks/usePaymentSuccess'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')
  const orderId = searchParams.get('order_id')
  const token = searchParams.get('token') // Paramètre PayPal
  const payerId = searchParams.get('PayerID') // Paramètre PayPal

  // Utiliser token comme orderId si c'est un paiement PayPal
  const effectiveOrderId = orderId || token

  const { isProcessing, displayOrderId, cartCleared } = usePaymentSuccess({
    sessionId,
    orderId: effectiveOrderId,
    onSuccess: () => {
      // Paiement traité avec succès
    },
    onError: (error) => {
      console.error('❌ Erreur lors du traitement du paiement:', error)
    }
  })

  // Rediriger si pas de session ID ou order ID
  if (!sessionId && !effectiveOrderId) {
    router.push('/')
    return null
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="text-brand-gold text-4xl animate-spin mb-4" />
          <p className="text-white">Traitement de votre paiement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-black pt-32 pb-16">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div className="card-bg rounded-2xl p-12 text-center">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-green/20 border-2 border-brand-green mb-8">
              <FontAwesomeIcon icon={faCheckCircle} className="text-brand-green text-5xl" />
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-white mb-4">
              Commande confirmée !
            </h1>

            {/* Description */}
            <p className="text-gray-300 text-lg mb-4">
              Merci pour votre commande. Vous recevrez un email de confirmation avec les détails de votre commande et les informations de livraison.
              {displayOrderId && (
                <>
                  <br />
                  <span className="text-brand-gold font-semibold text-sm">Numéro de commande : </span>
                  <span className="text-white font-mono text-sm">{displayOrderId}</span>
                </>
              )}
            </p>

            {/* Order Details */}
            <div className="bg-brand-black/50 rounded-xl p-6 mb-8 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Prochaines étapes</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-brand-gold font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Confirmation par email</h3>
                    <p className="text-gray-400 text-sm">Vous allez recevoir un email de confirmation avec tous les détails de votre commande.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-brand-gold font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Préparation de la commande</h3>
                    <p className="text-gray-400 text-sm">Notre équipe prépare votre commande avec soin.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-brand-gold font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Expédition</h3>
                    <p className="text-gray-400 text-sm">Vous recevrez un email avec le numéro de suivi dès que votre colis sera expédié.</p>
                  </div>
                </div>
              </div>
            </div>


            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="btn-gold text-black font-bold py-3 px-8 rounded-full shadow-gold-glow inline-flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                Retour à l&apos;accueil
              </Link>
              <Link
                href="/products"
                className="bg-white/10 text-gray-300 hover:bg-white/20 font-bold py-3 px-8 rounded-full inline-flex items-center justify-center transition-colors"
              >
                <FontAwesomeIcon icon={faShoppingBag} className="mr-2" />
                Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
