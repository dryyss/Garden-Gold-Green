'use client'

import { useEffect, useState } from 'react'

interface Confetti {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  size: number
  velocityX: number
  velocityY: number
}

interface ConfettiAnimationProps {
  isActive: boolean
  onComplete: () => void
}

export function ConfettiAnimation({ isActive, onComplete }: ConfettiAnimationProps) {
  const [confetti, setConfetti] = useState<Confetti[]>([])
  const colors = ['#FFD700', '#00C853', '#FFFFFF', '#FFC107']

  useEffect(() => {
    if (!isActive || typeof window === 'undefined' || !window.innerWidth || !window.innerHeight) return

    // Position fixe pour les confettis (centre de l'écran)
    const position = { 
      x: window.innerWidth / 2, 
      y: window.innerHeight / 2 
    }

    // Créer les confettis
    const newConfetti: Confetti[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: position.x,
      y: position.y,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      velocityX: (Math.random() - 0.5) * 10,
      velocityY: (Math.random() - 0.5) * 10 - 5,
    }))

    setConfetti(newConfetti)

    // Nettoyer après l'animation
    const timer = setTimeout(() => {
      setConfetti([])
      onComplete()
    }, 1500)

    return () => clearTimeout(timer)
  }, [isActive, onComplete, colors])

  if (confetti.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.x}px`,
            top: `${piece.y}px`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            animation: `confetti-fall 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
            '--velocity-x': `${piece.velocityX}px`,
            '--velocity-y': `${piece.velocityY}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

