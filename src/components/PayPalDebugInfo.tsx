'use client'

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faCheckCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons'

interface PayPalDebugInfoProps {
  className?: string
}

export function PayPalDebugInfo({ className = '' }: PayPalDebugInfoProps) {
  const [debugInfo, setDebugInfo] = useState<{
    hasClientId: boolean
    hasClientSecret: boolean
    hasAppUrl: boolean
    environment: string
    errors: string[]
  }>({
    hasClientId: false,
    hasClientSecret: false,
    hasAppUrl: false,
    environment: 'unknown',
    errors: []
  })

  useEffect(() => {
    const checkConfiguration = async () => {
      const errors: string[] = []
      
      try {
        // Vérifier la configuration PayPal
        const response = await fetch('/api/paypal/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: [{ id: 'test', name: 'Test', price: 1, quantity: 1, image: 'test.jpg' }]
          }),
        })

        const data = await response.json()
        
        if (response.status === 500 && data.error === 'Configuration PayPal manquante') {
          errors.push('Clés PayPal non configurées')
        } else if (response.status === 500) {
          errors.push(`Erreur PayPal: ${data.error}`)
        }
      } catch (error) {
        errors.push('Impossible de contacter l\'API PayPal')
      }

      setDebugInfo({
        hasClientId: true, // On suppose qu'elles existent si pas d'erreur de config
        hasClientSecret: true,
        hasAppUrl: true,
        environment: process.env.NODE_ENV || 'development',
        errors
      })
    }

    checkConfiguration()
  }, [])

  if (debugInfo.errors.length === 0) {
    return null // Pas d'erreurs, ne pas afficher
  }

  return (
    <div className={`bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <FontAwesomeIcon 
          icon={faExclamationTriangle} 
          className="text-yellow-400 mt-1 flex-shrink-0" 
        />
        <div className="flex-1">
          <h3 className="text-yellow-400 font-semibold mb-2">
            Configuration PayPal manquante
          </h3>
          
          <div className="space-y-2 text-sm text-yellow-200">
            <p>PayPal ne peut pas fonctionner sans configuration. Voici ce qui manque :</p>
            
            <ul className="list-disc list-inside space-y-1 ml-4">
              {debugInfo.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
            
            <div className="mt-3 p-3 bg-yellow-900/30 rounded border border-yellow-600/30">
              <p className="font-medium mb-2">🔧 Solution rapide :</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Créez un fichier <code className="bg-yellow-800 px-1 rounded">.env.local</code></li>
                <li>Ajoutez vos clés PayPal :</li>
                <li className="ml-4">
                  <code className="bg-yellow-800 px-1 rounded">PAYPAL_CLIENT_ID="votre-client-id"</code>
                </li>
                <li className="ml-4">
                  <code className="bg-yellow-800 px-1 rounded">PAYPAL_CLIENT_SECRET="votre-client-secret"</code>
                </li>
                <li>Redémarrez le serveur</li>
              </ol>
            </div>
            
            <div className="mt-2 text-xs">
              <p>📖 Consultez <code className="bg-yellow-800 px-1 rounded">CONFIGURATION_PAYPAL_URGENTE.md</code> pour plus de détails</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

