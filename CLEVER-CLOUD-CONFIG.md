# 🔧 Configuration Clever Cloud

## Problème identifié

L'erreur suivante apparaît lors du déploiement :
```
[Error: Could not find a production build in the '.next' directory. 
Try building your app with 'next build' before starting the production server.
```

## ✅ Solution : Script automatique (IMPLÉMENTÉ)

**✅ SOLUTION AUTOMATIQUE :** Un script a été créé pour construire automatiquement l'application si le build n'existe pas au démarrage.

Le script `scripts/start-production.js` :
- Vérifie si le build de production existe (dossier `.next`)
- Si non, construit automatiquement l'application (Prisma + Migrations + Next.js build)
- Démarre ensuite l'application

**Le script `start` dans `package.json` utilise maintenant ce script automatique.**

### Option 1 : Configuration dans le Dashboard Clever Cloud (RECOMMANDÉ)

**⚠️ IMPORTANT :** Pour éviter de construire à chaque démarrage, configurez la commande de build dans le dashboard :

1. **Aller dans votre application Clever Cloud**
2. **Settings** → **Build & Deploy**
3. **Build command** : `npm run build:production`
   - Cette commande exécute : `npx prisma generate && npx prisma migrate deploy && next build`
4. **Start command** : `npm start`
5. **Cliquer sur "Save"**

**Avec cette configuration, le build sera créé avant le démarrage et le script ne reconstruira pas.**

### Option 2 : Utiliser uniquement le script automatique

Si vous ne configurez pas le build dans le dashboard, le script `start` construira automatiquement l'application au premier démarrage. Cela fonctionnera, mais le premier démarrage sera plus long.

### Étape 2 : Vérifier les variables d'environnement

Assurez-vous que toutes les variables d'environnement sont configurées dans le dashboard (elles sont automatiquement injectées si l'addon PostgreSQL est attaché).

### Option 2 : Fichier clevercloud.json (peut ne pas être détecté)

Le fichier `clevercloud.json` est présent avec la configuration suivante :
```json
{
  "build": {
    "type": "nodejs",
    "buildCommand": "npm run build:production"
  },
  "deploy": {
    "startCommand": "npm start"
  },
  "requirements": {
    "node": "20.x"
  }
}
```

**⚠️ Note :** Si Clever Cloud ne détecte pas ce fichier, utilisez l'Option 1 (Dashboard) qui est plus fiable.

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

1. **Prisma Migrations** : Les migrations sont exécutées automatiquement avec `npm run build:production`
   - Cette commande exécute : `npx prisma generate && npx prisma migrate deploy && next build`

2. **Port** : Clever Cloud utilise la variable `PORT` automatiquement
   - Next.js détecte automatiquement `PORT` en production
   - Le port par défaut est `8080` sur Clever Cloud

3. **Base de données** : L'addon PostgreSQL doit être attaché à votre application
   - Les variables `POSTGRESQL_ADDON_*` sont injectées automatiquement
   - La variable `DATABASE_URL` est également injectée automatiquement par Clever Cloud

## 🔄 Après le déploiement

1. Vérifiez les logs : `clever logs`
2. Vérifiez que l'application répond
3. Testez l'authentification Auth0
4. Vérifiez les migrations Prisma

