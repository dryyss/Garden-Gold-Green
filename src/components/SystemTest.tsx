'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useNotifications } from '@/contexts/NotificationContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'

export function SystemTest() {
  const [isOpen, setIsOpen] = useState(false)
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})
  const [isRunningTests, setIsRunningTests] = useState(false)
  const { state: authState, login, logout } = useAuth()
  const { state: cartState, dispatch: cartDispatch } = useCart()
  const { addNotification } = useNotifications()

  const runTests = async () => {
    if (isRunningTests) return // Prevent multiple simultaneous tests
    
    setIsRunningTests(true)
    const results: Record<string, boolean> = {}

    try {
      // Test 1: Authentication
      try {
        if (!authState.isAuthenticated) {
          await login('test@example.com', 'password123')
          await new Promise(resolve => setTimeout(resolve, 500)) // Wait for state update
        }
        results.auth = authState.isAuthenticated
      } catch (error) {
        results.auth = false
      }

      // Test 2: Cart functionality
      try {
        cartDispatch({
          type: 'ADD_ITEM',
          payload: {
            id: 'test-item',
            name: 'Test Product',
            price: 10.00,
            image: '/logo.png'
          }
        })
        await new Promise(resolve => setTimeout(resolve, 300)) // Wait for state update
        results.cart = true
      } catch (error) {
        results.cart = false
      }

      // Test 3: Notifications
      try {
        addNotification({
          type: 'success',
          title: 'Test Notification',
          message: 'This is a test notification'
        })
        results.notifications = true
      } catch (error) {
        results.notifications = false
      }

      setTestResults(results)
    } finally {
      setIsRunningTests(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-brand-gold text-black p-3 rounded-full shadow-lg hover:bg-brand-green transition-colors z-50"
        title="Test du système"
      >
        <FontAwesomeIcon icon={faCog} className="text-lg" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-brand-black border border-white/10 rounded-xl p-4 shadow-2xl z-50 w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Test du système</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Authentification</span>
          {testResults.auth ? (
            <FontAwesomeIcon icon={faCheck} className="text-green-400" />
          ) : (
            <FontAwesomeIcon icon={faTimes} className="text-red-400" />
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Panier</span>
          {testResults.cart ? (
            <FontAwesomeIcon icon={faCheck} className="text-green-400" />
          ) : (
            <FontAwesomeIcon icon={faTimes} className="text-red-400" />
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Notifications</span>
          {testResults.notifications ? (
            <FontAwesomeIcon icon={faCheck} className="text-green-400" />
          ) : (
            <FontAwesomeIcon icon={faTimes} className="text-red-400" />
          )}
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={runTests}
          disabled={isRunningTests}
          className={`btn-gold text-black font-bold py-2 px-4 rounded-full text-sm flex-1 ${
            isRunningTests ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isRunningTests ? 'Tests en cours...' : 'Lancer les tests'}
        </button>
        <button
          onClick={async () => {
            try {
              if (authState.isAuthenticated) {
                await logout()
              } else {
                await login('test@example.com', 'password123')
              }
            } catch (error) {
              console.error('Auth error:', error)
            }
          }}
          className="bg-white/10 text-gray-300 hover:bg-white/20 font-bold py-2 px-4 rounded-full text-sm"
        >
          {authState.isAuthenticated ? 'Déconnexion' : 'Connexion'}
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <p>État: {authState.isAuthenticated ? 'Connecté' : 'Déconnecté'}</p>
        <p>Articles: {cartState.totalItems}</p>
      </div>
    </div>
  )
}
