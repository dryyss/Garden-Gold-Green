import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faShield, faLock, faEye } from '@fortawesome/free-solid-svg-icons'

export default function PrivacyPage() {
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
              <FontAwesomeIcon icon={faShield} className="text-brand-gold text-2xl" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 gold-text-gradient">
              Politique de Confidentialité
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
                <FontAwesomeIcon icon={faLock} className="mr-3" />
                Introduction
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Chez Garden Gold Green, nous nous engageons à protéger votre vie privée et vos données personnelles. 
                Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations 
                lorsque vous visitez notre site web ou utilisez nos services.
              </p>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Données que nous collectons
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <h3 className="text-lg font-semibold text-white mb-2">Informations personnelles :</h3>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Nom et prénom</li>
                  <li>Adresse e-mail</li>
                  <li>Adresse de livraison et de facturation</li>
                  <li>Numéro de téléphone</li>
                  <li>Date de naissance (pour vérification d&apos;âge)</li>
                </ul>

                <h3 className="text-lg font-semibold text-white mb-2 mt-6">Informations techniques :</h3>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Adresse IP</li>
                  <li>Type de navigateur et version</li>
                  <li>Système d&apos;exploitation</li>
                  <li>Pages visitées et durée de visite</li>
                  <li>Données de cookies et technologies similaires</li>
                </ul>

                <h3 className="text-lg font-semibold text-white mb-2 mt-6">Informations de commande :</h3>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Historique des commandes</li>
                  <li>Préférences de produits</li>
                  <li>Informations de paiement (sécurisées par nos partenaires)</li>
                </ul>
              </div>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Comment nous utilisons vos données
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <h3 className="text-lg font-semibold text-white mb-2">Finalités principales :</h3>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Traitement et livraison de vos commandes</li>
                  <li>Communication concernant vos commandes</li>
                  <li>Service client et support technique</li>
                  <li>Vérification de l&apos;âge et conformité légale</li>
                </ul>

                <h3 className="text-lg font-semibold text-white mb-2 mt-6">Finalités secondaires :</h3>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Amélioration de nos produits et services</li>
                  <li>Marketing personnalisé (avec votre consentement)</li>
                  <li>Analyse statistique et recherche</li>
                  <li>Prévention de la fraude et sécurité</li>
                </ul>
              </div>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Base légale du traitement
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Nous traitons vos données personnelles sur la base de :
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Exécution du contrat :</strong> Pour traiter vos commandes et fournir nos services</li>
                  <li><strong>Obligation légale :</strong> Pour respecter les réglementations sur la vente de produits CBD</li>
                  <li><strong>Intérêt légitime :</strong> Pour améliorer nos services et prévenir la fraude</li>
                  <li><strong>Consentement :</strong> Pour le marketing et les cookies non essentiels</li>
                </ul>
              </div>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Partage de vos données
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations avec :
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Prestataires de services :</strong> Transporteurs, processeurs de paiement, services d&apos;e-mail</li>
                  <li><strong>Autorités légales :</strong> Si requis par la loi ou pour protéger nos droits</li>
                  <li><strong>Partenaires commerciaux :</strong> Uniquement avec votre consentement explicite</li>
                </ul>
                <p>
                  Tous nos partenaires sont tenus de respecter la même protection de vos données.
                </p>
              </div>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Sécurité de vos données
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Nous mettons en place des mesures de sécurité appropriées pour protéger vos données :
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Chiffrement SSL/TLS pour toutes les transmissions</li>
                  <li>Accès restreint aux données personnelles</li>
                  <li>Surveillance continue des systèmes</li>
                  <li>Formation du personnel sur la protection des données</li>
                  <li>Sauvegardes sécurisées et régulières</li>
                </ul>
              </div>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Conservation des données
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Nous conservons vos données personnelles uniquement le temps nécessaire aux finalités pour lesquelles 
                  elles ont été collectées :
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Données de commande :</strong> 3 ans après la dernière commande</li>
                  <li><strong>Données marketing :</strong> Jusqu&apos;à votre désabonnement</li>
                  <li><strong>Données techniques :</strong> 12 mois maximum</li>
                  <li><strong>Données de conformité :</strong> Selon les obligations légales</li>
                </ul>
              </div>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Vos droits
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Conformément au RGPD, vous disposez des droits suivants :
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Droit d&apos;accès :</strong> Obtenir une copie de vos données</li>
                  <li><strong>Droit de rectification :</strong> Corriger des données inexactes</li>
                  <li><strong>Droit d&apos;effacement :</strong> Demander la suppression de vos données</li>
                  <li><strong>Droit à la portabilité :</strong> Récupérer vos données dans un format structuré</li>
                  <li><strong>Droit d&apos;opposition :</strong> Vous opposer au traitement de vos données</li>
                  <li><strong>Droit de limitation :</strong> Limiter le traitement de vos données</li>
                </ul>
                <p>
                  Pour exercer ces droits, contactez-nous à : <a href="mailto:privacy@gardengoldgreen.com" className="text-brand-gold hover:underline">privacy@gardengoldgreen.com</a>
                </p>
              </div>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Cookies et technologies similaires
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Nous utilisons des cookies pour améliorer votre expérience sur notre site :
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site</li>
                  <li><strong>Cookies de performance :</strong> Pour analyser l&apos;utilisation du site</li>
                  <li><strong>Cookies de fonctionnalité :</strong> Pour mémoriser vos préférences</li>
                  <li><strong>Cookies marketing :</strong> Pour la publicité personnalisée (avec consentement)</li>
                </ul>
                <p>
                  Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur.
                </p>
              </div>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Transferts internationaux
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Vos données peuvent être transférées vers des pays situés en dehors de l&apos;Espace économique européen. 
                  Dans ce cas, nous nous assurons que des garanties appropriées sont en place :
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Décision d&apos;adéquation de la Commission européenne</li>
                  <li>Clauses contractuelles types approuvées par la Commission</li>
                  <li>Certification ou codes de conduite approuvés</li>
                </ul>
              </div>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Mineurs
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Nos services ne sont pas destinés aux mineurs de moins de 18 ans. Nous ne collectons 
                  sciemment aucune donnée personnelle de mineurs. Si nous découvrons qu&apos;un mineur 
                  nous a fourni des données personnelles, nous les supprimerons immédiatement.
                </p>
              </div>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Modifications de cette politique
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Nous pouvons modifier cette politique de confidentialité de temps à autre. Les modifications 
                  importantes vous seront notifiées par e-mail ou via un avis sur notre site.
                </p>
                <p>
                  Nous vous encourageons à consulter régulièrement cette page pour rester informé de nos pratiques.
                </p>
              </div>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Contact et réclamations
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Pour toute question concernant cette politique de confidentialité ou le traitement de vos données :
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>E-mail : <a href="mailto:privacy@gardengoldgreen.com" className="text-brand-gold hover:underline">privacy@gardengoldgreen.com</a></li>
                  <li>Adresse : Garden Gold Green, 123 Rue du CBD, 75001 Paris, France</li>
                </ul>
                <p>
                  Vous avez également le droit d&apos;introduire une réclamation auprès de la CNIL 
                  (Commission Nationale de l&apos;Informatique et des Libertés) si vous estimez que 
                  vos droits ne sont pas respectés.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-400 text-sm">
                Cette politique de confidentialité est conforme au RGPD et aux lois françaises en vigueur.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}