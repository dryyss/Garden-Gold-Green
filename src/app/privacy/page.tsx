'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faShieldAlt } from '@fortawesome/free-solid-svg-icons'

export default function PrivacyPage() {
  return (
    <main className="bg-brand-black min-h-screen pt-24">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/"
              className="text-gray-400 hover:text-brand-gold transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Retour à l'accueil
            </Link>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faShieldAlt} className="text-blue-400 text-xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Politique de Confidentialité</h1>
              <p className="text-gray-400">Dernière mise à jour : 7 octobre 2024</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="card-bg rounded-2xl p-8 shadow-2xl">
            <div className="prose prose-invert max-w-none">
              
              {/* Introduction */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Garden Gold Green s'engage à protéger votre vie privée et vos données personnelles. Cette politique de confidentialité 
                  explique comment nous collectons, utilisons et protégeons vos informations personnelles lorsque vous utilisez notre site web 
                  www.gardengoldgreen.com.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  En utilisant notre site, vous acceptez les pratiques décrites dans cette politique de confidentialité.
                </p>
              </section>

              {/* Données collectées */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">1. Données que nous collectons</h2>
                
                <h3 className="text-xl font-semibold text-white mb-3">1.1 Données que vous nous fournissez directement</h3>
                <ul className="text-gray-300 space-y-2 mb-4">
                  <li>• <strong>Informations de compte :</strong> nom, prénom, adresse email, numéro de téléphone</li>
                  <li>• <strong>Informations de livraison :</strong> adresse de facturation et de livraison</li>
                  <li>• <strong>Informations de paiement :</strong> données de carte bancaire (traitées par Stripe)</li>
                  <li>• <strong>Communications :</strong> messages, demandes de support client</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3">1.2 Données collectées automatiquement</h3>
                <ul className="text-gray-300 space-y-2 mb-4">
                  <li>• <strong>Données de navigation :</strong> pages visitées, durée de session, source de trafic</li>
                  <li>• <strong>Données techniques :</strong> adresse IP, type de navigateur, système d'exploitation</li>
                  <li>• <strong>Cookies :</strong> identifiants de session, préférences utilisateur</li>
                  <li>• <strong>Données d'utilisation :</strong> interactions avec le site, produits consultés</li>
                </ul>
              </section>

              {/* Utilisation des données */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">2. Comment nous utilisons vos données</h2>
                
                <h3 className="text-xl font-semibold text-white mb-3">2.1 Finalités principales</h3>
                <ul className="text-gray-300 space-y-2 mb-4">
                  <li>• Traitement et expédition de vos commandes</li>
                  <li>• Gestion de votre compte client</li>
                  <li>• Communication concernant vos commandes</li>
                  <li>• Amélioration de nos services et de notre site web</li>
                  <li>• Prévention de la fraude et sécurisation des transactions</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3">2.2 Marketing et communications</h3>
                <ul className="text-gray-300 space-y-2 mb-4">
                  <li>• Envoi de newsletters (avec votre consentement)</li>
                  <li>• Offres personnalisées et recommandations de produits</li>
                  <li>• Enquêtes de satisfaction et études de marché</li>
                </ul>
              </section>

              {/* Base légale */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">3. Base légale du traitement</h2>
                <ul className="text-gray-300 space-y-2 mb-4">
                  <li>• <strong>Exécution du contrat :</strong> traitement des commandes, livraison</li>
                  <li>• <strong>Intérêt légitime :</strong> amélioration du service, prévention de la fraude</li>
                  <li>• <strong>Consentement :</strong> marketing, cookies non essentiels</li>
                  <li>• <strong>Obligation légale :</strong> conservation des données de facturation</li>
                </ul>
              </section>

              {/* Partage des données */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">4. Partage de vos données</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations avec :
                </p>
                <ul className="text-gray-300 space-y-2 mb-4">
                  <li>• <strong>Prestataires de services :</strong> transporteurs, processeurs de paiement (Stripe)</li>
                  <li>• <strong>Partenaires techniques :</strong> hébergement, analytics (Google Analytics)</li>
                  <li>• <strong>Autorités légales :</strong> en cas d'obligation légale ou de demande judiciaire</li>
                </ul>
              </section>

              {/* Cookies */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">5. Cookies et technologies similaires</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Nous utilisons des cookies pour améliorer votre expérience sur notre site :
                </p>
                <ul className="text-gray-300 space-y-2 mb-4">
                  <li>• <strong>Cookies essentiels :</strong> fonctionnement du site, panier d'achat</li>
                  <li>• <strong>Cookies analytiques :</strong> mesure d'audience, performance</li>
                  <li>• <strong>Cookies marketing :</strong> publicité personnalisée (avec consentement)</li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur.
                </p>
              </section>

              {/* Sécurité */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">6. Sécurité de vos données</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Nous mettons en place des mesures de sécurité appropriées pour protéger vos données :
                </p>
                <ul className="text-gray-300 space-y-2 mb-4">
                  <li>• Chiffrement SSL/TLS pour toutes les transmissions</li>
                  <li>• Accès restreint aux données personnelles</li>
                  <li>• Surveillance continue des systèmes</li>
                  <li>• Formation du personnel à la protection des données</li>
                </ul>
              </section>

              {/* Vos droits */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">7. Vos droits</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Conformément au RGPD, vous disposez des droits suivants :
                </p>
                <ul className="text-gray-300 space-y-2 mb-4">
                  <li>• <strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
                  <li>• <strong>Droit de rectification :</strong> corriger des données inexactes</li>
                  <li>• <strong>Droit d'effacement :</strong> supprimer vos données</li>
                  <li>• <strong>Droit à la portabilité :</strong> récupérer vos données</li>
                  <li>• <strong>Droit d'opposition :</strong> vous opposer au traitement</li>
                  <li>• <strong>Droit de limitation :</strong> limiter le traitement</li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  Pour exercer ces droits, contactez-nous à : privacy@gardengoldgreen.com
                </p>
              </section>

              {/* Conservation */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">8. Conservation des données</h2>
                <ul className="text-gray-300 space-y-2 mb-4">
                  <li>• <strong>Données de compte :</strong> 3 ans après la dernière activité</li>
                  <li>• <strong>Données de commande :</strong> 10 ans (obligation légale)</li>
                  <li>• <strong>Données marketing :</strong> jusqu'au retrait du consentement</li>
                  <li>• <strong>Cookies :</strong> 13 mois maximum</li>
                </ul>
              </section>

              {/* Transferts internationaux */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">9. Transferts internationaux</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Certains de nos prestataires peuvent être situés hors de l'Union Européenne. Dans ce cas, nous nous assurons 
                  que des garanties appropriées sont mises en place (clauses contractuelles types, décision d'adéquation).
                </p>
              </section>

              {/* Modifications */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">10. Modifications de cette politique</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Nous pouvons modifier cette politique de confidentialité. Les modifications importantes vous seront notifiées 
                  par email ou via une notification sur notre site.
                </p>
              </section>

              {/* Contact */}
              <section className="mb-8 p-6 bg-brand-black/50 rounded-lg">
                <h2 className="text-xl font-bold text-white mb-4">Contact et DPO</h2>
                <p className="text-gray-300 leading-relaxed mb-2">
                  Pour toute question relative à cette politique de confidentialité ou à vos données personnelles :
                </p>
                <ul className="text-gray-300 space-y-1">
                  <li>• Email : privacy@gardengoldgreen.com</li>
                  <li>• Téléphone : 01 23 45 67 89</li>
                  <li>• Adresse : Garden Gold Green, 123 Avenue des Champs-Élysées, 75008 Paris</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  Vous avez également le droit de déposer une plainte auprès de la CNIL (Commission Nationale de l'Informatique 
                  et des Libertés) si vous estimez que vos droits ne sont pas respectés.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}