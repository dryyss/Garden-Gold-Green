import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faFileContract, faGavel, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

export default function TermsPage() {
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
              <FontAwesomeIcon icon={faFileContract} className="text-brand-gold text-2xl" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 gold-text-gradient">
              Conditions Générales d&apos;Utilisation
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
                Les présentes conditions générales d&apos;utilisation (CGU) régissent l&apos;utilisation du site web 
                Garden Gold Green (gardengoldgreen.com) et l&apos;achat de produits CBD. L&apos;utilisation du site 
                implique l&apos;acceptation pleine et entière des présentes CGU.
              </p>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Article 2 - Définitions
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p><strong>Site :</strong> Le site web gardengoldgreen.com</p>
                <p><strong>Éditeur :</strong> Garden Gold Green, société spécialisée dans la vente de produits CBD</p>
                <p><strong>Utilisateur :</strong> Toute personne accédant au site</p>
                <p><strong>Client :</strong> Utilisateur effectuant un achat sur le site</p>
                <p><strong>Produits :</strong> Articles CBD proposés à la vente sur le site</p>
              </div>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Article 3 - Accès au Site
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Le site est accessible 24h/24, 7j/7, sauf en cas de force majeure ou de maintenance. 
                  L&apos;éditeur se réserve le droit de suspendre ou d&apos;interrompre l&apos;accès au site 
                  sans préavis.
                </p>
                <p>
                  L&apos;utilisateur s&apos;engage à utiliser le site conformément à sa destination et 
                  à ne pas porter atteinte à son fonctionnement.
                </p>
              </div>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Article 4 - Produits et Services
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Garden Gold Green propose des produits CBD dérivés du chanvre, conformes à la 
                  législation française et européenne. Tous nos produits contiennent moins de 0,3% de THC.
                </p>
                <p>
                  Les informations sur les produits (prix, descriptions, disponibilité) sont données 
                  à titre indicatif et peuvent être modifiées sans préavis.
                </p>
                <p>
                  Les produits sont destinés à un usage personnel et non médical. Ils ne peuvent 
                  en aucun cas remplacer un traitement médical.
                </p>
              </div>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Article 5 - Commandes et Paiement
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Toute commande implique l&apos;acceptation des présentes CGU. Le client s&apos;engage 
                  à fournir des informations exactes lors de la commande.
                </p>
                <p>
                  Les prix sont indiqués en euros TTC. Le paiement s&apos;effectue au moment de la commande 
                  par carte bancaire, PayPal ou autres moyens de paiement proposés.
                </p>
                <p>
                  L&apos;éditeur se réserve le droit d&apos;annuler toute commande en cas de problème 
                  de paiement ou de stock insuffisant.
                </p>
              </div>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Article 6 - Livraison
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Les délais de livraison sont indiqués à titre indicatif. L&apos;éditeur s&apos;efforce 
                  de respecter ces délais mais ne peut être tenu responsable des retards dus aux transporteurs.
                </p>
                <p>
                  En cas de retard de livraison, le client peut annuler sa commande et obtenir le remboursement 
                  intégral de son achat.
                </p>
                <p>
                  Les frais de port sont à la charge du client, sauf mention contraire.
                </p>
              </div>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Article 7 - Droit de Rétractation
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Conformément à la législation française, le client dispose d&apos;un délai de 14 jours 
                  pour exercer son droit de rétractation à compter de la réception des produits.
                </p>
                <p>
                  Les produits doivent être retournés dans leur emballage d&apos;origine, en parfait état. 
                  Les frais de retour sont à la charge du client.
                </p>
                <p>
                  Le remboursement sera effectué dans les 14 jours suivant la réception du retour.
                </p>
              </div>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Article 8 - Responsabilité
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  L&apos;éditeur s&apos;engage à fournir des produits de qualité, conformes aux descriptions 
                  du site. Cependant, sa responsabilité ne saurait être engagée pour :
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>L&apos;utilisation inappropriée des produits</li>
                  <li>Les dommages indirects résultant de l&apos;utilisation des produits</li>
                  <li>Les interruptions de service dues à des cas de force majeure</li>
                  <li>Les dysfonctionnements techniques indépendants de sa volonté</li>
                </ul>
              </div>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Article 9 - Protection des Données
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Les données personnelles collectées sont traitées conformément à notre politique de 
                  confidentialité et au RGPD. L&apos;utilisateur dispose d&apos;un droit d&apos;accès, 
                  de rectification et de suppression de ses données.
                </p>
                <p>
                  Les données sont conservées uniquement le temps nécessaire aux finalités pour lesquelles 
                  elles ont été collectées.
                </p>
              </div>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Article 10 - Propriété Intellectuelle
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Tous les éléments du site (textes, images, logos, design) sont protégés par le droit 
                  d&apos;auteur et appartiennent à Garden Gold Green ou à ses partenaires.
                </p>
                <p>
                  Toute reproduction, distribution ou utilisation sans autorisation est interdite et 
                  peut faire l&apos;objet de poursuites judiciaires.
                </p>
              </div>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Article 11 - Modification des CGU
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  L&apos;éditeur se réserve le droit de modifier les présentes CGU à tout moment. 
                  Les modifications entrent en vigueur dès leur publication sur le site.
                </p>
                <p>
                  Il appartient à l&apos;utilisateur de consulter régulièrement les CGU pour prendre 
                  connaissance des éventuelles modifications.
                </p>
              </div>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Article 12 - Droit Applicable et Juridiction
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux 
                  français seront seuls compétents.
                </p>
                <p>
                  En cas de différend, les parties s&apos;efforceront de trouver une solution amiable 
                  avant tout recours judiciaire.
                </p>
              </div>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8 border-l-4 border-brand-gold">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient flex items-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-3" />
                Avertissement Important
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  <strong>Les produits CBD ne sont pas des médicaments</strong> et ne peuvent en aucun cas 
                  remplacer un traitement médical prescrit par un professionnel de santé.
                </p>
                <p>
                  <strong>Consultez votre médecin</strong> avant d&apos;utiliser des produits CBD, 
                  notamment si vous êtes enceinte, allaitez, ou prenez des médicaments.
                </p>
                <p>
                  <strong>Respectez la posologie</strong> recommandée et arrêtez l&apos;utilisation 
                  en cas d&apos;effets indésirables.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-400 text-sm">
                Pour toute question concernant ces conditions générales, 
                contactez-nous à : <a href="mailto:legal@gardengoldgreen.com" className="text-brand-gold hover:underline">legal@gardengoldgreen.com</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}