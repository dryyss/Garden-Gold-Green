'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faSpinner, faHome, faBox } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import Image from 'next/image'
import { Breadcrumb } from '@/components/Breadcrumb'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!sessionId) {
      router.push('/cart')
      return
    }

    // Récupérer les détails de la commande
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/orders/session/${sessionId}`)
        if (response.ok) {
          const data = await response.json()
          setOrderDetails(data)
        }
      } catch (error) {
        console.error('Erreur récupération commande:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Vider le panier
    localStorage.removeItem('garden-gold-green-cart')

    // Attendre 1 seconde pour l'effet
    setTimeout(() => {
      fetchOrderDetails()
    }, 1000)
  }, [sessionId, router])

  const breadcrumbItems = [
    { label: 'Accueil', href: '/' },
    { label: 'Panier', href: '/cart' },
    { label: 'Paiement', href: '/checkout' },
    { label: 'Confirmation', href: '/checkout/success' },
  ]

  return (
    <main className="bg-brand-black min-h-screen py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            // Loading state
            <div className="card-bg rounded-2xl p-12 text-center">
              <FontAwesomeIcon
                icon={faSpinner}
                className="w-16 h-16 text-brand-gold mx-auto mb-6 animate-spin"
              />
              <h1 className="text-2xl font-bold text-white mb-4">
                Traitement de votre commande...
              </h1>
              <p className="text-gray-400">
                Veuillez patienter quelques instants
              </p>
            </div>
          ) : (
            // Success state
            <div className="card-bg rounded-2xl p-8 md:p-12">
              {/* Success Icon */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-green/20 mb-6">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="w-12 h-12 text-brand-green"
                  />
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Commande Confirmée !
                </h1>
                
                <p className="text-gray-300 text-lg mb-2">
                  Merci pour votre achat
                </p>
                
                {orderDetails && (
                  <p className="text-gray-400">
                    Commande #{orderDetails.id}
                  </p>
                )}
              </div>

              {/* Order Details */}
              {orderDetails && (
                <div className="bg-black/30 rounded-xl p-6 mb-8">
                  <h2 className="text-xl font-bold text-white mb-4">
                    Détails de la commande
                  </h2>
                  
                  <div className="space-y-3 text-gray-300">
                    <div className="flex justify-between">
                      <span>Email de confirmation :</span>
                      <span className="text-brand-gold">{orderDetails.customerEmail}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Montant total :</span>
                      <span className="text-brand-gold font-bold">
                        {orderDetails.total.toFixed(2)} €
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Statut :</span>
                      <span className="text-brand-green">Payée</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Box */}
              <div className="bg-brand-gold/10 border border-brand-gold/20 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-brand-gold mb-2">
                  📧 Email de confirmation envoyé
                </h3>
                <p className="text-gray-300 text-sm">
                  Un email de confirmation avec les détails de votre commande et le numéro de suivi 
                  vous a été envoyé. Consultez votre boîte de réception.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/orders"
                  className="flex-1 btn-gold text-black font-bold py-4 px-6 rounded-xl text-center flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                >
                  <FontAwesomeIcon icon={faBox} />
                  Suivre ma commande
                </Link>
                
                <Link
                  href="/"
                  className="flex-1 bg-white/10 text-white font-bold py-4 px-6 rounded-xl text-center flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
                >
                  <FontAwesomeIcon icon={faHome} />
                  Retour à l'accueil
                </Link>
              </div>

              {/* Products Section */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <h3 className="text-xl font-bold text-white mb-6">
                  Continuez vos achats
                </h3>
                
                <Link
                  href="/products"
                  className="block text-center text-brand-gold hover:text-brand-gold/80 transition-colors"
                >
                  Découvrir nos produits →
                </Link>
              </div>
            </div>
          )}

          {/* Trust Badges */}
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-brand-gold text-3xl mb-2">🔒</div>
              <p className="text-gray-400 text-sm">Paiement Sécurisé</p>
            </div>
            <div>
              <div className="text-brand-gold text-3xl mb-2">🚚</div>
              <p className="text-gray-400 text-sm">Livraison Rapide</p>
            </div>
            <div>
              <div className="text-brand-gold text-3xl mb-2">✅</div>
              <p className="text-gray-400 text-sm">Garantie Qualité</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
