'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useNotifications } from '@/contexts/NotificationContext'

export function useAuthNotifications() {
  const { state: authState } = useAuth()
  const { addNotification } = useNotifications()

  // Gérer les notifications d'authentification
  useEffect(() => {
    if (authState.error) {
      addNotification({
        type: 'error',
        title: 'Erreur d\'authentification',
        message: authState.error
      })
    }
  }, [authState.error, addNotification])

  // Gérer les notifications de succès
  useEffect(() => {
    if (authState.isAuthenticated && authState.user && !authState.isLoading) {
      // Éviter les notifications au chargement initial
      const hasShownWelcome = sessionStorage.getItem('welcomeShown')
      if (!hasShownWelcome) {
        addNotification({
          type: 'success',
          title: 'Connexion réussie',
          message: `Bienvenue ${authState.user.firstName} !`
        })
        sessionStorage.setItem('welcomeShown', 'true')
      }
    }
  }, [authState.isAuthenticated, authState.user, authState.isLoading, addNotification])

  return {
    addAuthNotification: addNotification
  }
}
