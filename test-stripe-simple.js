// Test simple de l'API Stripe
async function testStripeAPI() {
  console.log('🧪 Test simple de l\'API Stripe...\n')

  const testData = {
    items: [
      {
        id: 'test-product-1',
        name: 'Test Product 1',
        price: 29.99,
        quantity: 1,
        category: 'CBD Products'
      }
    ]
  }

  try {
    console.log('📤 Envoi de la requête Stripe...')
    const response = await fetch('http://localhost:3000/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    console.log('📥 Statut de la réponse:', response.status)
    console.log('📥 Headers:', Object.fromEntries(response.headers.entries()))

    const responseText = await response.text()
    console.log('📥 Contenu de la réponse:', responseText)

    if (response.ok) {
      const data = JSON.parse(responseText)
      console.log('✅ Succès!')
      console.log('🔗 URL de checkout:', data.url)
    } else {
      console.log('❌ Erreur:', response.status, response.statusText)
    }

  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message)
  }
}

// Attendre 2 secondes puis tester
setTimeout(testStripeAPI, 2000)
