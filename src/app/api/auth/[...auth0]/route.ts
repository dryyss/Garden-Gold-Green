import { handleAuth, handleLogin, handleLogout, handleCallback } from '@auth0/nextjs-auth0'

export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      prompt: 'login',
    },
  }),
  logout: handleLogout({
    returnTo: process.env.AUTH0_BASE_URL,
  }),
  callback: handleCallback({
    afterCallback: async (req, res, session) => {
      // Ici on peut ajouter de la logique après la connexion
      // Par exemple, synchroniser l'utilisateur avec notre base de données
      return session
    },
  }),
})
