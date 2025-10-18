'use client'

import React from 'react'

export default function TermsPage() {
  return (
    <main className="bg-brand-black min-h-screen pt-24">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="hero-bg absolute inset-0"></div>
        <div className="hero-overlay absolute inset-0"></div>
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Conditions <span className="gold-text-gradient">Générales</span>
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
              <h2 className="text-3xl font-bold text-white mb-6">1. Acceptation des Conditions</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                En accédant et en utilisant le site web Garden Gold Green, vous acceptez d'être lié par ces conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-6">2. Description du Service</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Garden Gold Green est une plateforme e-commerce spécialisée dans la vente de produits CBD premium. Nous proposons des huiles, gélules, cosmétiques et autres produits à base de chanvre légal.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Tous nos produits contiennent moins de 0,3% de THC et sont conformes à la législation française en vigueur.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-6">3. Utilisation du Site</h2>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Vous vous engagez à utiliser notre site uniquement à des fins légales et de manière à ne pas porter atteinte aux droits d'autrui.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Il est interdit de :
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Utiliser le site pour des activités illégales</li>
                  <li>Tenter de contourner les mesures de sécurité</li>
                  <li>Transmettre des virus ou codes malveillants</li>
                  <li>Collecter des informations sur d'autres utilisateurs</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-6">4. Commandes et Paiement</h2>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Toute commande passée sur notre site constitue une offre d'achat. Nous nous réservons le droit d'accepter ou de refuser votre commande.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Les prix affichés sont en euros TTC. Le paiement s'effectue au moment de la commande par carte bancaire, PayPal ou virement.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  En cas de non-paiement, la commande sera automatiquement annulée.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-6">5. Livraison</h2>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Les délais de livraison sont indiqués à titre indicatif. Nous nous efforçons de respecter ces délais mais ne pouvons garantir une livraison dans les temps en cas de force majeure.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Les frais de port sont calculés selon le poids et la destination. La livraison est gratuite à partir de 50€ d'achat.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  En cas d'absence lors de la livraison, le colis sera déposé en point relais ou retourné à l'expéditeur.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-6">6. Droit de Rétractation</h2>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Conformément à la législation française, vous disposez d'un délai de 14 jours pour exercer votre droit de rétractation à compter de la réception des produits.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Les produits doivent être retournés dans leur emballage d'origine, non ouverts et en parfait état.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Les frais de retour sont à votre charge, sauf en cas de produit défectueux ou non conforme.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-6">7. Propriété Intellectuelle</h2>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Tous les contenus présents sur le site (textes, images, logos, marques) sont protégés par le droit d'auteur et appartiennent à Garden Gold Green ou à ses partenaires.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Toute reproduction, distribution ou utilisation sans autorisation est interdite.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-6">8. Responsabilité</h2>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Garden Gold Green s'efforce de fournir des informations exactes mais ne peut garantir l'exactitude, la complétude ou l'actualité des informations.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Notre responsabilité ne saurait être engagée en cas de dommages indirects résultant de l'utilisation de nos produits.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-6">9. Protection des Données</h2>
              <p className="text-gray-300 leading-relaxed">
                Le traitement de vos données personnelles est régi par notre Politique de Confidentialité, accessible sur notre site.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-6">10. Droit Applicable</h2>
              <p className="text-gray-300 leading-relaxed">
                Ces conditions générales sont régies par le droit français. En cas de litige, les tribunaux français seront compétents.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-6">11. Contact</h2>
              <p className="text-gray-300 leading-relaxed">
                Pour toute question concernant ces conditions générales, vous pouvez nous contacter :
              </p>
              <div className="mt-4 space-y-2 text-gray-300">
                <p>Email : legal@gardengoldgreen.com</p>
                <p>Téléphone : +33 1 23 45 67 89</p>
                <p>Adresse : 123 Rue du CBD, 75001 Paris, France</p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  )
}


