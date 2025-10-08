import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge'

// Routes protégées qui nécessitent une authentification
const protectedRoutes = [
  '/account',
  '/profile',
  '/orders',
  '/favorites',
  '/admin'
]

export default withMiddlewareAuthRequired({
  returnTo: '/auth',
  
  // Matcher pour les routes protégées
  matcher: protectedRoutes.map(route => `${route}/:path*`)
})

export const config = {
  matcher: [
    '/account/:path*',
    '/profile/:path*', 
    '/orders/:path*',
    '/favorites/:path*',
    '/admin/:path*'
  ]
}

