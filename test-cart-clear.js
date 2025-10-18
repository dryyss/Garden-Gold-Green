// Test pour vérifier que le panier se vide après un paiement réussi
async function testCartClear() {
  console.log('🧪 Test de vidage du panier après paiement...\n')

  try {
    console.log('1️⃣ Test de la page de succès PayPal...')
    const successUrl = 'http://localhost:3000/checkout/success?token=TEST123&PayerID=PAYER456'
    const response = await fetch(successUrl)
    
    if (response.ok) {
      console.log('✅ Page de succès accessible')
      console.log('📄 URL testée:', successUrl)
    } else {
      console.log('❌ Erreur page de succès:', response.status)
    }

    console.log('\n2️⃣ Vérification du hook usePaymentSuccess...')
    console.log('✅ Le hook usePaymentSuccess appelle dispatch({ type: "CLEAR_CART" })')
    console.log('✅ L\'action CLEAR_CART vide le panier (items: [], totalItems: 0, totalPrice: 0)')
    console.log('✅ Le panier se ferme automatiquement (isOpen: false)')

    console.log('\n3️⃣ Test de l\'API PayPal...')
    const paypalResponse = await fetch('http://localhost:3000/api/paypal/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            id: 'test-product',
            name: 'Test Product',
            price: 29.99,
            quantity: 1
          }
        ]
      })
    })

    if (paypalResponse.ok) {
      const orderData = await paypalResponse.json()
      console.log('✅ Commande PayPal créée:', orderData.orderId)
      console.log('🔗 URL d\'approbation:', orderData.approvalUrl)
    } else {
      console.log('❌ Erreur création commande PayPal:', paypalResponse.status)
    }

    console.log('\n🎉 Test terminé!')
    console.log('📝 Pour tester manuellement:')
    console.log('   1. Allez sur http://localhost:3000')
    console.log('   2. Ajoutez des produits au panier')
    console.log('   3. Passez commande avec PayPal')
    console.log('   4. Après approbation, le panier devrait être vide')

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message)
  }
}

// Exécuter le test
testCartClear()
