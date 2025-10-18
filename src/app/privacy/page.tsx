'use client'

import React from 'react'

export default function PrivacyPage() {
  return (
    <main className="bg-brand-black min-h-screen pt-24">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="hero-bg absolute inset-0"></div>
        <div className="hero-overlay absolute inset-0"></div>
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Politique de <span className="gold-text-gradient">Confidentialité</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Dernière mise à jour : 1er janvier 2025
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="card-bg rounded-xl p-8 space-y-8">
            
            <section>
              <h2 className="text-3xl font-bold text-white mb-6">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Garden Gold Green s'engage à protéger votre vie privée et vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations.
              </p>
              <p className="text-gray-300 leading-relaxed">
                En utilisant notre site web, vous acceptez les pratiques décrites dans cette politique.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-6">2. Données Collectées</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-3">2.1 Données d'identification</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone</li>
                  <li>Adresse de livraison et de facturation</li>
                  <li>Date de naissance (pour vérification d'âge)</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.2 Données de navigation</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Adresse IP</li>
                  <li>Type de navigateur</li>
                  <li>Pages visitées</li>
                  <li>Durée de visite</li>
                  <li>Cookies et technologies similaires</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.3 Données de commande</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Historique des commandes</li>
                  <li>Préférences de produits</li>
                  <li>Informations de paiement (sécurisées)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-6">3. Utilisation des Données</h2>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Nous utilisons vos données personnelles pour :
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Traiter et livrer vos commandes</li>
                  <li>Gérer votre compte client</li>
                  <li>Vous contacter concernant vos commandes</li>
                  <li>Améliorer nos produits et services</li>
                  <li>Vous envoyer des communications marketing (avec votre consentement)</li>
                  <li>Respecter nos obligations légales</li>
                  <li>Prévenir la fraude et assurer la sécurité</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-6">4. Base Légale du Traitement</h2>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Conformément au RGPD, nous traitons vos données sur les bases suivantes :
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li><strong>Exécution du contrat :</strong> Pour traiter vos commandes</li>
                  <li><strong>Intérêt légitime :</strong> Pour améliorer nos services</li>
                  <li><strong>Consentement :</strong> Pour les communications marketing</li>
                  <li><strong>Obligation légale :</strong> Pour respecter la réglementation</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-6">5. Partage des Données</h2>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations avec :
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Prestataires de services (livraison, paiement)</li>
                  <li>Autorités compétentes (si requis par la loi)</li>
                  <li>Partenaires commerciaux (avec votre consentement explicite)</li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  Tous nos partenaires s'engagent à protéger vos données selon les mêmes standards.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-6">6. Sécurité des Données</h2>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Nous mettons en place des mesures de sécurité techniques et organisationnelles pour protéger vos données :
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Chiffrement SSL/TLS pour les transmissions</li>
                  <li>Accès restreint aux données personnelles</li>
                  <li>Surveillance continue des systèmes</li>
                  <li>Formation du personnel à la protection des données</li>
                  <li>Sauvegardes régulières et sécurisées</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-6">7. Conservation des Données</h2>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Nous conservons vos données personnelles pendant les durées suivantes :
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li><strong>Comptes clients :</strong> 3 ans après la dernière activité</li>
                  <li><strong>Commandes :</strong> 10 ans (obligation comptable)</li>
                  <li><strong>Données marketing :</strong> Jusqu'à retrait du consentement</li>
                  <li><strong>Cookies :</strong> 13 mois maximum</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-6">8. Vos Droits</h2>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Conformément au RGPD, vous disposez des droits suivants :
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li><strong>Droit d'accès :</strong> Obtenir une copie de vos données</li>
                  <li><strong>Droit de rectification :</strong> Corriger des données inexactes</li>
                  <li><strong>Droit à l'effacement :</strong> Demander la suppression de vos données</li>
                  <li><strong>Droit à la limitation :</strong> Restreindre le traitement</li>
                  <li><strong>Droit à la portabilité :</strong> Récupérer vos données</li>
                  <li><strong>Droit d'opposition :</strong> Vous opposer au traitement</li>
                  <li><strong>Droit de retrait du consentement :</strong> À tout moment</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  Pour exercer ces droits, contactez-nous à : privacy@gardengoldgreen.com
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-6">9. Cookies</h2>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Notre site utilise des cookies pour améliorer votre expérience :
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site</li>
                  <li><strong>Cookies analytiques :</strong> Pour comprendre l'utilisation du site</li>
                  <li><strong>Cookies marketing :</strong> Pour personnaliser les publicités</li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  Vous pouvez gérer vos préférences de cookies via notre bannière de consentement.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-6">10. Transferts Internationaux</h2>
              <p className="text-gray-300 leading-relaxed">
                Certains de nos prestataires peuvent être situés hors de l'Union Européenne. Dans ce cas, nous nous assurons que des garanties appropriées sont en place pour protéger vos données.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-6">11. Modifications</h2>
              <p className="text-gray-300 leading-relaxed">
                Nous pouvons modifier cette politique de confidentialité. Les modifications importantes vous seront notifiées par email ou via notre site.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-6">12. Contact et Réclamations</h2>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Pour toute question concernant cette politique de confidentialité :
                </p>
                <div className="mt-4 space-y-2 text-gray-300">
                  <p>Email : privacy@gardengoldgreen.com</p>
                  <p>Téléphone : +33 1 23 45 67 89</p>
                  <p>Adresse : 123 Rue du CBD, 75001 Paris, France</p>
                </div>
                <p className="text-gray-300 leading-relaxed mt-4">
                  Vous avez également le droit de déposer une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés).
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  )
}


