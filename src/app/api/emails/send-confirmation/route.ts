import { NextRequest, NextResponse } from 'next/server'
import { sendOrderConfirmationEmail } from '@/lib/email'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID requis' },
        { status: 400 }
      )
    }

    // Récupérer la commande
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      )
    }

    // Envoyer l'email de confirmation
    const result = await sendOrderConfirmationEmail({
      orderId: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      items: order.items as any,
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress as any,
    })

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        messageId: result.messageId,
        message: 'Email de confirmation envoyé'
      })
    } else {
      return NextResponse.json(
        { error: 'Erreur envoi email', details: result.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Erreur envoi email confirmation:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
