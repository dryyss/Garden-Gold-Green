# Configuration du Projet

## Variables d'environnement requises

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Database
DATABASE_URL="file:./dev.db"

# Auth0 (À configurer sur https://auth0.com)
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://your-tenant.auth0.com'
AUTH0_CLIENT_ID='your-client-id'
AUTH0_CLIENT_SECRET='your-client-secret'

# Stripe (À configurer sur https://stripe.com)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY='pk_test_...'
STRIPE_SECRET_KEY='sk_test_...'
STRIPE_WEBHOOK_SECRET='whsec_...'

# SendGrid (À configurer sur https://sendgrid.com)
SENDGRID_API_KEY='SG...'
FROM_EMAIL='noreply@gardengoldgreen.com'

# JWT Secret (pour compatibilité temporaire)
JWT_SECRET="your-jwt-secret-here"
```

## Configuration Auth0

1. Créer un compte sur https://auth0.com
2. Créer une nouvelle application "Regular Web Application"
3. Configurer les URLs autorisées :
   - Allowed Callback URLs: `http://localhost:3000/api/auth/callback`
   - Allowed Logout URLs: `http://localhost:3000`
4. Copier le Domain, Client ID et Client Secret

## Configuration Stripe

1. Créer un compte sur https://stripe.com
2. Accéder au Dashboard > Developers > API keys
3. Copier la Publishable key et Secret key
4. Pour le Webhook Secret :
   - Accéder à Developers > Webhooks
   - Créer un endpoint : `http://localhost:3000/api/payments/webhook`
   - Sélectionner les événements : `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copier le Signing secret

## Configuration SendGrid

1. Créer un compte sur https://sendgrid.com
2. Créer une API Key avec permissions "Mail Send"
3. Vérifier votre email d'expéditeur

## Installation

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```
