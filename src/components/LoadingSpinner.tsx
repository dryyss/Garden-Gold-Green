'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  className?: string
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
  xl: 'text-4xl'
}

export function LoadingSpinner({ size = 'md', text, className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <FontAwesomeIcon 
        icon={faSpinner} 
        className={`animate-spin text-brand-gold ${sizeClasses[size]} mb-2`} 
      />
      {text && (
        <p className="text-gray-300 text-sm">{text}</p>
      )}
    </div>
  )
}
