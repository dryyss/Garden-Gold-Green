import sgMail from '@sendgrid/mail'

// Initialiser SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

interface OrderEmailData {
  orderId: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    price: number
    quantity: number
    image: string
  }>
  totalAmount: number
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    zipCode: string
    country: string
  }
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('SendGrid non configuré - email simulé:', data)
    return { success: true, messageId: 'simulated' }
  }

  try {
    const msg = {
      to: data.customerEmail,
      from: process.env.FROM_EMAIL || 'noreply@gardengoldgreen.com',
      subject: `Confirmation de commande #${data.orderId} - Garden Gold Green`,
      html: generateOrderConfirmationHTML(data),
    }

    const response = await sgMail.send(msg)
    return { success: true, messageId: response[0].headers['x-message-id'] }

  } catch (error) {
    console.error('Erreur envoi email:', error)
    return { success: false, error: error }
  }
}

export async function sendOrderStatusUpdateEmail(
  customerEmail: string,
  orderId: string,
  status: string,
  trackingNumber?: string
) {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('SendGrid non configuré - email simulé:', { customerEmail, orderId, status })
    return { success: true, messageId: 'simulated' }
  }

  try {
    const statusMessages = {
      PROCESSING: 'Votre commande est en cours de préparation',
      SHIPPED: 'Votre commande a été expédiée',
      DELIVERED: 'Votre commande a été livrée',
      CANCELLED: 'Votre commande a été annulée',
    }

    const msg = {
      to: customerEmail,
      from: process.env.FROM_EMAIL || 'noreply@gardengoldgreen.com',
      subject: `Mise à jour de votre commande #${orderId}`,
      html: generateStatusUpdateHTML(orderId, status, statusMessages[status as keyof typeof statusMessages], trackingNumber),
    }

    const response = await sgMail.send(msg)
    return { success: true, messageId: response[0].headers['x-message-id'] }

  } catch (error) {
    console.error('Erreur envoi email:', error)
    return { success: false, error: error }
  }
}

function generateOrderConfirmationHTML(data: OrderEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de commande</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a1a; color: #fff; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ddd; }
        .total { font-weight: bold; font-size: 1.2em; margin-top: 20px; }
        .footer { background: #1a1a1a; color: #fff; padding: 20px; text-align: center; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌿 Garden Gold Green</h1>
          <h2>Confirmation de commande</h2>
        </div>
        
        <div class="content">
          <p>Bonjour ${data.customerName},</p>
          
          <p>Merci pour votre commande ! Nous avons bien reçu votre paiement et nous préparons votre commande.</p>
          
          <h3>Détails de votre commande</h3>
          <p><strong>Numéro de commande :</strong> #${data.orderId}</p>
          
          <h4>Articles commandés :</h4>
          ${data.items.map(item => `
            <div class="item">
              <span>${item.name} (x${item.quantity})</span>
              <span>${(item.price * item.quantity).toFixed(2)}€</span>
            </div>
          `).join('')}
          
          <div class="total">
            <div class="item">
              <span>Total</span>
              <span>${data.totalAmount.toFixed(2)}€</span>
            </div>
          </div>
          
          <h4>Adresse de livraison :</h4>
          <p>
            ${data.shippingAddress.firstName} ${data.shippingAddress.lastName}<br>
            ${data.shippingAddress.address}<br>
            ${data.shippingAddress.zipCode} ${data.shippingAddress.city}<br>
            ${data.shippingAddress.country}
          </p>
          
          <p>Nous vous enverrons un email avec le numéro de suivi dès que votre commande sera expédiée.</p>
          
          <p>Merci de votre confiance !</p>
          <p>L'équipe Garden Gold Green</p>
        </div>
        
        <div class="footer">
          <p>Garden Gold Green - Produits CBD Premium</p>
          <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateStatusUpdateHTML(orderId: string, status: string, message: string, trackingNumber?: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mise à jour de commande</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a1a; color: #fff; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .footer { background: #1a1a1a; color: #fff; padding: 20px; text-align: center; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌿 Garden Gold Green</h1>
          <h2>Mise à jour de commande</h2>
        </div>
        
        <div class="content">
          <p>Bonjour,</p>
          
          <p>${message}.</p>
          
          <p><strong>Numéro de commande :</strong> #${orderId}</p>
          
          ${trackingNumber ? `
            <p><strong>Numéro de suivi :</strong> ${trackingNumber}</p>
            <p>Vous pouvez suivre votre colis sur le site de votre transporteur.</p>
          ` : ''}
          
          <p>Merci de votre confiance !</p>
          <p>L'équipe Garden Gold Green</p>
        </div>
        
        <div class="footer">
          <p>Garden Gold Green - Produits CBD Premium</p>
          <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
