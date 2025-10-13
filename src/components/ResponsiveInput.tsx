'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { cn } from '@/lib/utils'

interface ResponsiveInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: IconDefinition
  error?: string
  fullWidth?: boolean
}

export const ResponsiveInput = forwardRef<HTMLInputElement, ResponsiveInputProps>(
  ({ label, icon, error, fullWidth = true, className = '', ...props }, ref) => {
    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {label && (
          <label className="block text-gray-300 text-sm font-medium">
            {icon && <FontAwesomeIcon icon={icon} className="icon-sm mr-2" />}
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'input-field w-full',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
      </div>
    )
  }
)

ResponsiveInput.displayName = 'ResponsiveInput'





