import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subscriptionId = params.id;

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        plan: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                priceCents: true,
                currency: true,
                images: true
              }
            }
          }
        },
        deliveries: {
          orderBy: {
            scheduledDate: 'desc'
          }
        }
      }
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Abonnement non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: subscription
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'abonnement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subscriptionId = params.id;
    const body = await request.json();
    const { 
      status, 
      quantity,
      shippingAddress 
    } = body;

    // Vérifier que l'abonnement existe
    const existingSubscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId }
    });

    if (!existingSubscription) {
      return NextResponse.json(
        { error: 'Abonnement non trouvé' },
        { status: 404 }
      );
    }

    // Préparer les données de mise à jour
    const updateData: any = {};

    if (status) {
      updateData.status = status;
      
      // Ajouter des timestamps selon le statut
      if (status === 'paused') {
        updateData.pausedAt = new Date();
      } else if (status === 'cancelled') {
        updateData.cancelledAt = new Date();
      } else if (status === 'active' && existingSubscription.status === 'paused') {
        updateData.pausedAt = null; // Supprimer la date de pause
      }
    }

    if (quantity !== undefined) {
      updateData.quantity = quantity;
    }

    if (shippingAddress) {
      updateData.shippingAddress = JSON.stringify(shippingAddress);
    }

    // Mettre à jour l'abonnement
    const subscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: updateData,
      include: {
        plan: {
          include: {
            product: {
              select: {
                title: true,
                priceCents: true,
                currency: true
              }
            }
          }
        }
      }
    });

    // TODO: Mettre à jour l'abonnement Stripe si nécessaire
    // if (subscription.stripeSubscriptionId) {
    //   if (status === 'paused') {
    //     await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    //       pause_collection: { behavior: 'void' }
    //     });
    //   } else if (status === 'cancelled') {
    //     await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
    //   } else if (status === 'active' && quantity !== undefined) {
    //     await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    //       items: [{
    //         id: subscription.stripeSubscriptionId,
    //         quantity: quantity
    //       }]
    //     });
    //   }
    // }

    return NextResponse.json({
      success: true,
      data: subscription
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'abonnement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subscriptionId = params.id;

    // Vérifier que l'abonnement existe
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId }
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Abonnement non trouvé' },
        { status: 404 }
      );
    }

    // Marquer l'abonnement comme annulé au lieu de le supprimer
    const cancelledSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'cancelled',
        cancelledAt: new Date()
      }
    });

    // TODO: Annuler l'abonnement Stripe
    // if (subscription.stripeSubscriptionId) {
    //   await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
    // }

    return NextResponse.json({
      success: true,
      data: cancelledSubscription
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'abonnement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
