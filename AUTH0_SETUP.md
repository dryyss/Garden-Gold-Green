# Configuration Auth0

## 📋 Étapes d'installation

### 1. Créer un compte Auth0
1. Allez sur [auth0.com](https://auth0.com) et créez un compte gratuit
2. Créez une nouvelle application de type "Regular Web Application"
3. Notez les informations suivantes :
   - **Domain** (ex: dev-xxxxx.us.auth0.com)
   - **Client ID**
   - **Client Secret**

### 2. Configurer l'application Auth0

Dans les paramètres de votre application Auth0 :

**Allowed Callback URLs:**
```
http://localhost:3002/api/auth/callback
```

**Allowed Logout URLs:**
```
http://localhost:3002
```

**Allowed Web Origins:**
```
http://localhost:3002
```

### 3. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet `garden-gold-green/` :

```bash
# Database
DATABASE_URL="file:./dev.db"

# Auth0 Configuration
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_BASE_URL='http://localhost:3002'
AUTH0_ISSUER_BASE_URL='https://YOUR-AUTH0-DOMAIN.auth0.com'
AUTH0_CLIENT_ID='YOUR-CLIENT-ID'
AUTH0_CLIENT_SECRET='YOUR-CLIENT-SECRET'

# Stripe (optionnel pour le moment)
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
```

### 4. Générer le AUTH0_SECRET

Sur Linux/Mac :
```bash
openssl rand -hex 32
```

Sur Windows PowerShell :
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### 5. Personnaliser la page de connexion Auth0 (Optionnel)

Dans le dashboard Auth0, allez dans **Branding** > **Universal Login** :

1. **Logo** : Uploadez le logo Garden Gold Green
2. **Couleur primaire** : `#FFD700` (gold)
3. **Couleur de fond** : `#0a0a0a` (black)

## 🚀 Fonctionnalités implémentées

### Routes API Auth0
- ✅ `/api/auth/login` - Connexion utilisateur
- ✅ `/api/auth/logout` - Déconnexion utilisateur
- ✅ `/api/auth/callback` - Callback après authentification
- ✅ `/api/auth/me` - Récupérer l'utilisateur connecté

### Pages protégées
- ✅ `/profile` - Page de profil utilisateur
- ✅ `/orders` - Historique des commandes

### Composants mis à jour
- ✅ `Header` - Menu utilisateur avec Auth0
- ✅ `UserProvider` - Context provider Auth0
- ✅ Layout principal

## 📱 Utilisation

### Connexion
```tsx
<a href="/api/auth/login">Se connecter</a>
```

### Inscription
```tsx
<a href="/api/auth/login?screen_hint=signup">S'inscrire</a>
```

### Déconnexion
```tsx
<a href="/api/auth/logout">Se déconnecter</a>
```

### Récupérer l'utilisateur
```tsx
import { useUser } from '@auth0/nextjs-auth0/client'

function Component() {
  const { user, error, isLoading } = useUser()
  
  if (isLoading) return <div>Chargement...</div>
  if (error) return <div>Erreur: {error.message}</div>
  
  return <div>Bonjour {user.name}</div>
}
```

## 🔐 Métadonnées utilisateur

Les informations supplémentaires (téléphone, adresse) sont stockées dans `user_metadata` :

```typescript
user.user_metadata = {
  phone: "+33 6 00 00 00 00",
  address: {
    street: "123 rue Example",
    city: "Paris",
    postalCode: "75001",
    country: "France"
  }
}
```

## 🛠️ API de mise à jour du profil

**Endpoint:** `POST /api/user/update`

**Body:**
```json
{
  "phone": "+33 6 00 00 00 00",
  "address": {
    "street": "123 rue Example",
    "city": "Paris",
    "postalCode": "75001",
    "country": "France"
  }
}
```

## 🎨 Personnalisation avancée

### Ajouter des rôles utilisateur

Dans Auth0 Dashboard :
1. Créez des rôles (ex: "admin", "customer")
2. Assignez les rôles aux utilisateurs
3. Accédez aux rôles dans votre application :

```tsx
const { user } = useUser()
const roles = user['https://your-namespace/roles']
const isAdmin = roles?.includes('admin')
```

### Ajouter des métadonnées personnalisées

1. Créez une action Auth0 (Actions > Flows > Login)
2. Ajoutez des données personnalisées au token

## 🔄 Migration depuis l'ancien système

L'ancien système `AuthContext` a été remplacé par Auth0. Les principales différences :

| Ancien système | Auth0 |
|----------------|-------|
| `useAuth()` | `useUser()` |
| `authState.user` | `user` |
| `authState.isAuthenticated` | `user !== undefined` |
| `login()` | `href="/api/auth/login"` |
| `logout()` | `href="/api/auth/logout"` |
| `register()` | `href="/api/auth/login?screen_hint=signup"` |

## 📚 Ressources

- [Documentation Auth0 Next.js](https://auth0.com/docs/quickstart/webapp/nextjs)
- [Auth0 SDK Reference](https://github.com/auth0/nextjs-auth0)
- [Auth0 Dashboard](https://manage.auth0.com)

## ⚠️ Notes importantes

1. **SECRET** : Ne partagez jamais votre `AUTH0_CLIENT_SECRET` ou `AUTH0_SECRET`
2. **Production** : Mettez à jour `AUTH0_BASE_URL` en production
3. **HTTPS** : Auth0 nécessite HTTPS en production
4. **Domaine personnalisé** : Configurez un domaine personnalisé pour le branding
