import { NextRequest, NextResponse } from 'next/server'

// Configuration PayPal
const paypalClientId = process.env.PAYPAL_CLIENT_ID!
const paypalClientSecret = process.env.PAYPAL_CLIENT_SECRET!
const paypalEnvironment = process.env.NODE_ENV === 'production' ? 'live' : 'sandbox'
const paypalBaseUrl = paypalEnvironment === 'live' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com'

// Fonction pour obtenir un token d'accès PayPal
async function getPayPalAccessToken() {
  const auth = Buffer.from(`${paypalClientId}:${paypalClientSecret}`).toString('base64')
  
  const response = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) {
    throw new Error('Erreur lors de l\'obtention du token PayPal')
  }

  const data = await response.json()
  return data.access_token
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Création commande PayPal...')
    
    // Vérifier la configuration PayPal
    if (!paypalClientId || !paypalClientSecret) {
      return NextResponse.json(
        { 
          error: 'Configuration PayPal manquante',
          details: 'Veuillez configurer PAYPAL_CLIENT_ID et PAYPAL_CLIENT_SECRET'
        },
        { status: 500 }
      )
    }
    
    const { items } = await request.json()
    console.log('📦 Items reçus:', items)

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Le panier est vide' },
        { status: 400 }
      )
    }

    // Calculer le sous-total et les frais de livraison
    const subtotal = items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0)
    const shipping = subtotal > 100 ? 0 : 9.90
    const total = subtotal + shipping

    console.log('💰 Calculs PayPal:', { subtotal, shipping, total })

    // Créer les items pour PayPal
    const paypalItems = items.map((item: any) => ({
      name: item.name,
      description: item.cbdPercent ? `CBD ${item.cbdPercent}%` : undefined,
      unit_amount: {
        currency_code: 'EUR',
        value: item.price.toFixed(2)
      },
      quantity: item.quantity.toString(),
      category: 'PHYSICAL_GOODS'
    }))

    // Ajouter les frais de livraison si nécessaire
    if (shipping > 0) {
      paypalItems.push({
        name: 'Frais de livraison',
        description: 'Livraison standard',
        unit_amount: {
          currency_code: 'EUR',
          value: shipping.toFixed(2)
        },
        quantity: '1',
        category: 'SHIPPING'
      })
    }

    // Créer la commande PayPal
    const orderRequest = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'EUR',
            value: total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: subtotal.toFixed(2)
              },
              ...(shipping > 0 && {
                shipping: {
                  currency_code: 'EUR',
                  value: shipping.toFixed(2)
                }
              })
            }
          },
          items: paypalItems
        }
      ],
      application_context: {
        brand_name: 'Garden Gold Green',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cart`
      }
    }

    console.log('📋 Commande PayPal:', JSON.stringify(orderRequest, null, 2))

    // Obtenir le token d'accès
    const accessToken = await getPayPalAccessToken()
    console.log('🔑 Token PayPal obtenu')

    // Créer la commande via l'API PayPal
    const response = await fetch(`${paypalBaseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderRequest),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('❌ Erreur API PayPal:', errorData)
      throw new Error(`Erreur PayPal: ${response.status} ${response.statusText}`)
    }

    const order = await response.json()
    console.log('✅ Commande PayPal créée:', order.id)

    // Trouver le lien d'approbation
    const approvalUrl = order.links?.find((link: any) => link.rel === 'approve')?.href

    if (!approvalUrl) {
      throw new Error('URL d\'approbation PayPal non trouvée')
    }

    return NextResponse.json({
      orderId: order.id,
      approvalUrl: approvalUrl,
      status: order.status
    })

  } catch (error: any) {
    console.error('❌ Erreur création commande PayPal:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Erreur lors de la création de la commande PayPal',
        details: error.stack || null
      },
      { status: 500 }
    )
  }
}
