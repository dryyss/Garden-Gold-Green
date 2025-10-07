'use client'

import { useEffect, useState } from 'react'

interface Confetti {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
}

interface ConfettiAnimationProps {
  isActive: boolean
  onComplete?: () => void
}

const colors = [
  '#FFD700', // Gold
  '#00C853', // Green
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Mint
  '#FFEAA7', // Yellow
  '#DDA0DD'  // Plum
]

export function ConfettiAnimation({ isActive, onComplete }: ConfettiAnimationProps) {
  const [confetti, setConfetti] = useState<Confetti[]>([])

  useEffect(() => {
    if (!isActive) return

    // Créer des confettis
    const newConfetti: Confetti[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -10,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10
    }))

    setConfetti(newConfetti)

    // Animation des confettis
    const interval = setInterval(() => {
      setConfetti(prev => {
        const updated = prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          rotation: particle.rotation + particle.rotationSpeed,
          vy: particle.vy + 0.1 // Gravité
        })).filter(particle => particle.y < window.innerHeight + 50)

        if (updated.length === 0) {
          clearInterval(interval)
          onComplete?.()
        }

        return updated
      })
    }, 16) // 60 FPS

    return () => clearInterval(interval)
  }, [isActive, onComplete])

  if (!isActive || confetti.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confetti.map(particle => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%'
          }}
        />
      ))}
    </div>
  )
}

import { useEffect, useState } from 'react'

interface Confetti {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
}

interface ConfettiAnimationProps {
  isActive: boolean
  onComplete?: () => void
}

const colors = [
  '#FFD700', // Gold
  '#00C853', // Green
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Mint
  '#FFEAA7', // Yellow
  '#DDA0DD'  // Plum
]

export function ConfettiAnimation({ isActive, onComplete }: ConfettiAnimationProps) {
  const [confetti, setConfetti] = useState<Confetti[]>([])

  useEffect(() => {
    if (!isActive) return

    // Créer des confettis
    const newConfetti: Confetti[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -10,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10
    }))

    setConfetti(newConfetti)

    // Animation des confettis
    const interval = setInterval(() => {
      setConfetti(prev => {
        const updated = prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          rotation: particle.rotation + particle.rotationSpeed,
          vy: particle.vy + 0.1 // Gravité
        })).filter(particle => particle.y < window.innerHeight + 50)

        if (updated.length === 0) {
          clearInterval(interval)
          onComplete?.()
        }

        return updated
      })
    }, 16) // 60 FPS

    return () => clearInterval(interval)
  }, [isActive, onComplete])

  if (!isActive || confetti.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confetti.map(particle => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%'
          }}
        />
      ))}
    </div>
  )
}
