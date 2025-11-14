# ✅ Résumé : Ce Que Vous Devez Modifier

## 📄 UN SEUL FICHIER À MODIFIER : `.env`

Le fichier `.env` est à la racine du projet. Voici **exactement** ce que vous devez changer :

### 🔴 Variables OBLIGATOIRES à Modifier :

1. **DATABASE_URL** → Votre URL PostgreSQL de production
2. **AUTH0_SECRET** → Générer avec `openssl rand -hex 32`
3. **AUTH0_BASE_URL** → `https://votre-domaine.com`
4. **AUTH0_CLIENT_ID** → Votre Client ID depuis Auth0
5. **AUTH0_CLIENT_SECRET** → Votre Client Secret depuis Auth0
6. **NEXT_PUBLIC_APP_URL** → `https://votre-domaine.com`
7. **NEXT_PUBLIC_BASE_URL** → `https://votre-domaine.com`
8. **NODE_ENV** → `"production"`

### 🟡 Variables OPTIONNELLES (si vous les utilisez) :

- **STRIPE_*** → Vos clés Stripe
- **SENDGRID_API_KEY** → Votre clé SendGrid
- **AUTH0_M2M_*** → Si vous utilisez l'API Management

## 🔐 Configuration Auth0 Dashboard

**À faire dans Auth0** (pas dans le code) :

1. Aller sur https://manage.auth0.com/
2. Applications → Votre app → Settings
3. Modifier :
   - **Allowed Callback URLs** : `https://votre-domaine.com/api/auth/callback`
   - **Allowed Logout URLs** : `https://votre-domaine.com`
   - **Allowed Web Origins** : `https://votre-domaine.com`

## 📝 Exemple de `.env` Modifié

```env
# Base de données
DATABASE_URL="postgresql://user:pass@serveur:5432/garden_db?schema=public"

# Auth0
AUTH0_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
AUTH0_BASE_URL="https://votre-domaine.com"
AUTH0_ISSUER_BASE_URL="https://dev-1tkaqeynik4yy714.us.auth0.com"
AUTH0_CLIENT_ID="Lt54JQ2uYcmyTU0oo7Tu5EVwJJIIBJX9"
AUTH0_CLIENT_SECRET="votre_vrai_secret"

# App
NEXT_PUBLIC_APP_URL="https://votre-domaine.com"
NEXT_PUBLIC_BASE_URL="https://votre-domaine.com"
NODE_ENV="production"
```

## ⚠️ Important

- **Ne modifiez QUE le fichier `.env`**
- **Ne commitez JAMAIS `.env`** (déjà protégé)
- **Utilisez `https://` partout en production**
- **Testez avant de déployer**

