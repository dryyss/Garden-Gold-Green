'use client'

import { AddToCartButton } from '@/components/AddToCartButton'

const demoProducts = [
  {
    id: 'demo-1',
    name: 'Huile CBD Premium',
    price: 49.99,
    image: '/products/placeholder.txt',
    cbdPercent: 10
  },
  {
    id: 'demo-2', 
    name: 'Fleurs CBD Bio',
    price: 59.90,
    image: '/products/placeholder.txt',
    cbdPercent: 15
  },
  {
    id: 'demo-3',
    name: 'Vape CBD Rechargeable',
    price: 89.90,
    image: '/products/placeholder.txt',
    cbdPercent: 20
  }
]

export function AddToCartButtonDemo() {
  return (
    <div className="bg-brand-black p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Démonstration des Boutons d'Ajout au Panier</h2>
      
      <div className="space-y-6">
        {/* Variant Default */}
        <div>
          <h3 className="text-lg font-semibold text-brand-gold mb-3">Variant Default</h3>
          <div className="flex gap-4">
            {demoProducts.map(product => (
              <AddToCartButton
                key={product.id}
                product={product}
                variant="default"
              />
            ))}
          </div>
        </div>

        {/* Variant Compact */}
        <div>
          <h3 className="text-lg font-semibold text-brand-gold mb-3">Variant Compact</h3>
          <div className="flex gap-4">
            {demoProducts.map(product => (
              <AddToCartButton
                key={`compact-${product.id}`}
                product={product}
                variant="compact"
              />
            ))}
          </div>
        </div>

        {/* Variant Full */}
        <div>
          <h3 className="text-lg font-semibold text-brand-gold mb-3">Variant Full</h3>
          <div className="space-y-2">
            {demoProducts.map(product => (
              <AddToCartButton
                key={`full-${product.id}`}
                product={product}
                variant="full"
              />
            ))}
          </div>
        </div>

        {/* Sans quantité */}
        <div>
          <h3 className="text-lg font-semibold text-brand-gold mb-3">Sans Affichage de Quantité</h3>
          <div className="flex gap-4">
            {demoProducts.map(product => (
              <AddToCartButton
                key={`no-qty-${product.id}`}
                product={product}
                showQuantity={false}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-brand-green/10 rounded-lg">
        <h4 className="text-brand-green font-semibold mb-2">Fonctionnalités :</h4>
        <ul className="text-white text-sm space-y-1">
          <li>• Animation de pulsation pendant l'ajout</li>
          <li>• Animation de succès avec icône de validation</li>
          <li>• Affichage de la quantité avec boutons +/-</li>
          <li>• Changement de couleur (vert) quand ajouté</li>
          <li>• Animation de vol vers le panier</li>
          <li>• Effet confetti de célébration</li>
          <li>• Notifications de succès/erreur</li>
        </ul>
      </div>
    </div>
  )
}
