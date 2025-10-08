'use client'

import { useEffect } from 'react'
import { useAuth0 } from '@/hooks/useAuth0'
import { useNotifications } from '@/contexts/NotificationContext'

export function useAuthNotifications() {
  const { user, isAuthenticated } = useAuth0()
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
    if (isAuthenticated && user) {
      // Vérifier si c'est une nouvelle connexion (pas de chargement initial)
      const isNewLogin = !authState.isLoading && user
      if (isNewLogin) {
        addNotification({
          type: 'success',
          title: 'Connexion réussie',
          message: `Bienvenue ${user.firstName} !`
        })
      }
    }
  }, [isAuthenticated, user, authState.isLoading, addNotification])

  return {
    addAuthNotification: addNotification
  }
}
