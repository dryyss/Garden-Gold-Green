'use client'

import { useUser } from '@auth0/nextjs-auth0/client'

export function useAuth0() {
  const { user, error, isLoading } = useUser()

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login: () => {
      window.location.href = '/api/auth/login'
    },
    logout: () => {
      window.location.href = '/api/auth/logout'
    },
  }
}
