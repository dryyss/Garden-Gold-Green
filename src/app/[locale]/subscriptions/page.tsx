'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import SubscriptionManager from '@/components/SubscriptionManager';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Notification } from '@/components/Notification';

export default function SubscriptionsPage() {
  const { user, isLoading: authLoading } = useUser();
  const {
    subscriptions,
    loadingSubscriptions,
    errorSubscriptions,
    fetchSubscriptions,
    pauseSubscription,
    cancelSubscription,
    resumeSubscription,
    updateSubscriptionQuantity,
    loadingAction,
    actionError
  } = useSubscriptions();

  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (user?.sub) {
      fetchSubscriptions(user.sub);
    }
  }, [user?.sub, fetchSubscriptions]);

  const handlePauseSubscription = async (subscriptionId: string) => {
    try {
      await pauseSubscription(subscriptionId);
      setNotification({
        type: 'success',
        message: 'Abonnement mis en pause avec succès'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Erreur lors de la mise en pause de l\'abonnement'
      });
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      await cancelSubscription(subscriptionId);
      setNotification({
        type: 'success',
        message: 'Abonnement annulé avec succès'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Erreur lors de l\'annulation de l\'abonnement'
      });
    }
  };

  const handleResumeSubscription = async (subscriptionId: string) => {
    try {
      await resumeSubscription(subscriptionId);
      setNotification({
        type: 'success',
        message: 'Abonnement repris avec succès'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Erreur lors de la reprise de l\'abonnement'
      });
    }
  };

  const handleUpdateQuantity = async (subscriptionId: string, quantity: number) => {
    try {
      await updateSubscriptionQuantity(subscriptionId, quantity);
      setNotification({
        type: 'success',
        message: 'Quantité mise à jour avec succès'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Erreur lors de la mise à jour de la quantité'
      });
    }
  };

  if (authLoading || loadingSubscriptions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Connexion requise
          </h1>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour accéder à vos abonnements.
          </p>
          <a
            href="/auth/login"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  if (errorSubscriptions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Erreur
          </h1>
          <p className="text-gray-600 mb-6">
            {errorSubscriptions}
          </p>
          <button
            onClick={() => fetchSubscriptions(user.sub!)}
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Mes abonnements
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez vos abonnements et vos livraisons automatiques
          </p>
        </div>

        {/* Statistiques rapides */}
        {subscriptions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-green-600 text-2xl mr-3">📦</div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {subscriptions.length}
                  </div>
                  <div className="text-gray-600">Abonnements actifs</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-blue-600 text-2xl mr-3">💰</div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {subscriptions.reduce((total, sub) => {
                      return total + (sub.plan?.priceCents || 0) * sub.quantity;
                    }, 0) / 100}€
                  </div>
                  <div className="text-gray-600">Total mensuel</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-purple-600 text-2xl mr-3">🚚</div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {subscriptions.filter(sub => sub.status === 'active').length}
                  </div>
                  <div className="text-gray-600">Livraisons programmées</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gestionnaire d'abonnements */}
        <SubscriptionManager
          subscriptions={subscriptions}
          onPauseSubscription={handlePauseSubscription}
          onCancelSubscription={handleCancelSubscription}
          onResumeSubscription={handleResumeSubscription}
          onUpdateQuantity={handleUpdateQuantity}
        />

        {/* Bouton pour découvrir les produits */}
        {subscriptions.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow p-8 max-w-md mx-auto">
              <div className="text-gray-400 text-6xl mb-4">🛍️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Découvrez nos abonnements
              </h3>
              <p className="text-gray-600 mb-6">
                Économisez avec nos packs d'abonnement et recevez vos produits CBD préférés automatiquement.
              </p>
              <a
                href="/products"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Voir les produits
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Notifications */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
          className="fixed top-4 right-4 z-50"
        />
      )}

      {/* Overlay de chargement pour les actions */}
      {loadingAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <LoadingSpinner size="medium" />
            <p className="mt-4 text-gray-600">Traitement en cours...</p>
          </div>
        </div>
      )}
    </div>
  );
}
