'use client'

import { useOrderNotifications } from '@/hooks/useOrderNotifications'
import { useUser } from '@auth0/nextjs-auth0'

export function OrderNotificationHandler() {
  const { user } = useUser()
  
  // Activer les notifications de commandes seulement si l'utilisateur est connecté
  useOrderNotifications()

  return null
}
