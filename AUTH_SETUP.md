# Configuration de l'authentification

## Variables d'environnement requises

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# Database
DATABASE_URL="file:./dev.db"

# Auth0 Configuration
AUTH0_SECRET="your-auth0-secret-here"
AUTH0_BASE_URL="http://localhost:3000"
AUTH0_ISSUER_BASE_URL="https://your-domain.auth0.com"
AUTH0_CLIENT_ID="your-auth0-client-id"
AUTH0_CLIENT_SECRET="your-auth0-client-secret"

# Apple Sign In
APPLE_CLIENT_ID="your-apple-client-id"
APPLE_CLIENT_SECRET="your-apple-client-secret"
APPLE_REDIRECT_URI="http://localhost:3000/api/auth/apple/callback"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"

# Facebook Login
FACEBOOK_APP_ID="your-facebook-app-id"
FACEBOOK_APP_SECRET="your-facebook-app-secret"
FACEBOOK_REDIRECT_URI="http://localhost:3000/api/auth/facebook/callback"

# Stripe
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
```

## Configuration des providers

### 1. Apple Sign In
1. Allez sur [Apple Developer Console](https://developer.apple.com/account/)
2. Créez un App ID avec Sign In with Apple activé
3. Créez un Service ID
4. Configurez les domaines et URLs de redirection
5. Téléchargez la clé privée et générez le client secret

### 2. Google OAuth
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google+ et l'API People
4. Créez des identifiants OAuth 2.0
5. Configurez les URLs de redirection autorisées

### 3. Facebook Login
1. Allez sur [Facebook Developers](https://developers.facebook.com/)
2. Créez une nouvelle application
3. Ajoutez le produit Facebook Login
4. Configurez les URLs de redirection OAuth valides
5. Obtenez l'App ID et l'App Secret

### 4. Auth0
1. Créez un compte sur [Auth0](https://auth0.com/)
2. Créez une nouvelle application
3. Configurez les URLs de callback
4. Activez les connexions sociales (Apple, Google, Facebook)
5. Obtenez les identifiants de l'application

## URLs de callback à configurer

- Apple: `http://localhost:3000/api/auth/apple/callback`
- Google: `http://localhost:3000/api/auth/google/callback`
- Facebook: `http://localhost:3000/api/auth/facebook/callback`
- Auth0: `http://localhost:3000/api/auth/callback`

## Test de l'authentification

1. Démarrez le serveur de développement : `npm run dev`
2. Allez sur `http://localhost:3000/auth`
3. Testez chaque option de connexion
4. Vérifiez que les redirections fonctionnent correctement

## Variables d'environnement requises

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# Database
DATABASE_URL="file:./dev.db"

# Auth0 Configuration
AUTH0_SECRET="your-auth0-secret-here"
AUTH0_BASE_URL="http://localhost:3000"
AUTH0_ISSUER_BASE_URL="https://your-domain.auth0.com"
AUTH0_CLIENT_ID="your-auth0-client-id"
AUTH0_CLIENT_SECRET="your-auth0-client-secret"

# Apple Sign In
APPLE_CLIENT_ID="your-apple-client-id"
APPLE_CLIENT_SECRET="your-apple-client-secret"
APPLE_REDIRECT_URI="http://localhost:3000/api/auth/apple/callback"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"

# Facebook Login
FACEBOOK_APP_ID="your-facebook-app-id"
FACEBOOK_APP_SECRET="your-facebook-app-secret"
FACEBOOK_REDIRECT_URI="http://localhost:3000/api/auth/facebook/callback"

# Stripe
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
```

## Configuration des providers

### 1. Apple Sign In
1. Allez sur [Apple Developer Console](https://developer.apple.com/account/)
2. Créez un App ID avec Sign In with Apple activé
3. Créez un Service ID
4. Configurez les domaines et URLs de redirection
5. Téléchargez la clé privée et générez le client secret

### 2. Google OAuth
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google+ et l'API People
4. Créez des identifiants OAuth 2.0
5. Configurez les URLs de redirection autorisées

### 3. Facebook Login
1. Allez sur [Facebook Developers](https://developers.facebook.com/)
2. Créez une nouvelle application
3. Ajoutez le produit Facebook Login
4. Configurez les URLs de redirection OAuth valides
5. Obtenez l'App ID et l'App Secret

### 4. Auth0
1. Créez un compte sur [Auth0](https://auth0.com/)
2. Créez une nouvelle application
3. Configurez les URLs de callback
4. Activez les connexions sociales (Apple, Google, Facebook)
5. Obtenez les identifiants de l'application

## URLs de callback à configurer

- Apple: `http://localhost:3000/api/auth/apple/callback`
- Google: `http://localhost:3000/api/auth/google/callback`
- Facebook: `http://localhost:3000/api/auth/facebook/callback`
- Auth0: `http://localhost:3000/api/auth/callback`

## Test de l'authentification

1. Démarrez le serveur de développement : `npm run dev`
2. Allez sur `http://localhost:3000/auth`
3. Testez chaque option de connexion
4. Vérifiez que les redirections fonctionnent correctement
