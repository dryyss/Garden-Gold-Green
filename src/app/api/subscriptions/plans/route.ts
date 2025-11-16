import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { 
  SubscriptionPlanWithDetails, 
  formatCurrency, 
  calculateSavings,
  getNextBillingDate 
} from '@/types/subscription';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'ProductId est requis' },
        { status: 400 }
      );
    }

    // Récupérer les plans d'abonnement pour le produit
    const plans = await prisma.subscriptionPlan.findMany({
      where: {
        productId,
        isActive: true
      },
      include: {
        product: {
          select: {
            title: true,
            priceCents: true,
            currency: true
          }
        }
      },
      orderBy: [
        { interval: 'asc' },
        { intervalCount: 'asc' }
      ]
    });

    // Enrichir les données avec les calculs
    const enrichedPlans: SubscriptionPlanWithDetails[] = plans.map(plan => {
      const originalPrice = plan.product.priceCents;
      const savings = calculateSavings(originalPrice, plan.priceCents);
      
      return {
        ...(plan as any),
        originalPriceCents: originalPrice,
        savingsCents: savings.amount,
        savingsPercentage: savings.percentage,
        formattedPrice: formatCurrency(plan.priceCents, plan.product.currency),
        formattedOriginalPrice: formatCurrency(originalPrice, plan.product.currency),
        formattedSavings: formatCurrency(savings.amount, plan.product.currency),
        intervalDisplay: plan.interval === 'weekly' ? 'semaine' : 
                        plan.interval === 'monthly' ? 'mois' : 'an',
        nextDeliveryDate: getNextBillingDate(plan.interval, plan.intervalCount)
      };
    });

    return NextResponse.json({
      success: true,
      data: enrichedPlans
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des plans:', error);
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
      productId, 
      name, 
      description, 
      interval, 
      intervalCount = 1, 
      priceCents, 
      discount,
      stripePriceId 
    } = body;

    // Validation des données
    if (!productId || !name || !interval || !priceCents) {
      return NextResponse.json(
        { error: 'Données manquantes requises' },
        { status: 400 }
      );
    }

    // Vérifier que le produit existe
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    // Créer le plan d'abonnement
    const plan = await prisma.subscriptionPlan.create({
      data: {
        productId,
        name,
        description,
        interval,
        intervalCount,
        priceCents,
        discount,
        stripePriceId,
        isActive: true
      },
      include: {
        product: {
          select: {
            title: true,
            priceCents: true,
            currency: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: plan
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création du plan:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
