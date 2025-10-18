// Test du flux complet PayPal
async function testPayPalFlow() {
  console.log('🧪 Test du flux complet PayPal...\n')

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
    console.log('1️⃣ Création de la commande PayPal...')
    const createResponse = await fetch('http://localhost:3000/api/paypal/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    if (!createResponse.ok) {
      const errorText = await createResponse.text()
      console.error('❌ Erreur création commande:', errorText)
      return
    }

    const orderData = await createResponse.json()
    console.log('✅ Commande créée:', orderData.orderId)
    console.log('🔗 URL d\'approbation:', orderData.approvalUrl)

    console.log('\n2️⃣ Simulation de la redirection PayPal...')
    console.log('ℹ️  Dans un vrai test, vous seriez redirigé vers PayPal')
    console.log('ℹ️  Après approbation, PayPal redirige vers:')
    console.log(`   http://localhost:3000/checkout/success?token=${orderData.orderId}&PayerID=PAYER123`)

    console.log('\n3️⃣ Test de la page de succès...')
    const successUrl = `http://localhost:3000/checkout/success?token=${orderData.orderId}&PayerID=PAYER123`
    const successResponse = await fetch(successUrl)
    
    if (successResponse.ok) {
      console.log('✅ Page de succès accessible')
      console.log('📄 URL de test:', successUrl)
    } else {
      console.log('❌ Erreur page de succès:', successResponse.status)
    }

    console.log('\n🎉 Test du flux PayPal terminé!')
    console.log('📝 Pour tester manuellement:')
    console.log('   1. Ouvrez l\'URL d\'approbation dans votre navigateur')
    console.log('   2. Connectez-vous avec un compte PayPal de test')
    console.log('   3. Approuvez le paiement')
    console.log('   4. Vous serez redirigé vers la page de succès')

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message)
  }
}

// Exécuter le test
testPayPalFlow()
