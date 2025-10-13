'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ResponsiveCardProps {
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'glass' | 'elevated'
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12'
}

const variantClasses = {
  default: 'bg-brand-black/50 border border-white/10',
  glass: 'bg-white/5 backdrop-blur-sm border border-white/10',
  elevated: 'bg-brand-black/70 border border-brand-gold/20 shadow-gold-glow'
}

export function ResponsiveCard({ 
  children, 
  className = '', 
  padding = 'md',
  variant = 'default'
}: ResponsiveCardProps) {
  return (
    <div className={cn(
      'rounded-xl transition-all duration-300',
      variantClasses[variant],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  )
}





