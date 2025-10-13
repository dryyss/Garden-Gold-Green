'use client';

import React, { useState } from 'react';
import { 
  SubscriptionPlanWithDetails, 
  formatCurrency, 
  formatInterval,
  calculateSavings,
  getNextBillingDate 
} from '@/types/subscription';

interface SubscriptionPlansProps {
  productId: string;
  productTitle: string;
  originalPrice: number;
  plans: SubscriptionPlanWithDetails[];
  onSelectPlan: (plan: SubscriptionPlanWithDetails) => void;
  className?: string;
}

export default function SubscriptionPlans({ 
  productId, 
  productTitle, 
  originalPrice, 
  plans, 
  onSelectPlan,
  className = '' 
}: SubscriptionPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePlanSelect = (plan: SubscriptionPlanWithDetails) => {
    setSelectedPlan(plan.id);
    onSelectPlan(plan);
  };

  const getPlanIcon = (interval: string) => {
    switch (interval) {
      case 'weekly':
        return '📅';
      case 'monthly':
        return '🗓️';
      case 'yearly':
        return '🎁';
      default:
        return '📦';
    }
  };

  const getPlanColor = (interval: string) => {
    switch (interval) {
      case 'weekly':
        return 'border-blue-200 bg-blue-50';
      case 'monthly':
        return 'border-green-200 bg-green-50';
      case 'yearly':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getPopularBadge = (interval: string) => {
    if (interval === 'monthly') {
      return (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Le plus populaire
          </span>
        </div>
      );
    }
    return null;
  };

  if (!plans || plans.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucun plan d'abonnement disponible pour ce produit.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Choisissez votre abonnement
        </h3>
        <p className="text-gray-600">
          Économisez avec nos packs d'abonnement pour {productTitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const savings = calculateSavings(originalPrice, plan.priceCents);
          
          return (
            <div
              key={plan.id}
              className={`relative rounded-xl border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected 
                  ? 'border-green-500 bg-green-50 shadow-lg scale-105' 
                  : `${getPlanColor(plan.interval)} hover:shadow-md`
              }`}
              onClick={() => handlePlanSelect(plan)}
            >
              {getPopularBadge(plan.interval)}
              
              <div className="text-center">
                <div className="text-3xl mb-3">
                  {getPlanIcon(plan.interval)}
                </div>
                
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h4>
                
                <div className="mb-4">
                  <div className="text-3xl font-bold text-gray-900">
                    {formatCurrency(plan.priceCents)}
                  </div>
                  <div className="text-sm text-gray-500">
                    par {formatInterval(plan.interval, plan.intervalCount)}
                  </div>
                </div>

                {savings.amount > 0 && (
                  <div className="mb-4 p-3 bg-green-100 rounded-lg">
                    <div className="text-green-800 font-semibold">
                      Économisez {formatCurrency(savings.amount)}
                    </div>
                    <div className="text-green-600 text-sm">
                      ({savings.percentage}% de remise)
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-600 mb-4">
                  {plan.description}
                </div>

                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Prix normal:</span>
                    <span className="line-through">{formatCurrency(originalPrice)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Votre prix:</span>
                    <span className="text-green-600">{formatCurrency(plan.priceCents)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prochaine livraison:</span>
                    <span>{getNextBillingDate(plan.interval, plan.intervalCount).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                <button
                  className={`w-full mt-4 py-3 px-4 rounded-lg font-semibold transition-colors ${
                    isSelected
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {isSelected ? 'Plan sélectionné' : 'Choisir ce plan'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="text-blue-500 text-xl mr-3">💡</div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">
              Avantages des abonnements
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Livraison automatique et régulière</li>
              <li>• Remises exclusives sur tous les abonnements</li>
              <li>• Possibilité de mettre en pause ou annuler à tout moment</li>
              <li>• Accès prioritaire aux nouveaux produits</li>
              <li>• Support client dédié</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
