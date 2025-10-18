'use client'

import { useEffect } from 'react'
import { useNotifications } from '@/contexts/NotificationContext'

interface CartClearedNotificationProps {
  showNotification?: boolean
}

export function CartClearedNotification({ showNotification = true }: CartClearedNotificationProps) {
  const { addNotification } = useNotifications()

  useEffect(() => {
    if (showNotification) {
      addNotification({
        type: 'success',
        title: 'Panier vidé',
        message: 'Votre panier a été vidé après le paiement réussi',
        duration: 5000
      })
    }
  }, [showNotification, addNotification])

  return null
}

