# 📝 Modifications à Effectuer pour le Déploiement

Ce document liste **exactement** ce que vous devez modifier pour mettre en ligne l'application.

## 🔧 Fichier à Modifier : `.env`

**Localisation** : À la racine du projet (`garden-gold-green/.env`)

⚠️ **Ce fichier existe déjà** - Vous devez modifier les valeurs suivantes :

### 1. Base de Données PostgreSQL

```env
# REMPLACER cette ligne :
DATABASE_URL="postgresql://user:password@localhost:5432/garden_db?schema=public"

# PAR votre URL de base de données de production :
DATABASE_URL="postgresql://garden_user:VOTRE_MOT_DE_PASSE@VOTRE_SERVEUR:5432/garden_db?schema=public"
```

**Exemple concret** :
```env
DATABASE_URL="postgresql://garden_user:MonMotDePasse123!@db.example.com:5432/garden_db?schema=public"
```

### 2. Auth0 - Générer le Secret

**Étape 1** : Générer `AUTH0_SECRET`
```bash
openssl rand -hex 32
```

**Étape 2** : Modifier dans `.env`
```env
# REMPLACER :
AUTH0_SECRET="use-openssl-rand-hex-32-to-generate-this"

# PAR le secret généré (exemple) :
AUTH0_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
```

### 3. Auth0 - URLs de Production

```env
# REMPLACER :
AUTH0_BASE_URL="http://localhost:3000"

# PAR votre domaine de production :
AUTH0_BASE_URL="https://votre-domaine.com"
```

### 4. Auth0 - Identifiants Client

```env
# REMPLACER :
AUTH0_CLIENT_ID="your-auth0-client-id"
AUTH0_CLIENT_SECRET="your-auth0-client-secret"

# PAR vos vrais identifiants depuis Auth0 Dashboard :
AUTH0_CLIENT_ID="Lt54JQ2uYcmyTU0oo7Tu5EVwJJIIBJX9"
AUTH0_CLIENT_SECRET="votre_vrai_secret_client_auth0"
```

### 5. URLs de l'Application

```env
# REMPLACER :
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# PAR votre domaine de production :
NEXT_PUBLIC_APP_URL="https://votre-domaine.com"
NEXT_PUBLIC_BASE_URL="https://votre-domaine.com"
```

### 6. Mode Production

```env
# AJOUTER ou MODIFIER :
NODE_ENV="production"
```

### 7. Stripe (Si vous utilisez Stripe)

```env
# REMPLACER :
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

# PAR vos vraies clés depuis Stripe Dashboard :
STRIPE_PUBLISHABLE_KEY="pk_live_51..."
STRIPE_SECRET_KEY="sk_live_51..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 8. SendGrid Email (Si vous utilisez SendGrid)

```env
# REMPLACER :
SENDGRID_API_KEY="your-sendgrid-api-key"
SENDGRID_FROM_EMAIL="contact@gardengoldgreen.com"

# PAR vos vraies valeurs :
SENDGRID_API_KEY="SG.xxxxxxxxxxxxx"
SENDGRID_FROM_EMAIL="contact@gardengoldgreen.com"
```

## 🔐 Configuration Auth0 Dashboard

**Vous devez aussi modifier dans Auth0 Dashboard** :

1. **Aller sur** : https://manage.auth0.com/
2. **Applications** → Votre application
3. **Settings** → Modifier :

   - **Allowed Callback URLs** :
     ```
     https://votre-domaine.com/api/auth/callback
     ```

   - **Allowed Logout URLs** :
     ```
     https://votre-domaine.com
     ```

   - **Allowed Web Origins** :
     ```
     https://votre-domaine.com
     ```

## 📋 Checklist de Vérification

Avant de déployer, vérifiez que dans votre `.env` :

- [ ] `DATABASE_URL` pointe vers votre base de données de production
- [ ] `AUTH0_SECRET` est un secret généré (pas le placeholder)
- [ ] `AUTH0_BASE_URL` est votre domaine de production (https://)
- [ ] `AUTH0_CLIENT_ID` est votre vrai Client ID
- [ ] `AUTH0_CLIENT_SECRET` est votre vrai Client Secret
- [ ] `NEXT_PUBLIC_APP_URL` est votre domaine de production
- [ ] `NODE_ENV="production"`
- [ ] Toutes les URLs utilisent `https://` (pas `http://`)

## 🚀 Après les Modifications

Une fois toutes les modifications faites :

1. **Ne commitez JAMAIS le fichier `.env`** (il est déjà dans `.gitignore`)
2. **Testez localement** avec les nouvelles valeurs
3. **Déployez** avec `npm run build` puis `npm start`

## ⚠️ Important

- Le fichier `.env` est **local** et ne doit **jamais** être commité
- En production, configurez les variables d'environnement directement sur votre serveur
- Utilisez des secrets forts et uniques pour la production


