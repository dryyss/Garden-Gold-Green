'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { cn } from '@/lib/utils'

interface IconProps {
  icon: IconDefinition
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'responsive-sm' | 'responsive-md' | 'responsive-lg'
  className?: string
  color?: 'gold' | 'green' | 'silver' | 'white' | 'gray' | 'default'
}

const sizeClasses = {
  xs: 'icon-xs',
  sm: 'icon-sm',
  md: 'icon-md',
  lg: 'icon-lg',
  xl: 'icon-xl',
  '2xl': 'icon-2xl',
  'responsive-sm': 'icon-responsive-sm',
  'responsive-md': 'icon-responsive-md',
  'responsive-lg': 'icon-responsive-lg'
}

const colorClasses = {
  gold: 'text-brand-gold',
  green: 'text-brand-green',
  silver: 'text-brand-silver',
  white: 'text-white',
  gray: 'text-gray-400',
  default: ''
}

export function Icon({ 
  icon, 
  size = 'md', 
  className = '', 
  color = 'default' 
}: IconProps) {
  return (
    <FontAwesomeIcon 
      icon={icon} 
      className={cn(
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  )
}
