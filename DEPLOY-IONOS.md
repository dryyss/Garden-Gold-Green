# Guide de déploiement IONOS Deploy Now

## ⚠️ Important - Limitations

**IONOS Deploy Now ne supporte PAS le rendu côté serveur (SSR) de Next.js ni les routes API.**

Ce projet utilise :
- ✅ Routes API (`/api/*`)
- ✅ Server-Side Rendering (SSR)
- ✅ Prisma avec base de données
- ✅ Authentification Auth0 côté serveur

**Ces fonctionnalités ne fonctionneront PAS avec IONOS Deploy Now.**

## Alternatives recommandées

### 1. Vercel (Recommandé pour Next.js)
- ✅ Support complet Next.js (SSR, API routes)
- ✅ Déploiement automatique depuis GitHub
- ✅ Gratuit pour projets personnels
- ✅ Configuration Prisma automatique

**Étapes :**
1. Créer un compte sur [vercel.com](https://vercel.com)
2. Importer votre dépôt GitHub
3. Configurer les variables d'environnement
4. Déployer automatiquement

### 2. Railway
- ✅ Support Node.js complet
- ✅ Base de données PostgreSQL incluse
- ✅ Configuration simple

### 3. Render
- ✅ Support Next.js complet
- ✅ Plan gratuit disponible
- ✅ Base de données PostgreSQL

### 4. VPS IONOS (si vous voulez rester chez IONOS)
Si vous souhaitez absolument utiliser IONOS, vous pouvez :
1. Prendre un VPS IONOS
2. Installer Node.js
3. Configurer Nginx comme reverse proxy
4. Déployer manuellement

## Si vous voulez quand même essayer IONOS Deploy Now

### Prérequis
1. Votre projet doit être sur GitHub
2. Avoir un compte IONOS avec Deploy Now activé

### Étapes

1. **Connecter GitHub à IONOS Deploy Now**
   - Connectez-vous à votre compte IONOS
   - Allez dans Deploy Now
   - Autorisez l'accès à votre compte GitHub

2. **Créer un nouveau projet**
   - Sélectionnez "Deploy from my own GitHub Repository"
   - Choisissez le dépôt `Garden-Gold-Green`
   - Sélectionnez la branche `wip/2025-10-13` ou `main`

3. **Configurer les variables d'environnement**
   - Dans le dashboard IONOS, ajoutez toutes les variables du fichier `env.example`
   - ⚠️ **Important** : Configurez `DATABASE_URL` avec une base de données PostgreSQL accessible depuis Internet

4. **Configuration du build**
   - Build command: `npm install && npm run build`
   - Output directory: `.next`
   - Start command: `npm start`

5. **Déployer**
   - Cliquez sur "Deploy"
   - Le déploiement se fera automatiquement

### Variables d'environnement requises

Copiez toutes les variables du fichier `env.example` dans le dashboard IONOS Deploy Now.

**Variables critiques :**
- `DATABASE_URL` - URL de votre base de données PostgreSQL
- `AUTH0_SECRET` - Secret Auth0 (généré avec `openssl rand -hex 32`)
- `AUTH0_DOMAIN` - Votre domaine Auth0
- `AUTH0_CLIENT_ID` - ID client Auth0
- `AUTH0_CLIENT_SECRET` - Secret client Auth0
- `STRIPE_SECRET_KEY` - Clé secrète Stripe
- `NEXT_PUBLIC_APP_URL` - URL de votre application déployée

## Problèmes attendus

Si vous déployez quand même avec IONOS Deploy Now, vous rencontrerez probablement :

1. ❌ Les routes API ne fonctionneront pas
2. ❌ L'authentification côté serveur ne fonctionnera pas
3. ❌ Les pages avec SSR ne se rendront pas correctement
4. ❌ La base de données Prisma ne pourra pas se connecter

## Recommandation finale

**Utilisez Vercel** pour ce projet Next.js. C'est la solution la plus adaptée et la plus simple.

