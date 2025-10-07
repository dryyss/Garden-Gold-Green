import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    const {
      email,
      firstName,
      lastName,
      phone,
      address,
      city,
      postalCode,
      country,
      cardNumber,
      expiryDate,
      cvv,
      cardName,
      items,
      totalCents,
      saveInfo
    } = orderData

    // Validation des données requises
    if (!email || !firstName || !lastName || !phone || !address || !city || !postalCode || !country) {
      return NextResponse.json(
        { error: 'Informations de livraison incomplètes' },
        { status: 400 }
      )
    }

    if (!cardNumber || !expiryDate || !cvv || !cardName) {
      return NextResponse.json(
        { error: 'Informations de paiement incomplètes' },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Aucun article dans la commande' },
        { status: 400 }
      )
    }

    // Créer la commande express
    const order = await prisma.order.create({
      data: {
        userId: null, // Commande sans compte utilisateur
        totalCents,
        currency: 'EUR',
        status: 'pending',
        shippingAddress: {
          firstName,
          lastName,
          email,
          phone,
          address,
          city,
          postalCode,
          country
        },
        paymentIntentId: null, // À implémenter avec Stripe
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            priceCents: item.priceCents,
            quantity: item.quantity
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    // Si l'utilisateur souhaite sauvegarder ses informations, créer un compte
    if (saveInfo) {
      // Ici vous pourriez créer un compte utilisateur avec les informations fournies
      // et lier la commande à ce compte
      console.log('L\'utilisateur souhaite sauvegarder ses informations pour les prochaines commandes')
    }

    // Ici vous devriez intégrer avec Stripe pour le paiement
    // Pour l'instant, on simule un paiement réussi
    const paymentIntentId = `pi_express_${Date.now()}`

    // Mettre à jour la commande avec l'ID de paiement
    await prisma.order.update({
      where: { id: order.id },
      data: { 
        paymentIntentId,
        status: 'paid' // En production, ceci devrait être mis à jour par Stripe webhook
      }
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      paymentIntentId,
      message: 'Commande créée avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de la création de la commande express:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    )
  }
}
