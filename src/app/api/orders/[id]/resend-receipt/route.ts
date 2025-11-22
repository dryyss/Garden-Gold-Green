import { NextRequest, NextResponse } from 'next/server'
import { readOrdersMap } from '@/lib/orders-store'
import { sendOrderConfirmationEmail } from '@/lib/email'
import { getSession } from '@auth0/nextjs-auth0'

// POST - Renvoyer le reçu/facture par email
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const orderId = params.id

    if (!orderId) {
      return NextResponse.json(
        { error: 'ID de commande requis' },
        { status: 400 }
      )
    }

    const orders = await readOrdersMap()
    const order = orders[orderId]

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier que l'utilisateur est le propriétaire de la commande ou un admin
    const userEmail = session.user.email?.toLowerCase()
    const orderEmail = order.customerEmail?.toLowerCase()
    
    if (userEmail !== orderEmail && !session.user['https://gardengoldgreen.com/roles']?.includes('admin')) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    if (!order.customerEmail) {
      return NextResponse.json(
        { error: 'Email client manquant pour cette commande' },
        { status: 400 }
      )
    }

    // Renvoyer l'email de confirmation avec le reçu/facture
    try {
      await sendOrderConfirmationEmail({
        id: order.id,
        customerEmail: order.customerEmail,
        customerName: order.customerName || 'Client',
        total: order.totalCents / 100,
        currency: order.currency,
        items: order.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.priceCents / 100,
        })),
        shippingAddress: order.shippingAddress || {},
        billingAddress: order.billingAddress || {},
        receiptUrl: order.receiptUrl || order.invoicePdf || undefined,
        invoicePdfUrl: order.invoicePdf || undefined,
      })

      return NextResponse.json({
        success: true,
        message: 'Reçu renvoyé avec succès'
      })
    } catch (emailError) {
      console.error('❌ Erreur lors de l\'envoi du reçu:', emailError)
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi du reçu' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Erreur lors du renvoi du reçu:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

