// Test simple de l'API PayPal
async function testPayPalAPI() {
  console.log('🧪 Test simple de l\'API PayPal...\n')

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
    console.log('📤 Envoi de la requête...')
    const response = await fetch('http://localhost:3000/api/paypal/create-order', {
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
      console.log('📋 Order ID:', data.orderId)
      console.log('🔗 URL d\'approbation:', data.approvalUrl)
    } else {
      console.log('❌ Erreur:', response.status, response.statusText)
    }

  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message)
    console.log('\n🔧 Vérifications:')
    console.log('   1. Le serveur Next.js est-il démarré? (npm run dev)')
    console.log('   2. Le port 3001 est-il libre?')
    console.log('   3. Les variables d\'environnement sont-elles correctes?')
  }
}

// Attendre 3 secondes puis tester
setTimeout(testPayPalAPI, 3000)
