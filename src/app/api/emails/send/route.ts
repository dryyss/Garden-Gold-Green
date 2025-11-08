import { NextRequest, NextResponse } from 'next/server'
import { 
  sendEmail, 
  sendWelcomeEmail, 
  sendPasswordResetEmail, 
  sendNewsletterWelcomeEmail,
  sendOrderShippedEmail 
} from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...data } = body

    switch (type) {
      case 'welcome':
        await sendWelcomeEmail(data.email, data.name)
        break

      case 'password-reset':
        await sendPasswordResetEmail(data.email, data.name, data.resetLink)
        break

      case 'newsletter':
        await sendNewsletterWelcomeEmail(data.email)
        break

      case 'order-shipped':
        await sendOrderShippedEmail(data.email, data.orderId, data.trackingNumber)
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







