import sgMail, { MailDataRequired } from '@sendgrid/mail'
import { getProductById } from '@/lib/products-store'

type TemplateData = Record<string, unknown>

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

interface EmailAttachment {
  filename: string
  content: string
  type?: string
}

interface EmailOptions {
  to: string
  subject?: string
  html?: string
  text?: string
  from?: string
  templateId?: string
  dynamicTemplateData?: TemplateData
  attachments?: EmailAttachment[]
}

interface OrderEmailItem {
  name: string
  quantity: number
  price: number
}

interface ShippingAddress {
  firstName?: string
  lastName?: string
  address?: string
  address2?: string
  postalCode?: string
  city?: string
  country?: string
  phone?: string
  email?: string
}

interface OrderEmailPayload {
  id: string
  customerEmail: string
  customerName: string
  total: number
  currency: string
  items: OrderEmailItem[]
  shippingAddress?: ShippingAddress
  billingAddress?: ShippingAddress
  trackingNumber?: string
  receiptUrl?: string
  invoicePdfUrl?: string
  unsubscribeUrl?: string
  unsubscribePreferencesUrl?: string
  logoUrl?: string
}

interface OrderShippedEmailPayload {
  email: string
  orderId: string
  trackingNumber: string
  customerName?: string
  trackOrderUrl?: string
  unsubscribeUrl?: string
  unsubscribePreferencesUrl?: string
  logoUrl?: string
}

const DEFAULT_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'contact@gardengoldgreen.com'
const RAW_APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://gardengoldgreen.com'
const APP_URL = RAW_APP_URL.replace(/\/$/, '')
const LOGO_URL = process.env.SENDGRID_LOGO_URL || `${APP_URL}/logo.png`
const TRACK_ORDER_URL = `${APP_URL}/track-order`
const PRODUCTS_URL = `${APP_URL}/products`

const ORDER_CONFIRMATION_TEMPLATE_ID = process.env.SENDGRID_TEMPLATE_ORDER_CONFIRMATION
const ORDER_SHIPPED_TEMPLATE_ID = process.env.SENDGRID_TEMPLATE_ORDER_SHIPPED
const WELCOME_TEMPLATE_ID = process.env.SENDGRID_TEMPLATE_WELCOME
const PASSWORD_RESET_TEMPLATE_ID = process.env.SENDGRID_TEMPLATE_PASSWORD_RESET
const NEWSLETTER_WELCOME_TEMPLATE_ID = process.env.SENDGRID_TEMPLATE_NEWSLETTER_WELCOME

function cleanData(data: TemplateData): TemplateData {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined && value !== null)
  )
}

function withBaseData(data: TemplateData): TemplateData {
  return cleanData({
    app_url: APP_URL,
    logo_url: LOGO_URL,
    unsubscribe: process.env.SENDGRID_UNSUBSCRIBE_URL,
    unsubscribe_preferences: process.env.SENDGRID_UNSUBSCRIBE_PREFERENCES_URL,
    ...data,
  })
}

function formatPrice(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('❌ SENDGRID_API_KEY non configurée')
    return
  }

  if (!options.html && !options.templateId) {
    console.error('❌ sendEmail nécessite soit un templateId soit du HTML inline')
    return
  }

  const message: any = {
    to: options.to,
    from: options.from || DEFAULT_FROM_EMAIL,
  }

  if (options.subject) {
    message.subject = options.subject
  }
  if (options.text) {
    message.text = options.text
  }
  if (options.html) {
    message.html = options.html
  }
  if (options.templateId) {
    message.templateId = options.templateId
    if (options.dynamicTemplateData) {
      message.dynamicTemplateData = options.dynamicTemplateData
    }
  }

  if (options.attachments?.length) {
    message.attachments = options.attachments
  }

  try {
    await sgMail.send(message)
    console.log(`✅ Email envoyé à ${options.to}`)
  } catch (error) {
    console.error('❌ Erreur envoi email:', error)
    throw error
  }
}

