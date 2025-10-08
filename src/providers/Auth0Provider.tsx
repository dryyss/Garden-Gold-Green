'use client'

import { UserProvider } from '@auth0/nextjs-auth0'
import { ReactNode } from 'react'

export function Auth0Provider({ children }: { children: ReactNode }) {
  return <UserProvider>{children}</UserProvider>
}

