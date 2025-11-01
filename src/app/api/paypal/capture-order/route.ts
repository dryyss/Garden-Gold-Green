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
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID manquant' },
        { status: 400 }
      )
    }

    // Obtenir le token d'accès
    const accessToken = await getPayPalAccessToken()

    // Capturer le paiement
    const response = await fetch(`${paypalBaseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('❌ Erreur capture PayPal:', errorData)
      throw new Error(`Erreur capture PayPal: ${response.status} ${response.statusText}`)
    }

    const captureResponse = await response.json()

    return NextResponse.json({
      success: true,
      orderId: captureResponse.id,
      status: captureResponse.status,
      amount: captureResponse.purchase_units?.[0]?.payments?.captures?.[0]?.amount
    })

  } catch (error: any) {
    console.error('❌ Erreur capture PayPal:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Erreur lors de la capture du paiement PayPal',
        details: error.stack || null
      },
      { status: 500 }
    )
  }
}