export async function sendOrderConfirmationEmail(order: OrderEmailPayload) {
  if (!ORDER_CONFIRMATION_TEMPLATE_ID) {
    console.error('❌ SENDGRID_TEMPLATE_ORDER_CONFIRMATION non configuré')
    return
  }

  const shipping = order.shippingAddress || {}
  const billing = order.billingAddress || {}
  const items = order.items || []

  const attachments: EmailAttachment[] = []

  if (order.invoicePdfUrl) {
    try {
      const response = await fetch(order.invoicePdfUrl)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const buffer = Buffer.from(await response.arrayBuffer())
      attachments.push({
        filename: `facture-${order.id}.pdf`,
        content: buffer.toString('base64'),
        type: 'application/pdf',
      })
    } catch (attachmentError) {
      console.warn('⚠️ Impossible de joindre la facture PDF:', attachmentError)
    }
  }

  // Préparer les items pour l'email
  const emailItems = await Promise.all(items.map(async (item) => {
    const priceCentsValue =
      typeof (item as any).priceCents === 'number' ? (item as any).priceCents : undefined
    const productId = (item as any).productId || (item as any).id

    let unitPriceAmount =
      typeof item.price === 'number'
        ? item.price
        : priceCentsValue !== undefined
          ? priceCentsValue / 100
          : undefined

    if (unitPriceAmount === undefined && productId) {
      const product = await getProductById(String(productId))
      if (product?.priceCents) {
        unitPriceAmount = product.priceCents / 100
      }
    }

    if (unitPriceAmount === undefined) {
      unitPriceAmount = 0
    }

    const lineTotalAmount = unitPriceAmount * (item.quantity || 0)

    return {
      name: item.name,
      quantity: item.quantity,
      unit_price: formatPrice(unitPriceAmount, order.currency),
      line_total: formatPrice(lineTotalAmount, order.currency),
    }
  }))

  await sendEmail({
    to: order.customerEmail,
    templateId: ORDER_CONFIRMATION_TEMPLATE_ID,
    attachments: attachments.length ? attachments : undefined,
    dynamicTemplateData: withBaseData({
      logo_url: order.logoUrl || LOGO_URL,
      unsubscribe: order.unsubscribeUrl || process.env.SENDGRID_UNSUBSCRIBE_URL,
      unsubscribe_preferences:
        order.unsubscribePreferencesUrl || process.env.SENDGRID_UNSUBSCRIBE_PREFERENCES_URL,
      order_id: order.id,
      customer_name: order.customerName,
      order_total: formatPrice(order.total, order.currency),
      items: emailItems,
      tracking_number: order.trackingNumber,
      shipping_name: `${shipping.firstName ?? ''} ${shipping.lastName ?? ''}`.trim() || undefined,
      shipping_address: shipping.address,
      shipping_address2: shipping.address2,
      shipping_postal_code: shipping.postalCode,
      shipping_city: shipping.city,
      shipping_country: shipping.country,
      shipping_phone: shipping.phone,
      billing_name: `${billing.firstName ?? ''} ${billing.lastName ?? ''}`.trim() || undefined,
      billing_address: billing.address,
      billing_address2: billing.address2,
      billing_postal_code: billing.postalCode,
      billing_city: billing.city,
      billing_country: billing.country,
      billing_phone: billing.phone,
      billing_email: billing.email,
      track_order_url: TRACK_ORDER_URL,
      receipt_url: order.receiptUrl,
    }),
  })
}

export async function sendWelcomeEmail(email: string, name: string, logoUrl?: string) {
  if (!WELCOME_TEMPLATE_ID) {
    console.error('❌ SENDGRID_TEMPLATE_WELCOME non configuré')
    return
  }

  await sendEmail({
    to: email,
    templateId: WELCOME_TEMPLATE_ID,
    dynamicTemplateData: withBaseData({
      logo_url: logoUrl || LOGO_URL,
      customer_name: name,
      products_url: PRODUCTS_URL,
    }),
  })
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetLink: string,
  logoUrl?: string
) {
  if (!PASSWORD_RESET_TEMPLATE_ID) {
    console.error('❌ SENDGRID_TEMPLATE_PASSWORD_RESET non configuré')
    return
  }

  await sendEmail({
    to: email,
    templateId: PASSWORD_RESET_TEMPLATE_ID,
    dynamicTemplateData: withBaseData({
      logo_url: logoUrl || LOGO_URL,
      customer_name: name,
      reset_link: resetLink,
    }),
  })
}

export async function sendNewsletterWelcomeEmail(email: string, name: string, logoUrl?: string) {
  if (!NEWSLETTER_WELCOME_TEMPLATE_ID) {
    console.error('❌ SENDGRID_TEMPLATE_NEWSLETTER_WELCOME non configuré')
    return
  }

  await sendEmail({
    to: email,
    templateId: NEWSLETTER_WELCOME_TEMPLATE_ID,
    dynamicTemplateData: withBaseData({
      logo_url: logoUrl || LOGO_URL,
      customer_name: name,
      products_url: PRODUCTS_URL,
    }),
  })
}

export async function sendOrderShippedEmail(payload: OrderShippedEmailPayload) {
  if (!ORDER_SHIPPED_TEMPLATE_ID) {
    console.error('❌ SENDGRID_TEMPLATE_ORDER_SHIPPED non configuré')
    return
  }

  await sendEmail({
    to: payload.email,
    templateId: ORDER_SHIPPED_TEMPLATE_ID,
    dynamicTemplateData: withBaseData({
      logo_url: payload.logoUrl || LOGO_URL,
      unsubscribe: payload.unsubscribeUrl || process.env.SENDGRID_UNSUBSCRIBE_URL,
      unsubscribe_preferences:
        payload.unsubscribePreferencesUrl || process.env.SENDGRID_UNSUBSCRIBE_PREFERENCES_URL,
      order_id: payload.orderId,
      customer_name: payload.customerName || 'Client',
      tracking_number: payload.trackingNumber,
      track_order_url: payload.trackOrderUrl || TRACK_ORDER_URL,
    }),
  })
}


