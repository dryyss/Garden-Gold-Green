import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faFileContract, faGavel, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

export default function TermsPage() {
  return (
    <div className="bg-brand-black min-h-screen text-gray-300 pt-36">
      {/* Back Button */}
      <div className="container mx-auto px-6 py-8">
        <Link 
          href="/" 
          className="text-gray-400 hover:text-brand-gold transition-colors flex items-center"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Retour à l'accueil
        </Link>
      </div>

      {/* Header */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-brand-gold/20 flex items-center justify-center mx-auto mb-6 border border-brand-gold">
              <FontAwesomeIcon icon={faFileContract} className="text-brand-gold text-2xl" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 gold-text-gradient">
              Conditions Générales d'Utilisation
            </h1>
            <p className="text-xl text-gray-300">
              Dernière mise à jour : 6 janvier 2025
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto prose prose-invert prose-lg max-w-none">
            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient flex items-center">
                <FontAwesomeIcon icon={faGavel} className="mr-3" />
                Article 1 - Objet
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Les présentes conditions générales d'utilisation (CGU) régissent l'utilisation du site web 
                Garden Gold Green (gardengoldgreen.com) et l'achat de produits CBD. L'utilisation du site 
                implique l'acceptation pleine et entière des présentes CGU.
              </p>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Article 2 - Mentions légales
              </h2>
              <div className="text-gray-300 space-y-2">
                <p><strong>Raison sociale :</strong> Garden Gold Green SAS</p>
                <p><strong>Siège social :</strong> 123 Avenue des Champs-Élysées, 75008 Paris, France</p>
                <p><strong>SIRET :</strong> 123 456 789 00012</p>
                <p><strong>Capital social :</strong> 50 000 €</p>
                <p><strong>Directeur de publication :</strong> Marie Dubois</p>
                <p><strong>Hébergeur :</strong> Vercel Inc.</p>
              </div>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Article 3 - Accès au site
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Le site est accessible 24h/24, 7j/7, sauf en cas de force majeure ou de maintenance. 
                Garden Gold Green se réserve le droit de modifier ou d'interrompre l'accès au site 
                sans préavis.
              </p>
              <p className="text-gray-300 leading-relaxed">
                L'accès au site est réservé aux personnes majeures (18 ans et plus). 
                En commandant, vous certifiez être majeur et avoir la capacité juridique de contracter.
              </p>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Article 4 - Produits et commandes
              </h2>
              <h3 className="text-xl font-semibold text-white mb-3">4.1 Produits</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Nos produits CBD sont conformes à la réglementation française en vigueur. 
                Ils contiennent moins de 0,3% de THC et sont destinés à un usage cosmétique ou de bien-être.
              </p>
              
              <h3 className="text-xl font-semibold text-white mb-3">4.2 Commandes</h3>
              <ul className="text-gray-300 space-y-2 mb-4">
                <li>• Les commandes sont traitées dans l'ordre de réception</li>
                <li>• Garden Gold Green se réserve le droit d'annuler toute commande</li>
                <li>• Les prix sont indiqués en euros TTC</li>
                <li>• Les frais de port sont calculés selon le montant de la commande</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-white mb-3">4.3 Livraison</h3>
              <p className="text-gray-300 leading-relaxed">
                Les délais de livraison sont indicatifs. Garden Gold Green ne peut être tenu responsable 
                des retards dus aux transporteurs ou à des cas de force majeure.
              </p>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Article 5 - Paiement
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Le paiement s'effectue au moment de la commande par carte bancaire, PayPal ou virement. 
                Les données de paiement sont sécurisées et chiffrées.
              </p>
              <p className="text-gray-300 leading-relaxed">
                En cas de non-paiement, Garden Gold Green se réserve le droit d'annuler la commande 
                et de suspendre l'accès au compte client.
              </p>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Article 6 - Droit de rétractation
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Conformément à la législation française, vous disposez d'un délai de 14 jours 
                pour exercer votre droit de rétractation à compter de la réception des produits.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Les produits doivent être retournés dans leur emballage d'origine, non ouverts, 
                accompagnés du bon de retour. Les frais de retour sont à votre charge.
              </p>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Article 7 - Responsabilité
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Garden Gold Green ne peut être tenu responsable :
              </p>
              <ul className="text-gray-300 space-y-2 mb-4">
                <li>• Des dommages indirects résultant de l'utilisation des produits</li>
                <li>• Des interruptions de service dues à des cas de force majeure</li>
                <li>• Des erreurs ou omissions dans les informations du site</li>
                <li>• Des dommages causés par un usage inapproprié des produits</li>
              </ul>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient flex items-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-3" />
                Article 8 - Avertissements importants
              </h2>
              <div className="bg-amber-900/20 border border-amber-800/30 rounded-lg p-6 mb-6">
                <p className="text-amber-200 font-semibold mb-4">
                  ⚠️ Avertissements concernant les produits CBD :
                </p>
                <ul className="text-amber-200 space-y-2">
                  <li>• Les produits CBD ne sont pas des médicaments</li>
                  <li>• Consultez votre médecin avant utilisation</li>
                  <li>• Ne pas utiliser pendant la grossesse ou l'allaitement</li>
                  <li>• Tenir hors de portée des enfants</li>
                  <li>• Respecter les dosages recommandés</li>
                </ul>
              </div>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Article 9 - Propriété intellectuelle
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Tous les éléments du site (textes, images, logos, design) sont protégés par le droit d'auteur. 
                Toute reproduction ou utilisation sans autorisation est interdite.
              </p>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Article 10 - Données personnelles
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Le traitement de vos données personnelles est régi par notre 
                <Link href="/privacy" className="text-brand-gold hover:underline ml-1">
                  politique de confidentialité
                </Link>.
              </p>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Article 11 - Droit applicable et juridiction
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Les présentes CGU sont soumises au droit français. En cas de litige, 
                les tribunaux français seront seuls compétents.
              </p>
            </div>

            <div className="card-bg rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Article 12 - Contact
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Pour toute question concernant ces CGU :
              </p>
              <div className="text-gray-300 space-y-2">
                <p>Email : legal@gardengoldgreen.com</p>
                <p>Téléphone : +33 1 23 45 67 89</p>
                <p>Adresse : 123 Avenue des Champs-Élysées, 75008 Paris, France</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
