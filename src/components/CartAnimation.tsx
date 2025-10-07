'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
}

interface CartAnimationProps {
  isActive: boolean
  onComplete?: () => void
}

export function CartAnimation({ isActive, onComplete }: CartAnimationProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!isActive) return

    // Créer des particules
    const newParticles: Particle[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 50, // Centre du bouton
      y: 50,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4 - 2, // Légèrement vers le haut
      life: 1,
      maxLife: 1
    }))

    setParticles(newParticles)

    // Animation des particules
    const interval = setInterval(() => {
      setParticles(prev => {
        const updated = prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 0.02,
          vy: particle.vy + 0.1 // Gravité
        })).filter(particle => particle.life > 0)

        if (updated.length === 0) {
          clearInterval(interval)
          onComplete?.()
        }

        return updated
      })
    }, 16) // 60 FPS

    return () => clearInterval(interval)
  }, [isActive, onComplete])

  if (!isActive || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute text-brand-gold"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            transform: 'translate(-50%, -50%)',
            opacity: particle.life,
            fontSize: '12px'
          }}
        >
          <FontAwesomeIcon icon={faShoppingCart} />
        </div>
      ))}
    </div>
  )
}
