'use client'

import { ReactNode } from 'react'

// Auth0 v4 n'a pas besoin de provider spécifique côté client
// Le hook useUser() fonctionne directement
export function Auth0Provider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

