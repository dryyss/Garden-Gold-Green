import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Garden Gold Green - Produits CBD Premium',
    short_name: 'Garden CBD',
    description: 'Découvrez notre sélection de produits CBD premium : huiles, fleurs et cosmétiques.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#10b981',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['shopping', 'health', 'lifestyle'],
    shortcuts: [
      {
        name: 'Produits',
        short_name: 'Produits',
        description: 'Voir tous nos produits CBD',
        url: '/products',
        icons: [{ src: '/logo.png', sizes: '96x96' }],
      },
      {
        name: 'Panier',
        short_name: 'Panier',
        description: 'Voir mon panier',
        url: '/cart',
        icons: [{ src: '/logo.png', sizes: '96x96' }],
      },
    ],
  }
}







