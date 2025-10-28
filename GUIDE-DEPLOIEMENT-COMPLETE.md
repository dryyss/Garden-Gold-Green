# 🚀 Guide Complet de Déploiement - Garden Gold Green

## ✅ Statut Actuel

- ✅ Code sur GitHub (branche `wip/2025-10-13`)
- ✅ Toutes les corrections appliquées
- ✅ Application fonctionnelle localement
- ✅ Prêt pour la production

---

## 📊 Options de Déploiement

### 🥇 Option 1 : Railway (RECOMMANDÉ - 5 minutes)

**Pourquoi Railway ?**
- Déploiement automatique depuis GitHub
- Base de données PostgreSQL incluse
- Variables d'environnement faciles à configurer
- Support Next.js natif
- Scale automatique

**Étapes :**

1. **Aller sur https://railway.app**
2. **Créer un compte** (connexion GitHub recommandée)
3. **Nouveau projet** → "Deploy from GitHub repo"
4. **Sélectionner** le repo `Garden-Gold-Green`
5. **Ajouter PostgreSQL** : "+ New" → "Database" → "PostgreSQL"
6. **Configurer les variables** (voir ci-dessous)
7. **Déployer**

**Variables d'environnement à ajouter dans Railway :**

```env
# Base de données (copier depuis la DB PostgreSQL de Railway)
DATABASE_URL="postgresql://..."

# Auth0 (DÉSACTIVÉ pour le moment, laisser les valeurs par défaut)
AUTH0_SECRET="disable-auth0"
AUTH0_BASE_URL="https://votre-app.railway.app"
AUTH0_ISSUER_BASE_URL="https://dev-1tkaqeynik4yy714.us.auth0.com"
AUTH0_CLIENT_ID="disable"
AUTH0_CLIENT_SECRET="disable"

# NextAuth
NEXTAUTH_URL="https://votre-app.railway.app"
NEXTAUTH_SECRET="générez-avec: openssl rand -hex 32"

# JWT
JWT_SECRET="générez-avec: openssl rand -hex 32"

# Stripe (VOS CLÉS STRIPE)
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# PayPal (optionnel)
PAYPAL_CLIENT_ID="..."
PAYPAL_CLIENT_SECRET="..."

# URL de l'application
NEXT_PUBLIC_APP_URL="https://votre-app.railway.app"
NEXT_PUBLIC_BASE_URL="https://votre-app.railway.app"

# Environnement
NODE_ENV="production"
```

**Générer les secrets :**
```bash
openssl rand -hex 32
```

---

### 🥈 Option 2 : Render (Gratuit avec limitations)

**Étapes :**

1. **Aller sur https://render.com**
2. **Créer un compte**
3. **"New"** → "Web Service"
4. **Connecter GitHub repo** `Garden-Gold-Green`
5. **Configurer** :
   - Build Command : `npm install && npm run build`
   - Start Command : `npm start`
   - Environment : `production`
6. **Ajouter PostgreSQL** : "New" → "PostgreSQL"
7. **Ajouter les variables** (même liste que Railway)
8. **Déployer**

---

### 🥉 Option 3 : IONOS (Complexe - VPS requis)

**Prérequis :**
- VPS IONOS (minimum 10€/mois)
- Accès SSH
- Connaissance Linux

**Étapes complètes** : Voir `DEPLOYMENT.md`

**Quick Start :**
```bash
# 1. Connexion SSH
ssh root@votre-serveur.fr

# 2. Installer Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts

# 3. Installer PM2
npm install -g pm2

# 4. Installer PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql

# 5. Créer la base de données
sudo -u postgres psql
CREATE DATABASE garden_db;
CREATE USER garden_user WITH PASSWORD 'mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE garden_db TO garden_user;
\q

# 6. Cloner le projet
cd /var/www
git clone https://github.com/dryyss/Garden-Gold-Green.git garden-gold-green
cd garden-gold-green/garden-gold-green

# 7. Créer .env
cp env.example .env
nano .env  # Configurer avec vos valeurs

# 8. Installer et build
npm install
npm run build

# 9. Lancer avec PM2
pm2 start npm --name "garden-gold-green" -- start
pm2 save

# 10. Configurer Nginx (voir DEPLOYMENT.md section 2)
# 11. Configurer SSL avec Let's Encrypt
```

---

## 🔑 Configuration de Stripe

**En production, vous devez :**

1. **Aller sur https://dashboard.stripe.com**
2. **Passer en mode Live** (bouton en haut)
3. **Copier** vos clés Live (pas Test)
4. **Configurer les webhooks** :
   - URL : `https://votre-domaine.com/api/stripe/webhook`
   - Événements : `payment_intent.succeeded`, `payment_intent.payment_failed`

---

## 🔐 Configuration Auth0

**Actuellement désactivé.** Pour réactiver plus tard :

1. Aller sur https://auth0.com
2. Créer une application "Regular Web Application"
3. Configurer les URLs :
   - Callback : `https://votre-domaine.com/api/auth/callback`
   - Logout : `https://votre-domaine.com`
4. Ajouter les clés dans les variables d'environnement

---

## ✅ Checklist de Déploiement

### Avant le déploiement :
- [ ] Code poussé sur GitHub
- [ ] Toutes les corrections appliquées
- [ ] Build local fonctionne (`npm run build`)
- [ ] Clés Stripe Live obtenues
- [ ] Compte choisi (Railway/Render/IONOS)

### Pendant le déploiement :
- [ ] Projet créé sur la plateforme
- [ ] Base de données ajoutée
- [ ] Toutes les variables d'environnement configurées
- [ ] Application déployée sans erreur
- [ ] Migration Prisma appliquée

### Après le déploiement :
- [ ] Site accessible en HTTPS
- [ ] Pages principales fonctionnent
- [ ] Panier fonctionne
- [ ] Produits s'affichent
- [ ] Test de paiement Stripe (mode Test)
- [ ] Emails fonctionnent

---

## 🐛 Dépannage

### Erreur de build
```bash
# Vérifier les logs
railway logs
# ou
pm2 logs garden-gold-green
```

### Erreur de base de données
```bash
# Appliquer les migrations
npx prisma migrate deploy
npx prisma generate
```

### Erreur de port
- Railway/Render gère automatiquement
- IONOS : configurer Nginx pour proxifier port 3000

---

## 📞 Support

- **Documentation Railway** : https://docs.railway.app
- **Documentation Render** : https://render.com/docs
- **Documentation IONOS** : https://www.ionos.fr/assistance/

---

## 🎯 Ma Recommandation

**Utilisez Railway** pour un déploiement en 5 minutes :
1. Railway.app
2. Connexion GitHub
3. Sélectionner votre repo
4. Ajouter PostgreSQL
5. Configurer les variables
6. **C'est déployé !** ✨

URL de votre application : `https://votre-app.railway.app`

---

**Bon déploiement ! 🚀**
