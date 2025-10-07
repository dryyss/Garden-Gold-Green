'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, AlertTriangle } from 'lucide-react'

interface AgeGateModalProps {
  minAge?: number
  onConfirm: () => void
}

export function AgeGateModal({ minAge = 18, onConfirm }: AgeGateModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà confirmé son âge
    const hasConfirmedAge = localStorage.getItem('age-confirmed')
    if (!hasConfirmedAge) {
      setIsVisible(true)
    }
  }, [])

  const handleConfirm = () => {
    localStorage.setItem('age-confirmed', 'true')
    setIsVisible(false)
    onConfirm()
  }

  const handleDecline = () => {
    // Rediriger vers un site approprié pour les mineurs
    window.location.href = 'https://www.google.com'
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center age-gate-overlay p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Vérification d&apos;âge
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6 text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Avertissement</span>
            </div>
            
            <p className="text-gray-600">
              Ce site vend des produits contenant du CBD. Vous devez avoir au moins{' '}
              <span className="font-semibold text-primary">{minAge} ans</span> pour accéder à ce site.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
              <p className="font-medium mb-2">Important :</p>
              <ul className="text-left space-y-1">
                <li>• Les produits CBD ne sont pas des médicaments</li>
                <li>• Consultez votre médecin avant utilisation</li>
                <li>• Ne pas utiliser pendant la grossesse</li>
                <li>• Respectez la législation locale</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleConfirm}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3"
            >
              J&apos;ai plus de {minAge} ans
            </Button>
            
            <Button 
              onClick={handleDecline}
              variant="outline"
              className="w-full"
            >
              J&apos;ai moins de {minAge} ans
            </Button>
          </div>

          <p className="text-xs text-gray-500">
            En continuant, vous acceptez nos{' '}
            <a href="/terms" className="text-primary hover:underline">
              conditions d&apos;utilisation
            </a>{' '}
            et notre{' '}
            <a href="/privacy" className="text-primary hover:underline">
              politique de confidentialité
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
