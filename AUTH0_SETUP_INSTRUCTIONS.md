# 🔐 Configuration Auth0 - Garden Gold Green

## 📋 Étapes de Configuration

### 1. **Créer un Compte Auth0**
1. Aller sur [auth0.com](https://auth0.com)
2. Créer un compte gratuit
3. Créer une nouvelle Application

### 2. **Configuration de l'Application Auth0**

#### Type d'Application
- Sélectionner **"Regular Web Application"**
- Nom: `Garden Gold Green`

#### Paramètres de l'Application

**Allowed Callback URLs:**
```
http://localhost:3000/api/auth/callback
http://localhost:3001/api/auth/callback
https://gardengoldgreen.com/api/auth/callback
```

**Allowed Logout URLs:**
```
http://localhost:3000
http://localhost:3001
https://gardengoldgreen.com
```

**Allowed Web Origins:**
```
http://localhost:3000
http://localhost:3001
https://gardengoldgreen.com
```

### 3. **Configurer les Connexions Sociales**

#### Apple Sign In
1. Aller dans **Authentication > Social**
2. Activer **Apple**
3. Configurer avec:
   - Services ID
   - Team ID
   - Key ID
   - Private Key (fichier .p8)

#### Google Sign In
1. Activer **Google** dans les connexions sociales
2. Utiliser les clés par défaut Auth0 (dev) ou configurer les vôtres:
   - Client ID
   - Client Secret

#### Facebook Login
1. Activer **Facebook** dans les connexions sociales
2. Configurer avec:
   - App ID
   - App Secret

### 4. **Variables d'Environnement**

Créer un fichier `.env.local` à la racine du projet:

```env
# Auth0 Configuration
AUTH0_SECRET="use [openssl rand -hex 32] for production"
AUTH0_BASE_URL="http://localhost:3000"
AUTH0_ISSUER_BASE_URL="https://YOUR-DOMAIN.auth0.com"
AUTH0_CLIENT_ID="YOUR-CLIENT-ID"
AUTH0_CLIENT_SECRET="YOUR-CLIENT-SECRET"

# Database
DATABASE_URL="file:./dev.db"

# Stripe (à configurer plus tard)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 5. **Générer AUTH0_SECRET**

```bash
openssl rand -hex 32
```

Ou en Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 6. **Configurer les Rôles et Permissions**

#### Créer un Rôle Admin
1. Aller dans **User Management > Roles**
2. Créer un rôle `admin`
3. Ajouter des permissions selon vos besoins

#### Ajouter des Claims Personnalisés
Dans **Actions > Flows > Login**:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://gardengoldgreen.com';
  
  // Ajouter les rôles
  if (event.authorization) {
    api.idToken.setCustomClaim(`${namespace}/roles`, event.authorization.roles);
    api.accessToken.setCustomClaim(`${namespace}/roles`, event.authorization.roles);
  }
  
  // Ajouter les métadonnées utilisateur
  if (event.user.user_metadata) {
    if (event.user.user_metadata.address) {
      api.idToken.setCustomClaim(`${namespace}/address`, event.user.user_metadata.address);
    }
  }
};
```

### 7. **Tester l'Authentification**

1. Démarrer le serveur:
```bash
npm run dev
```

2. Aller sur `/auth` ou cliquer sur "Connexion"
3. Tester la connexion avec:
   - Email/Password
   - Google
   - Facebook
   - Apple

### 8. **URLs de l'Application**

#### Connexion
```
/api/auth/login
```

#### Inscription
```
/api/auth/signup
```

#### Déconnexion
```
/api/auth/logout
```

#### Callback
```
/api/auth/callback
```

#### Profil Utilisateur
```
/api/auth/me
```

## 🔒 Sécurité

### Production
- Utiliser HTTPS uniquement
- Générer un nouveau `AUTH0_SECRET`
- Activer MFA (Multi-Factor Authentication)
- Configurer les Rate Limits
- Activer Anomaly Detection

### Variables Sensibles
⚠️ **Ne JAMAIS commiter les fichiers suivants:**
- `.env.local`
- `.env.production`
- Fichiers contenant des secrets

## 📚 Documentation

- [Auth0 Next.js SDK](https://auth0.com/docs/quickstart/webapp/nextjs)
- [Auth0 Social Connections](https://auth0.com/docs/connections/social)
- [Auth0 Custom Claims](https://auth0.com/docs/security/tokens/id-tokens/custom-claims)

## 🆘 Dépannage

### Erreur: "Callback URL not allowed"
- Vérifier que l'URL est dans "Allowed Callback URLs"
- Redémarrer le serveur après modification `.env.local`

### Erreur: "Invalid state"
- Vider le cache du navigateur
- Vérifier `AUTH0_SECRET`

### Connexions sociales ne fonctionnent pas
- Vérifier que les connexions sont activées dans Auth0
- Vérifier les clés API (Google, Facebook, Apple)

## ✅ Checklist de Déploiement

- [ ] Créer une application Auth0
- [ ] Configurer les URLs autorisées
- [ ] Activer les connexions sociales
- [ ] Configurer les variables d'environnement
- [ ] Générer un AUTH0_SECRET sécurisé
- [ ] Créer les rôles et permissions
- [ ] Ajouter les custom claims
- [ ] Tester en local
- [ ] Configurer pour la production
- [ ] Activer MFA
- [ ] Tester en production

