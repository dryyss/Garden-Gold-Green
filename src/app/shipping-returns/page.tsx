import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faArrowLeft, 
  faTruck, 
  faUndo, 
  faShieldAlt, 
  faClock,
  faMapMarkerAlt,
  faBox,
  faCheckCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'

export default function ShippingReturnsPage() {
  return (
    <div className="bg-brand-black min-h-screen text-gray-300 pt-24">
      {/* Back Button */}
      <div className="container mx-auto px-6 py-8">
        <Link 
          href="/" 
          className="text-gray-400 hover:text-brand-gold transition-colors flex items-center"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Retour à l&apos;accueil
        </Link>
      </div>

      {/* Header */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-brand-gold/20 flex items-center justify-center mx-auto mb-6 border border-brand-gold">
              <FontAwesomeIcon icon={faTruck} className="text-brand-gold text-2xl" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 gold-text-gradient">
              Livraison & Retours
            </h1>
            <p className="text-xl text-gray-300">
              Informations détaillées sur nos services de livraison et notre politique de retour
            </p>
          </div>
        </div>
      </section>

      {/* Shipping Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Options de Livraison
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <div className="card-bg rounded-2xl p-8 text-center border border-white/10">
                <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FontAwesomeIcon icon={faTruck} className="text-brand-gold text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Livraison Standard</h3>
                <p className="text-gray-300 mb-4">
                  Livraison en 3-5 jours ouvrés
                </p>
                <p className="text-brand-gold font-semibold">
                  Gratuite dès 75€
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Sinon 4,90€
                </p>
              </div>

              <div className="card-bg rounded-2xl p-8 text-center border border-white/10">
                <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FontAwesomeIcon icon={faClock} className="text-brand-gold text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Livraison Express</h3>
                <p className="text-gray-300 mb-4">
                  Livraison en 1-2 jours ouvrés
                </p>
                <p className="text-brand-gold font-semibold">
                  9,90€
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Disponible partout en France
                </p>
              </div>

              <div className="card-bg rounded-2xl p-8 text-center border border-white/10">
                <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-brand-gold text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Point Relais</h3>
                <p className="text-gray-300 mb-4">
                  Retrait en point relais
                </p>
                <p className="text-brand-gold font-semibold">
                  Gratuit dès 50€
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Sinon 2,90€
                </p>
              </div>
            </div>

            <div className="card-bg rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FontAwesomeIcon icon={faBox} className="mr-3 text-brand-gold" />
                Informations de Livraison
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Zones de Livraison</h4>
                  <ul className="text-gray-300 space-y-2">
                    <li>• France métropolitaine</li>
                    <li>• Corse</li>
                    <li>• Monaco</li>
                    <li>• Andorre</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Délais de Traitement</h4>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Commandes avant 14h : expédiées le jour même</li>
                    <li>• Commandes après 14h : expédiées le lendemain</li>
                    <li>• Week-ends et jours fériés : non traités</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card-bg rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FontAwesomeIcon icon={faShieldAlt} className="mr-3 text-brand-gold" />
                Suivi et Sécurité
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Suivi de Commande</h4>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Numéro de suivi fourni par e-mail</li>
                    <li>• Suivi en temps réel sur le site du transporteur</li>
                    <li>• Notifications SMS optionnelles</li>
                    <li>• Historique des commandes dans votre compte</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Emballage Sécurisé</h4>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Emballage discret et neutre</li>
                    <li>• Protection contre la casse</li>
                    <li>• Respect de la température</li>
                    <li>• Aucune mention CBD visible</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Returns Section */}
      <section className="py-16 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Politique de Retour
            </h2>

            <div className="card-bg rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FontAwesomeIcon icon={faUndo} className="mr-3 text-brand-gold" />
                Droit de Rétractation
              </h3>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Conformément à la législation française, vous disposez d&apos;un délai de <strong>14 jours</strong> 
                  pour exercer votre droit de rétractation à compter de la réception de votre commande.
                </p>
                <p>
                  Ce délai vous permet de changer d&apos;avis sans avoir à justifier de motifs ni à payer de pénalités.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="card-bg rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-3 text-brand-gold" />
                  Conditions de Retour
                </h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Produits non ouverts et dans leur emballage d&apos;origine</li>
                  <li>• Étiquettes et emballages intacts</li>
                  <li>• Aucun signe d&apos;utilisation</li>
                  <li>• Retour dans les 14 jours suivant la réception</li>
                  <li>• Formulaire de retour complété</li>
                </ul>
              </div>

              <div className="card-bg rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="mr-3 text-brand-gold" />
                  Produits Exclus
                </h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Produits personnalisés</li>
                  <li>• Produits périssables</li>
                  <li>• Produits ouverts pour des raisons d&apos;hygiène</li>
                  <li>• Produits endommagés par le client</li>
                  <li>• Produits non conformes aux conditions</li>
                </ul>
              </div>
            </div>

            <div className="card-bg rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                Procédure de Retour
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-brand-gold font-bold text-lg">1</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Contactez-nous</h4>
                  <p className="text-gray-300 text-sm">
                    Envoyez-nous un e-mail à <a href="mailto:returns@gardengoldgreen.com" className="text-brand-gold hover:underline">returns@gardengoldgreen.com</a> avec votre numéro de commande
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-brand-gold font-bold text-lg">2</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Recevez l&apos;étiquette</h4>
                  <p className="text-gray-300 text-sm">
                    Nous vous envoyons une étiquette de retour prépayée et les instructions
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-brand-gold font-bold text-lg">3</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Remboursement</h4>
                  <p className="text-gray-300 text-sm">
                    Dès réception, nous procédons au remboursement sous 5 jours ouvrés
                  </p>
                </div>
              </div>
            </div>

            <div className="card-bg rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                Remboursement
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Modalités</h4>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Remboursement intégral du prix d&apos;achat</li>
                    <li>• Frais de retour à notre charge</li>
                    <li>• Remboursement sous 5 jours ouvrés</li>
                    <li>• Même mode de paiement que la commande</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Délais</h4>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Traitement : 2-3 jours ouvrés</li>
                    <li>• Remboursement : 3-5 jours ouvrés</li>
                    <li>• Notification par e-mail</li>
                    <li>• Suivi dans votre compte client</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Questions Fréquentes
            </h2>
            
            <div className="space-y-6">
              <div className="card-bg rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Puis-je modifier mon adresse de livraison ?
                </h3>
                <p className="text-gray-300">
                  Oui, tant que votre commande n&apos;a pas été expédiée. Contactez-nous rapidement 
                  à <a href="mailto:contact@gardengoldgreen.com" className="text-brand-gold hover:underline">contact@gardengoldgreen.com</a>.
                </p>
              </div>

              <div className="card-bg rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Que faire si mon colis est endommagé ?
                </h3>
                <p className="text-gray-300">
                  Contactez-nous immédiatement avec des photos. Nous vous enverrons un produit de 
                  remplacement ou procéderons au remboursement.
                </p>
              </div>

              <div className="card-bg rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Puis-je échanger un produit ?
                </h3>
                <p className="text-gray-300">
                  Oui, dans les 14 jours suivant la réception. Le produit doit être dans son état 
                  d&apos;origine. Les frais d&apos;échange sont à notre charge.
                </p>
              </div>

              <div className="card-bg rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Que se passe-t-il si je ne suis pas chez moi ?
                </h3>
                <p className="text-gray-300">
                  Le transporteur laissera un avis de passage. Vous pourrez programmer une nouvelle 
                  livraison ou récupérer votre colis au point relais le plus proche.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-gradient-to-r from-brand-gold/10 to-brand-green/10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Besoin d&apos;aide ?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Notre équipe client est là pour vous accompagner dans toutes vos démarches.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="btn-gold text-black font-bold py-4 px-8 rounded-full shadow-gold-glow inline-flex items-center justify-center"
            >
              Nous Contacter
            </a>
            <a
              href="mailto:contact@gardengoldgreen.com"
              className="bg-white/10 text-white hover:bg-white/20 font-bold py-4 px-8 rounded-full inline-flex items-center justify-center transition-colors"
            >
              contact@gardengoldgreen.com
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}