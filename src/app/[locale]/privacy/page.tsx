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
          Retour à l'accueil
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
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient flex items-center">
                <FontAwesomeIcon icon={faEye} className="mr-3" />
                Informations que nous collectons
              </h2>
              <h3 className="text-xl font-semibold text-white mb-3">Informations personnelles</h3>
              <ul className="text-gray-300 space-y-2 mb-6">
                <li>• Nom et prénom</li>
                <li>• Adresse email</li>
                <li>• Adresse de livraison et de facturation</li>
                <li>• Numéro de téléphone</li>
                <li>• Date de naissance (pour vérification d'âge)</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-white mb-3">Informations techniques</h3>
              <ul className="text-gray-300 space-y-2 mb-6">
                <li>• Adresse IP</li>
                <li>• Type de navigateur et version</li>
                <li>• Pages visitées et durée de visite</li>
                <li>• Données de cookies</li>
              </ul>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Utilisation de vos données
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Nous utilisons vos données personnelles pour :
              </p>
              <ul className="text-gray-300 space-y-2 mb-6">
                <li>• Traiter et livrer vos commandes</li>
                <li>• Vous fournir un service client de qualité</li>
                <li>• Améliorer notre site web et nos services</li>
                <li>• Vous envoyer des communications marketing (avec votre consentement)</li>
                <li>• Respecter nos obligations légales</li>
                <li>• Prévenir la fraude et assurer la sécurité</li>
              </ul>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Partage de vos données
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations avec :
              </p>
              <ul className="text-gray-300 space-y-2 mb-6">
                <li>• Nos prestataires de services (livraison, paiement, email)</li>
                <li>• Les autorités compétentes si requis par la loi</li>
                <li>• Nos partenaires de confiance (avec votre consentement explicite)</li>
              </ul>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Sécurité de vos données
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Nous mettons en place des mesures de sécurité appropriées pour protéger vos données :
              </p>
              <ul className="text-gray-300 space-y-2 mb-6">
                <li>• Chiffrement SSL/TLS pour toutes les transmissions</li>
                <li>• Accès restreint aux données personnelles</li>
                <li>• Surveillance continue de nos systèmes</li>
                <li>• Formation du personnel sur la protection des données</li>
              </ul>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Vos droits
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Conformément au RGPD, vous avez le droit de :
              </p>
              <ul className="text-gray-300 space-y-2 mb-6">
                <li>• Accéder à vos données personnelles</li>
                <li>• Corriger des données inexactes</li>
                <li>• Demander la suppression de vos données</li>
                <li>• Limiter le traitement de vos données</li>
                <li>• Vous opposer au traitement</li>
                <li>• Demander la portabilité de vos données</li>
                <li>• Retirer votre consentement à tout moment</li>
              </ul>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Cookies
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Notre site utilise des cookies pour améliorer votre expérience. Vous pouvez gérer vos préférences 
                de cookies via notre bannière de consentement ou les paramètres de votre navigateur.
              </p>
            </div>

            <div className="card-bg rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Contact
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Pour toute question concernant cette politique de confidentialité ou vos données personnelles, 
                contactez-nous :
              </p>
              <div className="text-gray-300 space-y-2">
                <p>Email : privacy@gardengoldgreen.com</p>
                <p>Téléphone : +33 1 23 45 67 89</p>
                <p>Adresse : 123 Avenue des Champs-Élysées, 75008 Paris, France</p>
              </div>
            </div>

            <div className="card-bg rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4 gold-text-gradient">
                Modifications
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
                Les modifications seront publiées sur cette page avec une nouvelle date de mise à jour.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
