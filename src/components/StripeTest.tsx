'use client'

import { useState } from 'react'

export default function StripeTest() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [sessionUrl, setSessionUrl] = useState('')

  const handleTestPayment = async () => {
    setLoading(true)
    setMessage('')
    setSessionUrl('')

    try {
      console.log('🚀 Démarrage du test Stripe...')
      
      // Créer une session de checkout via notre API
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              id: 'test-product-1',
              name: 'Test Product CBD',
              description: 'Produit de test pour vérifier Stripe',
              price: 29.99,
              currency: 'eur',
              quantity: 1,
              image: '/logo.png'
            }
          ],
          metadata: {
            test: 'true',
            userId: 'test-user'
          }
        }),
      })

      console.log('📡 Réponse API:', response.status)

      if (!response.ok) {
        const errorData = await response.text()
        console.error('❌ Erreur API:', errorData)
        setMessage(`Erreur API: ${response.status} - ${errorData}`)
        return
      }

      const data = await response.json()
      console.log('✅ Données reçues:', data)

      if (data.url) {
        setMessage('✅ Session Stripe créée avec succès !')
        setSessionUrl(data.url)
        
        // Rediriger vers Stripe Checkout après 2 secondes
        setTimeout(() => {
          window.location.href = data.url
        }, 2000)
      } else {
        setMessage('❌ Erreur: URL de session non reçue')
      }
    } catch (error) {
      console.error('❌ Erreur:', error)
      setMessage(`❌ Erreur de connexion: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Test Configuration Stripe
        </h1>
        
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Test Stripe</h2>
          
          <div className="space-y-4">
            <div className="p-4 border border-gray-300 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Test Product CBD</h3>
              <p className="text-gray-600">Produit de test pour vérifier Stripe</p>
              <p className="text-lg font-bold text-green-600 mt-2">29,99 €</p>
            </div>

            <button
              onClick={handleTestPayment}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création de la session...' : 'Tester le Paiement Stripe'}
            </button>

            {message && (
              <div className={`p-3 rounded-lg ${
                message.includes('✅') ? 'bg-green-100 text-green-700' : 
                message.includes('❌') ? 'bg-red-100 text-red-700' : 
                'bg-blue-100 text-blue-700'
              }`}>
                {message}
              </div>
            )}

            {sessionUrl && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm mb-2">Redirection vers Stripe dans 2 secondes...</p>
                <a 
                  href={sessionUrl} 
                  className="text-green-600 underline hover:text-green-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ou cliquez ici pour ouvrir Stripe Checkout
                </a>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">Carte de test :</h4>
            <p className="text-sm text-gray-600">
              <strong>Numéro :</strong> 4242 4242 4242 4242<br/>
              <strong>Date :</strong> 12/34<br/>
              <strong>CVC :</strong> 123<br/>
              <strong>Code postal :</strong> 75001
            </p>
          </div>
        </div>

        <div className="mt-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Instructions :</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Cliquez sur "Tester le Paiement Stripe"</li>
            <li>Attendez que la session soit créée</li>
            <li>Vous serez automatiquement redirigé vers Stripe Checkout</li>
            <li>Utilisez la carte de test fournie</li>
            <li>Vérifiez que vous êtes redirigé vers la page de succès</li>
            <li>Vérifiez que la commande est créée en base de données</li>
          </ol>
        </div>

        <div className="mt-6 max-w-2xl mx-auto p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Debug Info :</h4>
          <p className="text-sm text-blue-700">
            Vérifiez la console du navigateur (F12) pour voir les logs détaillés du processus.
          </p>
        </div>
      </div>
    </div>
  )
}