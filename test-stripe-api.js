async function testStripeAPI() {
  try {
    console.log(' Test de l\'API Stripe...');
    
    const response = await fetch('http://localhost:3000/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            id: '1',
            name: 'Test Product',
            price: 10,
            quantity: 1
          }
        ]
      })
    });

    console.log(' Status:', response.status);
    console.log(' Headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.text();
    console.log(' Response:', data);
    
  } catch (error) {
    console.error(' Erreur:', error);
  }
}

testStripeAPI();
