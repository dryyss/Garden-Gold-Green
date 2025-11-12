import { NextRequest, NextResponse } from 'next/server'
import {
  sendEmail,
  sendOrderConfirmationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendNewsletterWelcomeEmail,
  sendOrderShippedEmail,
} from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...data } = body

    switch (type) {
      case 'welcome':
        await sendWelcomeEmail(data.email, data.name, data.logoUrl)
        break

      case 'password-reset':
        await sendPasswordResetEmail(data.email, data.name, data.resetLink, data.logoUrl)
        break

      case 'newsletter':
        await sendNewsletterWelcomeEmail(
          data.email,
          data.name || data.firstName || 'Client Garden Gold Green',
          data.logoUrl
        )
        break

      case 'order-confirmation':
        await sendOrderConfirmationEmail({
          id: data.id || data.orderId,
          customerEmail: data.customerEmail || data.email,
          customerName: data.customerName || data.name || 'Client',
          total: data.total,
          currency: data.currency || 'EUR',
          items: data.items || [],
          shippingAddress: data.shippingAddress,
          trackingNumber: data.trackingNumber,
          receiptUrl: data.receiptUrl,
          unsubscribeUrl: data.unsubscribeUrl,
          unsubscribePreferencesUrl: data.unsubscribePreferencesUrl,
          logoUrl: data.logoUrl,
        })
        break

      case 'order-shipped':
        await sendOrderShippedEmail({
          email: data.email,
          orderId: data.orderId,
          trackingNumber: data.trackingNumber,
          customerName: data.customerName || data.name,
          trackOrderUrl: data.trackOrderUrl,
          unsubscribeUrl: data.unsubscribeUrl,
          unsubscribePreferencesUrl: data.unsubscribePreferencesUrl,
          logoUrl: data.logoUrl,
        })
        break

      case 'custom':
        await sendEmail({
          to: data.to,
          subject: data.subject,
          html: data.html,
          text: data.text,
        })
        break

      default:
        return NextResponse.json(
          { error: 'Type d\'email non reconnu' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Erreur envoi email:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    )
  }
}







