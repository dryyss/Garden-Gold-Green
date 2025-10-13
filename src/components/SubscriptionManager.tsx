'use client';

import React, { useState } from 'react';
import { 
  SubscriptionWithDetails, 
  formatCurrency, 
  formatInterval,
  SUBSCRIPTION_STATUS,
  DELIVERY_STATUS 
} from '@/types/subscription';

interface SubscriptionManagerProps {
  subscriptions: SubscriptionWithDetails[];
  onPauseSubscription: (subscriptionId: string) => void;
  onCancelSubscription: (subscriptionId: string) => void;
  onResumeSubscription: (subscriptionId: string) => void;
  onUpdateQuantity: (subscriptionId: string, quantity: number) => void;
  className?: string;
}

export default function SubscriptionManager({
  subscriptions,
  onPauseSubscription,
  onCancelSubscription,
  onResumeSubscription,
  onUpdateQuantity,
  className = ''
}: SubscriptionManagerProps) {
  const [expandedSubscription, setExpandedSubscription] = useState<string | null>(null);
  const [editingQuantity, setEditingQuantity] = useState<{ [key: string]: number }>({});

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'paused':
        return 'En pause';
      case 'cancelled':
        return 'Annulé';
      case 'expired':
        return 'Expiré';
      default:
        return status;
    }
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeliveryStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Programmée';
      case 'shipped':
        return 'Expédiée';
      case 'delivered':
        return 'Livrée';
      case 'failed':
        return 'Échec';
      default:
        return status;
    }
  };

  const handleQuantityChange = (subscriptionId: string, newQuantity: number) => {
    setEditingQuantity(prev => ({
      ...prev,
      [subscriptionId]: newQuantity
    }));
  };

  const handleQuantitySave = (subscriptionId: string) => {
    const newQuantity = editingQuantity[subscriptionId];
    if (newQuantity && newQuantity > 0) {
      onUpdateQuantity(subscriptionId, newQuantity);
      setEditingQuantity(prev => {
        const updated = { ...prev };
        delete updated[subscriptionId];
        return updated;
      });
    }
  };

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Aucun abonnement actif
        </h3>
        <p className="text-gray-600">
          Vous n'avez pas encore d'abonnement. Découvrez nos produits et créez votre premier abonnement !
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Mes abonnements ({subscriptions.length})
        </h2>
      </div>

      <div className="space-y-4">
        {subscriptions.map((subscription) => {
          const isExpanded = expandedSubscription === subscription.id;
          const isEditingQuantity = editingQuantity.hasOwnProperty(subscription.id);
          
          return (
            <div
              key={subscription.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {subscription.plan?.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {subscription.plan?.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
                      {getStatusText(subscription.status)}
                    </span>
                    <button
                      onClick={() => setExpandedSubscription(isExpanded ? null : subscription.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {isExpanded ? '▼' : '▶'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600">Prix</div>
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(subscription.plan?.priceCents || 0)}
                    </div>
                    <div className="text-xs text-gray-500">
                      par {formatInterval(subscription.plan?.interval || 'monthly', subscription.plan?.intervalCount || 1)}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600">Quantité</div>
                    {isEditingQuantity ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={editingQuantity[subscription.id] || subscription.quantity}
                          onChange={(e) => handleQuantityChange(subscription.id, parseInt(e.target.value))}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <button
                          onClick={() => handleQuantitySave(subscription.id)}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setEditingQuantity(prev => {
                            const updated = { ...prev };
                            delete updated[subscription.id];
                            return updated;
                          })}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="font-semibold text-gray-900">
                          {subscription.quantity}
                        </div>
                        <button
                          onClick={() => setEditingQuantity(prev => ({
                            ...prev,
                            [subscription.id]: subscription.quantity
                          }))}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Modifier
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600">Prochaine livraison</div>
                    <div className="font-semibold text-gray-900">
                      {subscription.nextBillingDate?.toLocaleDateString('fr-FR') || 'N/A'}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-200 pt-4 space-y-4">
                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {subscription.canPause && subscription.status === 'active' && (
                        <button
                          onClick={() => onPauseSubscription(subscription.id)}
                          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          Mettre en pause
                        </button>
                      )}
                      
                      {subscription.canResume && subscription.status === 'paused' && (
                        <button
                          onClick={() => onResumeSubscription(subscription.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Reprendre
                        </button>
                      )}
                      
                      {subscription.canCancel && subscription.status === 'active' && (
                        <button
                          onClick={() => onCancelSubscription(subscription.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Annuler
                        </button>
                      )}
                    </div>

                    {/* Historique des livraisons */}
                    {subscription.deliveries && subscription.deliveries.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Historique des livraisons</h4>
                        <div className="space-y-2">
                          {subscription.deliveries.map((delivery) => (
                            <div
                              key={delivery.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <div className="font-medium text-gray-900">
                                  Livraison du {delivery.scheduledDate.toLocaleDateString('fr-FR')}
                                </div>
                                {delivery.deliveredDate && (
                                  <div className="text-sm text-gray-600">
                                    Livrée le {delivery.deliveredDate.toLocaleDateString('fr-FR')}
                                  </div>
                                )}
                                {delivery.trackingNumber && (
                                  <div className="text-sm text-blue-600">
                                    Suivi: {delivery.trackingNumber}
                                  </div>
                                )}
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDeliveryStatusColor(delivery.status)}`}>
                                {getDeliveryStatusText(delivery.status)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
