# 🔧 Configuration Clever Cloud

## Problème identifié

L'erreur suivante apparaît lors du déploiement :
```
[Error: Could not find a production build in the '.next' directory. 
Try building your app with 'next build' before starting the production server.
```

## Solution

### Option 1 : Configuration dans le Dashboard Clever Cloud

1. **Aller dans votre application Clever Cloud**
2. **Settings** → **Build & Deploy**
3. **Build command** : `npm run build`
4. **Start command** : `npm start`

### Option 2 : Fichier clevercloud.json (déjà créé)

Le fichier `clevercloud.json` a été créé avec :
```json
{
  "build": {
    "type": "nodejs",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm start"
  },
  "requirements": {
    "node": "20.x"
  }
}
```

### Option 3 : Variables d'environnement dans Clever Cloud

Assurez-vous d'avoir configuré toutes les variables d'environnement dans le dashboard Clever Cloud :

**Variables OBLIGATOIRES :**
- `DATABASE_URL` - URL PostgreSQL
- `AUTH0_SECRET` - Secret généré avec `openssl rand -hex 32`
- `AUTH0_BASE_URL` - `https://votre-domaine.cleverapps.io`
- `AUTH0_ISSUER_BASE_URL` - `https://dev-1tkaqeynik4yy714.us.auth0.com`
- `AUTH0_CLIENT_ID` - Votre Client ID
- `AUTH0_CLIENT_SECRET` - Votre Client Secret
- `NEXT_PUBLIC_APP_URL` - `https://votre-domaine.cleverapps.io`
- `NODE_ENV` - `production`

**Variables OPTIONNELLES :**
- `STRIPE_*` - Si vous utilisez Stripe
- `SENDGRID_API_KEY` - Si vous utilisez SendGrid

## ⚠️ Important pour Clever Cloud

1. **Prisma Migrations** : Clever Cloud doit exécuter les migrations avant le build
   - Ajoutez dans le dashboard : **Build command** : `npx prisma generate && npx prisma migrate deploy && npm run build`

2. **Port** : Clever Cloud utilise la variable `PORT` automatiquement
   - Next.js détecte automatiquement `PORT` en production

3. **Base de données** : Créez une base PostgreSQL dans Clever Cloud
   - La variable `DATABASE_URL` sera injectée automatiquement

## 🔄 Après le déploiement

1. Vérifiez les logs : `clever logs`
2. Vérifiez que l'application répond
3. Testez l'authentification Auth0
4. Vérifiez les migrations Prisma

