# 🚀 Déploiement IONOS - Étape par Étape

## 📋 Informations Nécessaires

Avant de commencer, ayez sous la main :
- ✅ Adresse IP ou nom de domaine de votre serveur IONOS
- ✅ Identifiants de connexion SSH (root ou utilisateur)
- ✅ Clés Stripe en mode Live
- ✅ 30-45 minutes disponibles

---

## 📦 Étape 1 : Connexion au Serveur

### Si vous avez un nom de domaine :
```bash
ssh root@votredomaine.fr
```

### Si vous avez une IP :
```bash
ssh root@votre_IP
```

**Note** : Si vous utilisez Windows, utilisez PowerShell ou l'application **PuTTY** ou **Git Bash**.

---

## 🛠️ Étape 2 : Installer Node.js

Une fois connecté au serveur, exécutez :

```bash
# Installer NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recharger le bash
source ~/.bashrc

# Installer Node.js LTS (version stable)
nvm install --lts
nvm use --lts

# Vérifier l'installation
node --version
npm --version
```

**Attendu** : Vous devriez voir `v20.x.x` ou `v18.x.x`

---

## 🐘 Étape 3 : Installer PostgreSQL

```bash
# Mettre à jour les paquets
sudo apt update

# Installer PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Démarrer PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Vérifier que PostgreSQL tourne
sudo systemctl status postgresql
```

**Créer la base de données :**

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Dans PostgreSQL, exécutez ces commandes (remplacez le mot de passe) :
CREATE DATABASE garden_db;
CREATE USER garden_user WITH PASSWORD 'VotreMotDePasseFort123!';
GRANT ALL PRIVILEGES ON DATABASE garden_db TO garden_user;
ALTER DATABASE garden_db OWNER TO garden_user;

# Quitter PostgreSQL
\q
```

**IMPORTANT** : Notez le mot de passe que vous avez créé !

---

## ⚡ Étape 4 : Installer PM2

PM2 permet de faire tourner votre application en arrière-plan :

```bash
npm install -g pm2
```

---

## 🌐 Étape 5 : Installer et Configurer Nginx

```bash
# Installer Nginx
sudo apt install nginx -y

# Démarrer Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

**Configurer Nginx :**

```bash
# Créer la configuration de votre site
sudo nano /etc/nginx/sites-available/garden-gold-green
```

**Collez cette configuration** (remplacez `votredomaine.fr` par votre domaine) :

```nginx
server {
    listen 80;
    server_name votredomaine.fr www.votredomaine.fr;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Enregistrer** : `Ctrl + X`, puis `Y`, puis `Enter`

**Activer le site :**

```bash
sudo ln -s /etc/nginx/sites-available/garden-gold-green /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 📥 Étape 6 : Cloner et Configurer le Projet

```bash
# Aller dans /var/www
cd /var/www

# Cloner votre projet GitHub
git clone https://github.com/dryyss/Garden-Gold-Green.git garden-gold-green

# Aller dans le dossier du projet
cd garden-gold-green/garden-gold-green

# Installer les dépendances
npm install
```

---

## 🔧 Étape 7 : Configurer les Variables d'Environnement

```bash
# Créer le fichier .env
nano .env
```

**Ajoutez ces variables** (remplacez par vos vraies valeurs) :

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://garden_user:VotreMotDePasseFort123!@localhost:5432/garden_db?schema=public"

# Auth0 (ACTUELLEMENT DÉSACTIVÉ)
AUTH0_SECRET="disable-auth0-for-now"
AUTH0_BASE_URL="https://votredomaine.fr"
AUTH0_ISSUER_BASE_URL="https://dev-1tkaqeynik4yy714.us.auth0.com"
AUTH0_CLIENT_ID="Lt54JQ2uYcmyTU0oo7Tu5EVwJJIIBJX9"
AUTH0_CLIENT_SECRET="cWYxj8kUnzDCkSWvEPiHSnsHkVgxAn-ZeZJHcT7V3_3CjOrVUa4drp_g3bMeSGIg"

# NextAuth
NEXTAUTH_URL="https://votredomaine.fr"
NEXTAUTH_SECRET="<GÉNÉRER AVEC: openssl rand -hex 32>"

# JWT
JWT_SECRET="<GÉNÉRER AVEC: openssl rand -hex 32>"

# Stripe (VOS CLÉS LIVE)
STRIPE_PUBLISHABLE_KEY="pk_live_votre_clé_live"
STRIPE_SECRET_KEY="sk_live_votre_clé_live"
STRIPE_WEBHOOK_SECRET="whsec_votre_webhook_secret"

