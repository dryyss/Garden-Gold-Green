import sgMail from '@sendgrid/mail'

// Configuration SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
  from?: string
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('❌ SENDGRID_API_KEY non configurée')
    return
  }

  try {
    await sgMail.send({
      to: options.to,
      from: options.from || process.env.SENDGRID_FROM_EMAIL || 'contact@gardengoldgreen.com',
      subject: options.subject,
      text: options.text || '',
      html: options.html,
    })
    console.log(`✅ Email envoyé à ${options.to}`)
  } catch (error) {
    console.error('❌ Erreur envoi email:', error)
    throw error
  }
}

// Template d'email de confirmation de commande
export function getOrderConfirmationTemplate(order: {
  id: string
  customerName: string
  total: number
  currency: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  shippingAddress: any
  trackingNumber?: string
}): string {
  const itemsHTML = order.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">€${item.price.toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">€${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation de commande</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #fbbf24 0%, #10b981 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #fff; margin: 0;">🎉 Commande confirmée !</h1>
        </div>
        
        <div style="background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
          <p>Bonjour <strong>${order.customerName}</strong>,</p>
          
          <p>Merci pour votre commande chez <strong>Garden Gold Green</strong> ! Nous avons bien reçu votre commande #${order.id}.</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #111827;">Résumé de votre commande</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #111827; color: #fff;">
                  <th style="padding: 12px; text-align: left;">Produit</th>
                  <th style="padding: 12px; text-align: center;">Quantité</th>
                  <th style="padding: 12px; text-align: right;">Prix unitaire</th>
                  <th style="padding: 12px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold; border-top: 2px solid #111827;">Total</td>
                  <td style="padding: 12px; text-align: right; font-weight: bold; font-size: 1.2em; color: #10b981; border-top: 2px solid #111827;">
                    ${order.currency === 'EUR' ? '€' : ''}${order.total.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          ${order.trackingNumber ? `
            <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
              <p style="margin: 0;">
                <strong>📦 Numéro de suivi :</strong> ${order.trackingNumber}
              </p>
            </div>
          ` : ''}
          
          <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
            <p style="margin: 0;">
              <strong>📍 Adresse de livraison :</strong><br>
              ${order.shippingAddress.firstName || ''} ${order.shippingAddress.lastName || ''}<br>
              ${order.shippingAddress.address || ''}<br>
              ${order.shippingAddress.postalCode || ''} ${order.shippingAddress.city || ''}<br>
              ${order.shippingAddress.country || ''}
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track-order" 
               style="background: #fbbf24; color: #111827; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Suivre ma commande
            </a>
          </div>
          
          <p>Nous vous enverrons un email de confirmation dès que votre commande sera expédiée.</p>
          
          <p style="margin-top: 30px;">À très bientôt,<br><strong>L'équipe Garden Gold Green 🌿</strong></p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
          <p>Vous avez reçu cet email car vous avez passé une commande sur <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" style="color: #10b981;">Garden Gold Green</a></p>
        </div>
      </body>
    </html>
  `
}

// Template d'email de bienvenue
export function getWelcomeEmailTemplate(user: {
  name: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Bienvenue chez Garden Gold Green</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #fbbf24 0%, #10b981 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #fff; margin: 0;">🌿 Bienvenue !</h1>
        </div>
        
        <div style="background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
          <p>Bonjour <strong>${user.name}</strong>,</p>
          
          <p>Nous sommes ravis de vous accueillir chez <strong>Garden Gold Green</strong> ! 🎉</p>
          
          <p>Découvrez notre sélection de produits CBD premium :</p>
          <ul>
            <li>🌿 Huiles CBD de qualité supérieure</li>
            <li>🌸 Fleurs CBD sélectionnées</li>
            <li>💊 Capsules et gummies</li>
            <li>🧴 Cosmétiques CBD naturels</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/products" 
               style="background: #fbbf24; color: #111827; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Découvrir nos produits
            </a>
          </div>
          
          <p><strong>Avantages de votre compte :</strong></p>
          <ul>
            <li>✅ Suivi en temps réel de vos commandes</li>
            <li>✅ Historique de vos achats</li>
            <li>✅ Gestion de vos abonnements</li>
            <li>✅ Livraison gratuite dès 50€</li>
          </ul>
          
          <p style="margin-top: 30px;">À très bientôt,<br><strong>L'équipe Garden Gold Green 🌿</strong></p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
          <p>Vous avez reçu cet email car vous avez créé un compte sur <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" style="color: #10b981;">Garden Gold Green</a></p>
        </div>
      </body>
    </html>
  `
}

// Template d'email de reset password
export function getPasswordResetTemplate(name: string, resetLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Réinitialisation de mot de passe</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #fbbf24 0%, #10b981 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #fff; margin: 0;">🔐 Réinitialisation</h1>
        </div>
        
        <div style="background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
          <p>Bonjour <strong>${name}</strong>,</p>
          
          <p>Vous avez demandé la réinitialisation de votre mot de passe sur <strong>Garden Gold Green</strong>.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background: #fbbf24; color: #111827; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Réinitialiser mon mot de passe
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            ⚠️ Ce lien est valable pendant 24 heures. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
          </p>
          
          <p style="margin-top: 30px;">Cordialement,<br><strong>L'équipe Garden Gold Green 🌿</strong></p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
          <p>Vous avez reçu cet email car une réinitialisation de mot de passe a été demandée sur votre compte.</p>
        </div>
      </body>
    </html>
  `
}

// Template d'email de newsletter
export function getNewsletterWelcomeTemplate(): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Bienvenue à la newsletter</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #fbbf24 0%, #10b981 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #fff; margin: 0;">📬 Bienvenue à la newsletter !</h1>
        </div>
        
        <div style="background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
          <p>Merci de vous être inscrit à notre newsletter ! 🎉</p>
          
          <p>Vous recevrez désormais :</p>
          <ul>
            <li>✨ Nos dernières actualités CBD</li>
            <li>🎁 Offres exclusives et promotions</li>
            <li>📚 Conseils bien-être et guides</li>
            <li>🆕 Lancements de nouveaux produits</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/products" 
               style="background: #fbbf24; color: #111827; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Découvrir nos produits
            </a>
          </div>
          
          <p style="margin-top: 30px;">À très bientôt,<br><strong>L'équipe Garden Gold Green 🌿</strong></p>
        </div>
      </body>
    </html>
  `
}

// Fonctions d'envoi d'emails spécialisés
export async function sendOrderConfirmationEmail(order: any) {
  const html = getOrderConfirmationTemplate(order)
  await sendEmail({
    to: order.customerEmail,
    subject: `🎉 Commande confirmée #${order.id} - Garden Gold Green`,
    html,
  })
}

export async function sendWelcomeEmail(email: string, name: string) {
  const html = getWelcomeEmailTemplate({ name })
  await sendEmail({
    to: email,
    subject: '🌿 Bienvenue chez Garden Gold Green !',
    html,
  })
}

export async function sendPasswordResetEmail(email: string, name: string, resetLink: string) {
  const html = getPasswordResetTemplate(name, resetLink)
  await sendEmail({
    to: email,
    subject: '🔐 Réinitialisation de votre mot de passe',
    html,
  })
}

export async function sendNewsletterWelcomeEmail(email: string) {
  const html = getNewsletterWelcomeTemplate()
  await sendEmail({
    to: email,
    subject: '📬 Bienvenue à notre newsletter !',
    html,
  })
}

export async function sendOrderShippedEmail(email: string, orderId: string, trackingNumber: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Commande expédiée</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #fbbf24 0%, #10b981 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #fff; margin: 0;">📦 Votre commande est expédiée !</h1>
        </div>
        
        <div style="background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
          <p>Bonjour,</p>
          
          <p>Excellente nouvelle ! Votre commande <strong>#${orderId}</strong> a été expédiée et est en route. 🚀</p>
          
          <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
            <p style="margin: 0;">
              <strong>📦 Numéro de suivi :</strong> ${trackingNumber}
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track-order" 
               style="background: #fbbf24; color: #111827; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Suivre ma commande
            </a>
          </div>
          
          <p>À très bientôt,<br><strong>L'équipe Garden Gold Green 🌿</strong></p>
        </div>
      </body>
    </html>
  `
  
  await sendEmail({
    to: email,
    subject: `📦 Votre commande #${orderId} est expédiée`,
    html,
  })
}

