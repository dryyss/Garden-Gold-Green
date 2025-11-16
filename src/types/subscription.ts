// Types pour les abonnements
export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string | null;
  interval: 'weekly' | 'monthly' | 'yearly';
  intervalCount: number;
  priceCents: number;
  discount?: number;
  productId: string;
  product?: Product;
  isActive: boolean;
  stripePriceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  user?: User;
  planId: string;
  plan?: SubscriptionPlan;
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  stripeSubscriptionId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  nextBillingDate?: Date;
  quantity: number;
  pausedAt?: Date;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deliveries?: SubscriptionDelivery[];
}

export interface SubscriptionDelivery {
  id: string;
  subscriptionId: string;
  subscription?: Subscription;
  orderId?: string;
  scheduledDate: Date;
  deliveredDate?: Date;
  status: 'scheduled' | 'shipped' | 'delivered' | 'failed';
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Types pour l'interface utilisateur
export interface SubscriptionPlanWithDetails extends SubscriptionPlan {
  originalPriceCents: number;
  savingsCents: number;
  savingsPercentage: number;
  formattedPrice: string;
  formattedOriginalPrice: string;
  formattedSavings: string;
  intervalDisplay: string;
  nextDeliveryDate?: Date;
}

export interface SubscriptionWithDetails extends Subscription {
  plan?: SubscriptionPlanWithDetails;
  nextDelivery?: SubscriptionDelivery;
  canPause: boolean;
  canCancel: boolean;
  canResume: boolean;
}

// Types pour les formulaires
export interface CreateSubscriptionData {
  planId: string;
  quantity?: number;
  paymentMethodId?: string;
  shippingAddress?: Address;
}

export interface UpdateSubscriptionData {
  quantity?: number;
  status?: 'paused' | 'cancelled';
  shippingAddress?: Address;
}

// Types pour les statistiques
export interface SubscriptionStats {
  totalActive: number;
  totalPaused: number;
  totalCancelled: number;
  monthlyRevenue: number;
  averageOrderValue: number;
  churnRate: number;
  popularPlans: {
    planId: string;
    planName: string;
    count: number;
    revenue: number;
  }[];
}

// Types pour les webhooks Stripe
export interface StripeSubscriptionEvent {
  id: string;
  object: string;
  type: string;
  data: {
    object: {
      id: string;
      status: string;
      current_period_start: number;
      current_period_end: number;
      customer: string;
      items: {
        data: Array<{
          price: {
            id: string;
            unit_amount: number;
            recurring: {
              interval: string;
              interval_count: number;
            };
          };
          quantity: number;
        }>;
      };
    };
  };
}

// Types utilitaires
export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description?: string;
  priceCents: number;
  currency: string;
  cbdPercent?: number;
  sku?: string;
  stock: number;
  images: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Constantes pour les intervalles
export const SUBSCRIPTION_INTERVALS = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly'
} as const;

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired'
} as const;

export const DELIVERY_STATUS = {
  SCHEDULED: 'scheduled',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  FAILED: 'failed'
} as const;

// Fonctions utilitaires
export function formatInterval(interval: string, intervalCount: number = 1): string {
  const intervals = {
    weekly: intervalCount === 1 ? 'semaine' : `${intervalCount} semaines`,
    monthly: intervalCount === 1 ? 'mois' : `${intervalCount} mois`,
    yearly: intervalCount === 1 ? 'an' : `${intervalCount} ans`
  };
  
  return intervals[interval as keyof typeof intervals] || interval;
}

export function calculateSavings(originalPrice: number, subscriptionPrice: number): {
  amount: number;
  percentage: number;
} {
  const savings = originalPrice - subscriptionPrice;
  const percentage = (savings / originalPrice) * 100;
  
  return {
    amount: Math.round(savings),
    percentage: Math.round(percentage * 10) / 10
  };
}

export function getNextBillingDate(
  interval: string, 
  intervalCount: number, 
  fromDate: Date = new Date()
): Date {
  const date = new Date(fromDate);
  
  switch (interval) {
    case 'weekly':
      date.setDate(date.getDate() + (7 * intervalCount));
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + intervalCount);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + intervalCount);
      break;
    default:
      throw new Error(`Interval non supporté: ${interval}`);
  }
  
  return date;
}

export function formatCurrency(amountCents: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency
  }).format(amountCents / 100);
}
