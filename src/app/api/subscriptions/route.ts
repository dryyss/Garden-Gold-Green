import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { 
  SubscriptionWithDetails, 
  formatCurrency, 
  formatInterval,
  getNextBillingDate 
} from '@/types/subscription';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId est requis' },
        { status: 400 }
      );
    }

    // Récupérer les abonnements de l'utilisateur
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId
      },
      include: {
        plan: {
          include: {
            product: {
              select: {
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
          },
          take: 5 // Dernières 5 livraisons
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Enrichir les données
    const enrichedSubscriptions = subscriptions.map(subscription => {
      const canPause = subscription.status === 'active';
      const canCancel = subscription.status === 'active';
      const canResume = subscription.status === 'paused';
      
      return {
        ...subscription,
        canPause,
        canCancel,
        canResume,
        nextDelivery: subscription.deliveries?.find(d => d.status === 'scheduled')
      };
    });

    return NextResponse.json({
      success: true,
      data: enrichedSubscriptions
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des abonnements:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      planId, 
      quantity = 1, 
      shippingAddress,
      paymentMethodId 
    } = body;

    // Validation des données
    if (!userId || !planId || !shippingAddress) {
      return NextResponse.json(
        { error: 'Données manquantes requises' },
        { status: 400 }
      );
    }

    // Vérifier que le plan existe
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
      include: {
        product: true
      }
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan d\'abonnement non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Calculer les dates
    const now = new Date();
    const currentPeriodEnd = getNextBillingDate(plan.interval, plan.intervalCount, now);
    const nextBillingDate = getNextBillingDate(plan.interval, plan.intervalCount, currentPeriodEnd);

    // Créer l'abonnement
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planId,
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd,
        nextBillingDate,
        quantity
      },
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

    // Créer la première livraison programmée
    await prisma.subscriptionDelivery.create({
      data: {
        subscriptionId: subscription.id,
        scheduledDate: currentPeriodEnd
      }
    });

    // TODO: Intégrer avec Stripe pour créer l'abonnement récurrent
    // const stripeSubscription = await stripe.subscriptions.create({
    //   customer: user.stripeCustomerId,
    //   items: [{
    //     price: plan.stripePriceId,
    //     quantity: quantity
    //   }],
    //   default_payment_method: paymentMethodId
    // });

    return NextResponse.json({
      success: true,
      data: subscription
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création de l\'abonnement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
