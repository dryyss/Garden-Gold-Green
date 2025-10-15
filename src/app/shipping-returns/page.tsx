'use client'

import React from 'react'

export default function ShippingReturnsPage() {
  return (
    <main className="bg-brand-black min-h-screen pt-24">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="hero-bg absolute inset-0"></div>
        <div className="hero-overlay absolute inset-0"></div>
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Livraison & <span className="gold-text-gradient">Retours</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Informations détaillées sur nos politiques de livraison et de retour
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Livraison */}
          <div className="card-bg rounded-xl p-8">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">
              <span className="gold-text-gradient">Livraison</span>
            </h2>
            
            <div className="space-y-8">
              <section>
                <h3 className="text-2xl font-semibold text-white mb-4">Délais de Livraison</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-brand-gold mb-3">Livraison Standard</h4>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Délai : 3-5 jours ouvrés</li>
                      <li>• Coût : 4,99€</li>
                      <li>• Gratuit dès 50€ d'achat</li>
                      <li>• Suivi de colis inclus</li>
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-brand-gold mb-3">Livraison Express</h4>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Délai : 1-2 jours ouvrés</li>
                      <li>• Coût : 9,99€</li>
                      <li>• Livraison avant 13h possible</li>
                      <li>• Suivi en temps réel</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-white mb-4">Zones de Livraison</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <h4 className="font-semibold text-brand-gold mb-2">France Métropolitaine</h4>
                    <p className="text-gray-300 text-sm">Livraison standard et express</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <h4 className="font-semibold text-brand-gold mb-2">DOM-TOM</h4>
                    <p className="text-gray-300 text-sm">Livraison standard uniquement</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <h4 className="font-semibold text-brand-gold mb-2">Union Européenne</h4>
                    <p className="text-gray-300 text-sm">Sur demande, frais variables</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-white mb-4">Processus de Livraison</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-brand-gold text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
                    <div>
                      <h4 className="font-semibold text-white">Traitement de la commande</h4>
                      <p className="text-gray-300">Votre commande est préparée sous 24h ouvrées</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-brand-gold text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
                    <div>
                      <h4 className="font-semibold text-white">Expédition</h4>
                      <p className="text-gray-300">Vous recevez un email avec le numéro de suivi</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-brand-gold text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
                    <div>
                      <h4 className="font-semibold text-white">Livraison</h4>
                      <p className="text-gray-300">Le colis est livré à l'adresse indiquée</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-white mb-4">Informations Importantes</h3>
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
                  <ul className="text-gray-300 space-y-2">
                    <li>• Vérifiez votre adresse de livraison avant validation</li>
                    <li>• En cas d'absence, le colis sera déposé en point relais</li>
                    <li>• Les délais peuvent être prolongés en période de forte activité</li>
                    <li>• Les colis non réclamés sont retournés après 7 jours</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>

          {/* Retours */}
          <div className="card-bg rounded-xl p-8">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">
              <span className="gold-text-gradient">Retours & Remboursements</span>
            </h2>
            
            <div className="space-y-8">
              <section>
                <h3 className="text-2xl font-semibold text-white mb-4">Droit de Rétractation</h3>
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                  <p className="text-gray-300 leading-relaxed">
                    Conformément à la législation française, vous disposez d'un <strong className="text-white">délai de 14 jours</strong> 
                    pour exercer votre droit de rétractation à compter de la réception des produits.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-white mb-4">Conditions de Retour</h3>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-brand-gold mb-3">Produits Éligibles</h4>
                    <ul className="text-gray-300 space-y-2">
                      <li>✓ Produits non ouverts et dans leur emballage d'origine</li>
                      <li>✓ Produits non utilisés</li>
                      <li>✓ Produits non personnalisés</li>
                      <li>✓ Produits non périssables</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-brand-gold mb-3">Produits Non Éligibles</h4>
                    <ul className="text-gray-300 space-y-2">
                      <li>✗ Produits ouverts ou utilisés</li>
                      <li>✗ Produits personnalisés</li>
                      <li>✗ Produits périssables</li>
                      <li>✗ Produits d'hygiène intime</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-white mb-4">Processus de Retour</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-brand-gold text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
                    <div>
                      <h4 className="font-semibold text-white">Demande de retour</h4>
                      <p className="text-gray-300">Contactez-nous à support@gardengoldgreen.com avec votre numéro de commande</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-brand-gold text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
                    <div>
                      <h4 className="font-semibold text-white">Autorisation de retour</h4>
                      <p className="text-gray-300">Nous vous envoyons un numéro de retour et les instructions</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-brand-gold text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
                    <div>
                      <h4 className="font-semibold text-white">Expédition du retour</h4>
                      <p className="text-gray-300">Envoyez le colis avec l'étiquette fournie</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-brand-gold text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">4</div>
                    <div>
                      <h4 className="font-semibold text-white">Remboursement</h4>
                      <p className="text-gray-300">Remboursement sous 5-7 jours ouvrés après réception</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-white mb-4">Frais de Retour</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-green-400 mb-3">Retour Gratuit</h4>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Produit défectueux</li>
                      <li>• Erreur de notre part</li>
                      <li>• Produit non conforme</li>
                      <li>• Livraison endommagée</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-yellow-400 mb-3">Frais à Votre Charge</h4>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Changement d'avis</li>
                      <li>• Commande erronée par le client</li>
                      <li>• Produit non éligible au retour</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-white mb-4">Remboursements</h3>
                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed">
                    Les remboursements sont effectués dans les <strong className="text-white">5 à 7 jours ouvrés</strong> 
                    après réception et vérification du retour.
                  </p>
                  <div className="bg-white/5 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-brand-gold mb-3">Modes de Remboursement</h4>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Carte bancaire : Remboursement sur la carte utilisée</li>
                      <li>• PayPal : Remboursement sur le compte PayPal</li>
                      <li>• Virement : Remboursement sur le compte bancaire</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-white mb-4">Échanges</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Nous proposons également des échanges de produits. Le processus est similaire au retour, 
                  mais vous recevrez le nouveau produit une fois l'ancien retourné et vérifié.
                </p>
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                  <p className="text-gray-300">
                    <strong className="text-white">Note :</strong> Les échanges sont possibles uniquement pour des produits 
                    de valeur équivalente ou supérieure. La différence sera facturée ou remboursée selon le cas.
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* Contact */}
          <div className="card-bg rounded-xl p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Besoin d'Aide ?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Notre équipe support est là pour vous accompagner dans vos démarches de livraison et de retour.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="btn-gold text-black font-semibold py-3 px-8 rounded-full shadow-gold-glow inline-flex items-center justify-center gap-2"
              >
                Contactez le Support
              </a>
              <a 
                href="/faq"
                className="border border-white/20 text-white font-semibold py-3 px-8 rounded-full hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
              >
                Consultez la FAQ
              </a>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
