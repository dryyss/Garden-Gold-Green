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
    const errorText = await response.text()
    console.error('❌ Erreur auth PayPal:', errorText)
    throw new Error(`Erreur lors de l'obtention du token PayPal: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.access_token
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier la configuration PayPal
    if (!paypalClientId || !paypalClientSecret) {
      console.error('❌ Configuration PayPal manquante')
      return NextResponse.json(
        { 
          error: 'Configuration PayPal manquante',
          details: 'Veuillez configurer PAYPAL_CLIENT_ID et PAYPAL_CLIENT_SECRET dans .env.local'
        },
        { status: 500 }
      )
    }
    
    const { items } = await request.json()

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

    // Note: Les frais de livraison sont gérés dans le breakdown, pas comme un item séparé

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
        return_url: 'http://localhost:3000/checkout/success',
        cancel_url: 'http://localhost:3000/cart'
      }
    }

    // Obtenir le token d'accès
    const accessToken = await getPayPalAccessToken()

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
      return NextResponse.json(
        { 
          error: 'Erreur API PayPal',
          details: errorData,
          status: response.status
        },
        { status: 500 }
      )
    }

    const order = await response.json()

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
