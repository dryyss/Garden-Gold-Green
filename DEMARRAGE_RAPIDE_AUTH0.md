# 🚀 Démarrage Rapide - Auth0

## ✅ Configuration en 3 étapes

### Étape 1 : Créer le fichier `.env.local`

Créez un fichier `.env.local` à la racine de `garden-gold-green/` avec ce contenu :

```bash
# Database
DATABASE_URL="file:./dev.db"

# Auth0 Configuration
AUTH0_SECRET="b7dbed86f5d5a61ee7b655286ae39bb5fcb2fe063bec840682d4594c5aad949c"
AUTH0_BASE_URL="http://localhost:3002"
AUTH0_ISSUER_BASE_URL="https://dev-1tkaqeynik4yy714.us.auth0.com"
AUTH0_CLIENT_ID="Lt54JQ2uYcmyTU0oo7Tu5EVwJJIIBJX9"
AUTH0_CLIENT_SECRET="cWYxj8kUnzDCkSWvEPiHSnsHkVgxAn-ZeZJHcT7V3_3CjOrVUa4drp_g3bMeSGIg"

# Stripe (optionnel)
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
```

### Étape 2 : Configurer Auth0 Dashboard

Allez sur [Auth0 Dashboard](https://manage.auth0.com) et configurez votre application :

**Applications > Garden Gold Green > Settings**

1. **Allowed Callback URLs** :
```
http://localhost:3002/api/auth/callback
```

2. **Allowed Logout URLs** :
```
http://localhost:3002
```

3. **Allowed Web Origins** :
```
http://localhost:3002
```

4. Cliquez sur **Save Changes** en bas de la page

### Étape 3 : Redémarrer le serveur

```bash
cd garden-gold-green
npm run dev
```

## ✨ C'est tout !

Votre application utilise maintenant Auth0 pour l'authentification !

### 🧪 Tester l'authentification

1. Ouvrez http://localhost:3002
2. Cliquez sur **"Connexion"** ou **"Inscription"** dans le header
3. Vous serez redirigé vers la page de connexion Auth0
4. Créez un compte ou connectez-vous
5. Vous serez redirigé vers votre application, connecté !

### 📱 Pages disponibles

- **`/profile`** - Page de profil (protégée)
- **`/orders`** - Historique des commandes (protégée)
- **`/api/auth/login`** - Connexion
- **`/api/auth/logout`** - Déconnexion
- **`/api/auth/me`** - Informations utilisateur (API)

### 🎨 Personnalisation Auth0 (Optionnel)

Pour personnaliser la page de connexion avec le thème Garden Gold Green :

1. Allez dans **Branding** > **Universal Login**
2. **Logo** : Uploadez `/public/logo.png`
3. **Primary Color** : `#FFD700`
4. **Page Background** : `#0a0a0a`

### 🔧 Fonctionnalités implémentées

- ✅ Connexion / Inscription avec Auth0
- ✅ Déconnexion
- ✅ Protection des routes
- ✅ Profil utilisateur
- ✅ Mise à jour des informations (téléphone, adresse)
- ✅ Menu utilisateur dans le header
- ✅ Redirection automatique si non connecté

### 🐛 Dépannage

**Erreur "Invalid state" :**
- Vérifiez que `AUTH0_SECRET` est bien défini
- Redémarrez le serveur

**Erreur "Callback URL mismatch" :**
- Vérifiez que les URLs dans Auth0 Dashboard correspondent exactement
- Pas d'espace, pas de slash final

**Erreur "Client authentication failed" :**
- Vérifiez que `AUTH0_CLIENT_SECRET` est correct
- Vérifiez qu'il n'y a pas d'espaces avant/après

### 📚 Documentation complète

Consultez `AUTH0_SETUP.md` pour plus de détails sur :
- Configuration avancée
- Rôles et permissions
- Métadonnées personnalisées
- Migration depuis l'ancien système

---

**🎉 Félicitations ! Votre application utilise maintenant Auth0 !**

