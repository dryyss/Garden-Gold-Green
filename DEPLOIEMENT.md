# 🚀 Guide de Déploiement - Garden Gold Green

Ce guide vous accompagne pour déployer l'application Garden Gold Green en production.

## 📋 Prérequis

- Node.js 20+ installé
- PostgreSQL installé et configuré
- Compte Auth0 configuré
- Compte Stripe configuré (optionnel)
- Serveur avec accès SSH (VPS, IONOS, etc.)

## 🔧 Étape 1 : Configuration de la Base de Données

1. **Créer la base de données PostgreSQL** :
```sql
CREATE DATABASE garden_db;
CREATE USER garden_user WITH PASSWORD 'votre_mot_de_passe_securise';
GRANT ALL PRIVILEGES ON DATABASE garden_db TO garden_user;
```

2. **Mettre à jour DATABASE_URL** dans votre fichier `.env` :
```env
DATABASE_URL="postgresql://garden_user:votre_mot_de_passe_securise@localhost:5432/garden_db?schema=public"
```

## 🔐 Étape 2 : Configuration Auth0

1. **Générer AUTH0_SECRET** :
```bash
openssl rand -hex 32
```

2. **Configurer les variables Auth0** dans `.env` :
```env
AUTH0_SECRET="votre_secret_genere"
AUTH0_BASE_URL="https://votre-domaine.com"
AUTH0_ISSUER_BASE_URL="https://dev-1tkaqeynik4yy714.us.auth0.com"
AUTH0_CLIENT_ID="votre_client_id"
AUTH0_CLIENT_SECRET="votre_client_secret"
```

3. **Configurer les URLs de callback dans Auth0 Dashboard** :
   - Allowed Callback URLs: `https://votre-domaine.com/api/auth/callback`
   - Allowed Logout URLs: `https://votre-domaine.com`
   - Allowed Web Origins: `https://votre-domaine.com`

## 💳 Étape 3 : Configuration Stripe (Optionnel)

1. **Récupérer vos clés Stripe** depuis le dashboard Stripe
2. **Configurer dans `.env`** :
```env
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

3. **Configurer le webhook Stripe** :
   - URL: `https://votre-domaine.com/api/stripe/webhook`
   - Événements: `checkout.session.completed`, `payment_intent.succeeded`

## 📧 Étape 4 : Configuration Email (SendGrid)

1. **Créer un compte SendGrid** et récupérer votre API key
2. **Configurer dans `.env`** :
```env
SENDGRID_API_KEY="SG.xxxxx"
SENDGRID_FROM_EMAIL="contact@gardengoldgreen.com"
```

## 🚀 Étape 5 : Déploiement

### Option A : Déploiement avec script automatique

```bash
chmod +x deploy.sh
./deploy.sh
```

### Option B : Déploiement manuel

1. **Cloner le repository** :
```bash
git clone https://github.com/votre-repo/garden-gold-green.git
cd garden-gold-green
```

2. **Installer les dépendances** :
```bash
npm install
```

3. **Configurer les variables d'environnement** :
```bash
cp env.example .env
# Éditer .env avec vos valeurs
nano .env
```

4. **Générer le client Prisma** :
```bash
npx prisma generate
```

5. **Appliquer les migrations** :
```bash
npx prisma migrate deploy
```

6. **Construire l'application** :
```bash
npm run build
```

7. **Démarrer avec PM2** :
```bash
npm install -g pm2
pm2 start npm --name "garden-gold-green" -- start
pm2 save
pm2 startup  # Pour démarrer au boot
```

## 🌐 Étape 6 : Configuration Nginx

Créer `/etc/nginx/sites-available/garden-gold-green` :

```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activer le site :
```bash
sudo ln -s /etc/nginx/sites-available/garden-gold-green /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔒 Étape 7 : Configuration SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

## ✅ Vérification

1. **Vérifier que l'application fonctionne** :
```bash
pm2 logs garden-gold-green
pm2 status
```

2. **Tester l'application** :
   - Visiter `https://votre-domaine.com`
   - Tester la connexion Auth0
   - Vérifier les fonctionnalités principales

## 🔄 Mise à jour

Pour mettre à jour l'application :

```bash
git pull origin main
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart garden-gold-green
```

## 📊 Monitoring

- **Logs PM2** : `pm2 logs garden-gold-green`
- **Statut PM2** : `pm2 status`
- **Monitoring** : `pm2 monit`

## 🆘 Dépannage

### L'application ne démarre pas
- Vérifier les logs : `pm2 logs garden-gold-green`
- Vérifier les variables d'environnement
- Vérifier la connexion à la base de données

### Erreurs de base de données
- Vérifier que PostgreSQL est démarré : `sudo systemctl status postgresql`
- Vérifier les permissions utilisateur
- Vérifier la connexion : `psql -U garden_user -d garden_db`

### Erreurs Auth0
- Vérifier les URLs de callback dans Auth0 Dashboard
- Vérifier que AUTH0_SECRET est correct
- Vérifier les variables d'environnement

## 📝 Notes importantes

- ⚠️ **Ne jamais commiter le fichier `.env`**
- ⚠️ **Utiliser des secrets forts en production**
- ⚠️ **Configurer les backups de base de données**
- ⚠️ **Mettre à jour régulièrement les dépendances**

