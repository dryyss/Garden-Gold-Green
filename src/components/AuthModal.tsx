'use client'

import { useState } from 'react'
import { LoginModal } from './LoginModal'
import { RegisterModal } from './RegisterModal'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true)

  const handleSwitchToRegister = () => {
    setIsLoginMode(false)
  }

  const handleSwitchToLogin = () => {
    setIsLoginMode(true)
  }

  const handleClose = () => {
    setIsLoginMode(true) // Reset to login mode when closing
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {isLoginMode ? (
        <LoginModal
          isOpen={isOpen}
          onClose={handleClose}
          onSwitchToRegister={handleSwitchToRegister}
        />
      ) : (
        <RegisterModal
          isOpen={isOpen}
          onClose={handleClose}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
    </>
  )
}