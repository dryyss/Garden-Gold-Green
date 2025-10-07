'use client'

import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCheckCircle, 
  faExclamationCircle, 
  faInfoCircle, 
  faTimes,
  faXmark
} from '@fortawesome/free-solid-svg-icons'

interface NotificationProps {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

const notificationConfig = {
  success: {
    icon: faCheckCircle,
    bgColor: 'bg-green-900/20',
    borderColor: 'border-green-500/30',
    textColor: 'text-green-400',
    iconColor: 'text-green-400'
  },
  error: {
    icon: faExclamationCircle,
    bgColor: 'bg-red-900/20',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-400',
    iconColor: 'text-red-400'
  },
  info: {
    icon: faInfoCircle,
    bgColor: 'bg-blue-900/20',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    iconColor: 'text-blue-400'
  },
  warning: {
    icon: faExclamationCircle,
    bgColor: 'bg-yellow-900/20',
    borderColor: 'border-yellow-500/30',
    textColor: 'text-yellow-400',
    iconColor: 'text-yellow-400'
  }
}

export function Notification({ 
  id, 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose 
}: NotificationProps) {
  const config = notificationConfig[type]

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [id, duration, onClose])

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 shadow-lg backdrop-blur-sm`}>
      <div className="flex items-start">
        <FontAwesomeIcon 
          icon={config.icon} 
          className={`${config.iconColor} text-lg mr-3 mt-0.5 flex-shrink-0`} 
        />
        <div className="flex-1 min-w-0">
          <h4 className={`${config.textColor} font-semibold text-sm`}>
            {title}
          </h4>
          {message && (
            <p className="text-gray-300 text-sm mt-1">
              {message}
            </p>
          )}
        </div>
        <button
          onClick={() => onClose(id)}
          className="text-gray-400 hover:text-white transition-colors ml-2 flex-shrink-0"
        >
          <FontAwesomeIcon icon={faXmark} className="text-sm" />
        </button>
      </div>
    </div>
  )
}
