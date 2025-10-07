'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faFileContract } from '@fortawesome/free-solid-svg-icons'

export default function TermsPage() {
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
            <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faFileContract} className="text-brand-gold text-xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Conditions Générales de Vente</h1>
              <p className="text-gray-400">Dernière mise à jour : 7 octobre 2024</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="card-bg rounded-2xl p-8 shadow-2xl">
            <div className="prose prose-invert max-w-none">
              
              {/* Article 1 - Objet */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Article 1 - Objet</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Les présentes conditions générales de vente (CGV) régissent les relations contractuelles entre la société Garden Gold Green, 
                  société par actions simplifiée au capital de 10 000 €, immatriculée au RCS de Paris sous le numéro 123 456 789, 
                  dont le siège social est situé 123 Avenue des Champs-Élysées, 75008 Paris (ci-après "le Vendeur") et tout client 
                  (ci-après "l'Acheteur") désireux d'acquérir des produits CBD proposés sur le site internet www.gardengoldgreen.com.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Le Vendeur se réserve le droit de modifier les présentes CGV à tout moment. Les CGV applicables sont celles en vigueur 
                  au jour de la commande.
                </p>
              </section>

              {/* Article 2 - Produits */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Article 2 - Produits</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Les produits proposés à la vente sont des produits à base de CBD (cannabidiol) conformes à la réglementation française 
                  en vigueur. Le taux de THC de tous nos produits est inférieur à 0,2% conformément à la législation européenne.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Les produits sont décrits et présentés avec la plus grande exactitude possible. Toutefois, des erreurs peuvent survenir 
                  dans la présentation ou la description des produits. Le Vendeur ne saurait être tenu responsable de ces erreurs.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Les images des produits sont non contractuelles et peuvent différer légèrement de la réalité.
                </p>
              </section>

              {/* Article 3 - Commandes */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Article 3 - Commandes</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Toute commande implique l'acceptation sans réserve des présentes CGV. L'Acheteur déclare avoir pris connaissance 
                  des présentes CGV et les accepter sans réserve.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Le Vendeur se réserve le droit d'annuler ou de refuser toute commande d'un client avec lequel il existerait un litige 
                  relatif au paiement d'une commande antérieure.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  La validation de la commande par l'Acheteur vaut confirmation et acceptation de la totalité des présentes CGV.
                </p>
              </section>

              {/* Article 4 - Prix */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Article 4 - Prix</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Les prix sont indiqués en euros toutes taxes comprises (TTC). Ils sont fermes et non révisables pendant leur période 
                  de validité, telle qu'indiquée sur le site.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Le Vendeur se réserve le droit de modifier ses prix à tout moment, étant entendu que les produits seront facturés 
                  sur la base des tarifs en vigueur au moment de l'enregistrement de la commande.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Les frais de port sont indiqués de manière séparée lors de la finalisation de la commande.
                </p>
              </section>

              {/* Article 5 - Paiement */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Article 5 - Paiement</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Le paiement s'effectue lors de la commande par carte bancaire via notre partenaire de paiement sécurisé Stripe.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Les moyens de paiement acceptés sont : Visa, Mastercard, American Express, Apple Pay, Google Pay.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  En cas de refus d'autorisation de paiement de la part des organismes officiellement accrédités, 
                  la commande sera automatiquement annulée.
                </p>
              </section>

              {/* Article 6 - Livraison */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Article 6 - Livraison</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Les commandes sont expédiées dans un délai de 1 à 3 jours ouvrés après réception du paiement.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Les délais de livraison sont donnés à titre indicatif et ne sauraient engager la responsabilité du Vendeur 
                  en cas de retard dû au transporteur.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Les frais de port sont à la charge de l'Acheteur, sauf mention contraire.
                </p>
              </section>

              {/* Article 7 - Droit de rétractation */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Article 7 - Droit de rétractation</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Conformément à l'article L. 221-28 du Code de la consommation, le droit de rétractation ne s'applique pas 
                  aux contrats de fourniture de biens qui ont été scellés et ne peuvent être renvoyés pour des raisons d'hygiène 
                  ou de protection de la santé.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Toutefois, en cas de non-conformité du produit livré, l'Acheteur dispose d'un délai de 14 jours 
                  pour retourner le produit.
                </p>
              </section>

              {/* Article 8 - Garanties */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Article 8 - Garanties</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Les produits bénéficient de la garantie légale de conformité prévue aux articles L. 217-4 et suivants 
                  du Code de la consommation.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Les produits sont garantis contre tout défaut de fabrication. La garantie ne couvre pas l'usure normale 
                  ni les dommages résultant d'une utilisation inappropriée.
                </p>
              </section>

              {/* Article 9 - Responsabilité */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Article 9 - Responsabilité</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Les produits CBD ne sont pas des médicaments et ne peuvent en aucun cas se substituer à un traitement médical. 
                  Il est recommandé de consulter un professionnel de santé avant toute consommation.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  La vente est réservée aux personnes majeures. L'Acheteur déclare être âgé de 18 ans révolus.
                </p>
              </section>

              {/* Article 10 - Droit applicable */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Article 10 - Droit applicable et juridiction compétente</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Les présentes CGV sont soumises à la loi française. En cas de litige, les tribunaux français seront seuls compétents.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Conformément aux dispositions du Code de la consommation concernant le règlement amiable des litiges, 
                  le Vendeur adhère au Service du Médiateur du e-commerce de la FEVAD (Fédération du e-commerce et de la vente à distance) 
                  dont les coordonnées sont disponibles sur le site : www.mediateurfevad.fr.
                </p>
              </section>

              {/* Contact */}
              <section className="mb-8 p-6 bg-brand-black/50 rounded-lg">
                <h2 className="text-xl font-bold text-white mb-4">Contact</h2>
                <p className="text-gray-300 leading-relaxed mb-2">
                  Pour toute question relative aux présentes CGV, vous pouvez nous contacter :
                </p>
                <ul className="text-gray-300 space-y-1">
                  <li>• Par email : legal@gardengoldgreen.com</li>
                  <li>• Par téléphone : 01 23 45 67 89</li>
                  <li>• Par courrier : Garden Gold Green, 123 Avenue des Champs-Élysées, 75008 Paris</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}