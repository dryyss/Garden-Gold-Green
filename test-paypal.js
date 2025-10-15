// Script de test pour l'intégration PayPal
// Utilise fetch natif de Node.js (version 18+)

async function testPayPalIntegration() {
  console.log('🧪 Test de l\'intégration PayPal...\n')

  // Test 1: Créer une commande PayPal
  console.log('1️⃣ Test de création de commande PayPal...')
  
  const testItems = [
    {
      id: 'test-product-1',
      name: 'Test Product 1',
      price: 29.99,
      quantity: 1,
      category: 'CBD Products'
    },
    {
      id: 'test-product-2', 
      name: 'Test Product 2',
      price: 19.99,
      quantity: 2,
      category: 'CBD Products'
    }
  ]

  try {
    const createOrderResponse = await fetch('http://localhost:3001/api/paypal/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: testItems,
        paymentMethod: 'paypal'
      })
    })

    if (!createOrderResponse.ok) {
      const errorText = await createOrderResponse.text()
      console.error('❌ Erreur création commande:', errorText)
      return
    }

    const orderData = await createOrderResponse.json()
    console.log('✅ Commande créée avec succès!')
    console.log('📋 Order ID:', orderData.orderId)
    console.log('🔗 URL d\'approbation:', orderData.approvalUrl)
    console.log('💰 Montant total:', orderData.amount, 'EUR\n')

    // Test 2: Capturer le paiement (simulation)
    console.log('2️⃣ Test de capture de paiement...')
    console.log('ℹ️  Note: Pour tester la capture, vous devez d\'abord approuver le paiement sur PayPal')
    console.log('ℹ️  Utilisez l\'URL d\'approbation ci-dessus pour tester manuellement\n')

    // Test 3: Vérifier la configuration
    console.log('3️⃣ Vérification de la configuration...')
    
    const requiredEnvVars = [
      'PAYPAL_CLIENT_ID',
      'PAYPAL_CLIENT_SECRET',
      'NEXT_PUBLIC_APP_URL'
    ]

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
    
    if (missingVars.length > 0) {
      console.error('❌ Variables d\'environnement manquantes:', missingVars.join(', '))
      console.log('💡 Assurez-vous que votre fichier .env.local contient toutes les variables requises')
    } else {
      console.log('✅ Configuration PayPal valide')
      console.log('🔑 Client ID configuré:', process.env.PAYPAL_CLIENT_ID ? 'Oui' : 'Non')
      console.log('🔐 Client Secret configuré:', process.env.PAYPAL_CLIENT_SECRET ? 'Oui' : 'Non')
      console.log('🌐 URL de l\'app:', process.env.NEXT_PUBLIC_APP_URL)
    }

    console.log('\n🎉 Test PayPal terminé!')
    console.log('📝 Prochaines étapes:')
    console.log('   1. Ouvrez l\'URL d\'approbation dans votre navigateur')
    console.log('   2. Connectez-vous avec un compte PayPal de test')
    console.log('   3. Approuvez le paiement')
    console.log('   4. Vous serez redirigé vers la page de succès')

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message)
    console.log('\n🔧 Vérifications à faire:')
    console.log('   1. Le serveur Next.js est-il démarré? (npm run dev)')
    console.log('   2. Les clés PayPal sont-elles correctes?')
    console.log('   3. Le fichier .env.local existe-t-il?')
  }
}

// Exécuter le test
testPayPalIntegration()