# PayPal (optionnel)
PAYPAL_CLIENT_ID="votre_paypal_client_id"
PAYPAL_CLIENT_SECRET="votre_paypal_client_secret"

# URL de l'application
NEXT_PUBLIC_APP_URL="https://votredomaine.fr"
NEXT_PUBLIC_BASE_URL="https://votredomaine.fr"

# Environnement
NODE_ENV="production"
```

**Pour générer les secrets :**

```bash
openssl rand -hex 32
```

**Enregistrer** : `Ctrl + X`, puis `Y`, puis `Enter`

---

## 🔨 Étape 8 : Build et Déployer

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy

# Build l'application
npm run build

# Lancer avec PM2
pm2 start npm --name "garden-gold-green" -- start

# Sauvegarder la configuration PM2
pm2 save

# Configurer PM2 pour démarrer au boot
pm2 startup
```

**Copiez la commande affichée** et exécutez-la (elle ressemble à `sudo env PATH=...`)

**Vérifier que l'application tourne :**

```bash
pm2 status
pm2 logs garden-gold-green
```

---

## 🔒 Étape 9 : Configurer SSL avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtenir le certificat SSL
sudo certbot --nginx -d votredomaine.fr -d www.votredomaine.fr
```

**Répondez aux questions :**
- Email : votre email
- Accepter les conditions : Y
- Accepter l'email : N (ou Y)
- Redirection HTTP vers HTTPS : 2

**Vérifier le renouvellement automatique :**

```bash
sudo certbot renew --dry-run
```

---

## ✅ Étape 10 : Vérification

**Vérifiez que tout fonctionne :**

1. **Site accessible** : https://votredomaine.fr
2. **Produits s'affichent**
3. **Panier fonctionne**
4. **Logs sans erreur** : `pm2 logs garden-gold-green`

---

## 🐛 Dépannage

### L'application ne démarre pas

```bash
# Voir les logs
pm2 logs garden-gold-green

# Redémarrer
pm2 restart garden-gold-green

# Voir le statut
pm2 status
```

### Erreur de base de données

```bash
# Vérifier que PostgreSQL tourne
sudo systemctl status postgresql

# Se connecter à la DB
sudo -u postgres psql -d garden_db
```

### Erreur de build

```bash
cd /var/www/garden-gold-green/garden-gold-green
npm run build
```

### Port 3000 bloqué

```bash
# Vérifier quel processus utilise le port
sudo netstat -tulpn | grep 3000

# Tuer le processus si nécessaire
sudo kill -9 <PID>
```

---

## 🔄 Mettre à Jour l'Application

Lorsque vous voulez déployer de nouvelles modifications :

```bash
cd /var/www/garden-gold-green/garden-gold-green
git pull origin main
npm install
npm run build
pm2 restart garden-gold-green
```

---

## 📊 Commandes Utiles

```bash
# Voir les logs en temps réel
pm2 logs garden-gold-green

# Redémarrer l'application
pm2 restart garden-gold-green

# Arrêter l'application
pm2 stop garden-gold-green

# Voir le statut
pm2 status

# Monitoring
pm2 monit
```

---

## 🔐 Sécurité

### Firewall

```bash
# Autoriser SSH
sudo ufw allow OpenSSH

# Autoriser HTTP et HTTPS
sudo ufw allow 'Nginx Full'

# Activer le firewall
sudo ufw enable
```

### Protéger le fichier .env

```bash
cd /var/www/garden-gold-green/garden-gold-green
chmod 600 .env
```

---

## ✅ Checklist Complète

- [ ] Connexion SSH au serveur IONOS
- [ ] Node.js installé (v20+ ou v18+)
- [ ] PM2 installé
- [ ] PostgreSQL installé et DB créée
- [ ] Nginx installé et configuré
- [ ] Projet cloné depuis GitHub
- [ ] Fichier .env créé avec toutes les variables
- [ ] Build réussi
- [ ] Application lancée avec PM2
- [ ] SSL configuré avec Let's Encrypt
- [ ] Site accessible en HTTPS
- [ ] Test de fonctionnalités (produits, panier, paiement)

---

## 🎉 Félicitations !

Votre application est maintenant déployée sur IONOS ! 🚀

URL : https://votredomaine.fr

---

## 📞 Besoin d'Aide ?

- **Logs** : `pm2 logs garden-gold-green`
- **Statut** : `pm2 status`
- **Documentation IONOS** : https://www.ionos.fr/assistance/
