'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  SubscriptionPlanWithDetails, 
  SubscriptionWithDetails,
  CreateSubscriptionData,
  UpdateSubscriptionData 
} from '@/types/subscription';

interface UseSubscriptionsReturn {
  // Plans d'abonnement
  plans: SubscriptionPlanWithDetails[];
  loadingPlans: boolean;
  errorPlans: string | null;
  fetchPlans: (productId: string) => Promise<void>;
  
  // Abonnements utilisateur
  subscriptions: SubscriptionWithDetails[];
  loadingSubscriptions: boolean;
  errorSubscriptions: string | null;
  fetchSubscriptions: (userId: string) => Promise<void>;
  
  // Actions
  createSubscription: (data: CreateSubscriptionData) => Promise<SubscriptionWithDetails>;
  pauseSubscription: (subscriptionId: string) => Promise<void>;
  cancelSubscription: (subscriptionId: string) => Promise<void>;
  resumeSubscription: (subscriptionId: string) => Promise<void>;
  updateSubscriptionQuantity: (subscriptionId: string, quantity: number) => Promise<void>;
  
  // État des actions
  loadingAction: boolean;
  actionError: string | null;
}

export function useSubscriptions(): UseSubscriptionsReturn {
  // État pour les plans
  const [plans, setPlans] = useState<SubscriptionPlanWithDetails[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [errorPlans, setErrorPlans] = useState<string | null>(null);

  // État pour les abonnements
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithDetails[]>([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);
  const [errorSubscriptions, setErrorSubscriptions] = useState<string | null>(null);

  // État pour les actions
  const [loadingAction, setLoadingAction] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Récupérer les plans d'abonnement
  const fetchPlans = useCallback(async (productId: string) => {
    setLoadingPlans(true);
    setErrorPlans(null);

    try {
      const response = await fetch(`/api/subscriptions/plans?productId=${productId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la récupération des plans');
      }

      setPlans(data.data);
    } catch (error) {
      setErrorPlans(error instanceof Error ? error.message : 'Erreur inconnue');
      console.error('Erreur fetchPlans:', error);
    } finally {
      setLoadingPlans(false);
    }
  }, []);

  // Récupérer les abonnements de l'utilisateur
  const fetchSubscriptions = useCallback(async (userId: string) => {
    setLoadingSubscriptions(true);
    setErrorSubscriptions(null);

    try {
      const response = await fetch(`/api/subscriptions?userId=${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la récupération des abonnements');
      }

      setSubscriptions(data.data);
    } catch (error) {
      setErrorSubscriptions(error instanceof Error ? error.message : 'Erreur inconnue');
      console.error('Erreur fetchSubscriptions:', error);
    } finally {
      setLoadingSubscriptions(false);
    }
  }, []);

  // Créer un nouvel abonnement
  const createSubscription = useCallback(async (data: CreateSubscriptionData): Promise<SubscriptionWithDetails> => {
    setLoadingAction(true);
    setActionError(null);

    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la création de l\'abonnement');
      }

      // Ajouter le nouvel abonnement à la liste
      setSubscriptions(prev => [result.data, ...prev]);

      return result.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setActionError(errorMessage);
      console.error('Erreur createSubscription:', error);
      throw error;
    } finally {
      setLoadingAction(false);
    }
  }, []);

  // Mettre en pause un abonnement
  const pauseSubscription = useCallback(async (subscriptionId: string) => {
    setLoadingAction(true);
    setActionError(null);

    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'paused' }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la mise en pause');
      }

      // Mettre à jour l'abonnement dans la liste
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId 
            ? { ...sub, status: 'paused', pausedAt: new Date(), canPause: false, canResume: true }
            : sub
        )
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setActionError(errorMessage);
      console.error('Erreur pauseSubscription:', error);
      throw error;
    } finally {
      setLoadingAction(false);
    }
  }, []);

  // Annuler un abonnement
  const cancelSubscription = useCallback(async (subscriptionId: string) => {
    setLoadingAction(true);
    setActionError(null);

    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de l\'annulation');
      }

      // Mettre à jour l'abonnement dans la liste
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId 
            ? { ...sub, status: 'cancelled', cancelledAt: new Date(), canCancel: false, canPause: false }
            : sub
        )
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setActionError(errorMessage);
      console.error('Erreur cancelSubscription:', error);
      throw error;
    } finally {
      setLoadingAction(false);
    }
  }, []);

  // Reprendre un abonnement
  const resumeSubscription = useCallback(async (subscriptionId: string) => {
    setLoadingAction(true);
    setActionError(null);

    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'active' }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la reprise');
      }

      // Mettre à jour l'abonnement dans la liste
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId 
            ? { ...sub, status: 'active', pausedAt: undefined, canPause: true, canResume: false }
            : sub
        )
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setActionError(errorMessage);
      console.error('Erreur resumeSubscription:', error);
      throw error;
    } finally {
      setLoadingAction(false);
    }
  }, []);

  // Mettre à jour la quantité d'un abonnement
  const updateSubscriptionQuantity = useCallback(async (subscriptionId: string, quantity: number) => {
    setLoadingAction(true);
    setActionError(null);

    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la mise à jour');
      }

      // Mettre à jour l'abonnement dans la liste
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId 
            ? { ...sub, quantity }
            : sub
        )
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setActionError(errorMessage);
      console.error('Erreur updateSubscriptionQuantity:', error);
      throw error;
    } finally {
      setLoadingAction(false);
    }
  }, []);

  return {
    // Plans d'abonnement
    plans,
    loadingPlans,
    errorPlans,
    fetchPlans,
    
    // Abonnements utilisateur
    subscriptions,
    loadingSubscriptions,
    errorSubscriptions,
    fetchSubscriptions,
    
    // Actions
    createSubscription,
    pauseSubscription,
    cancelSubscription,
    resumeSubscription,
    updateSubscriptionQuantity,
    
    // État des actions
    loadingAction,
    actionError,
  };
}
