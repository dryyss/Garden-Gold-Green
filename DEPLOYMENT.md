# 🚀 Guide de Déploiement IONOS - Garden Gold Green

Ce guide vous accompagne pour mettre en ligne votre application e-commerce sur IONOS.

## 📋 Prérequis

- Compte IONOS avec accès au serveur
- Accès SSH au serveur
- Domaine configuré (exemple: votredomaine.fr)
- Node.js 18+ installé sur le serveur
- PostgreSQL ou MySQL installé
- Nginx ou Apache installé
- Compte Stripe (pour les paiements)
- Compte Auth0 (pour l'authentification)

## 🔧 Étape 1 : Préparer le Serveur IONOS

### 1.1 Se connecter au serveur

```bash
ssh root@votredomaine.fr
# ou via le client SSH de votre choix
```

### 1.2 Installer Node.js

```bash
# Installer Node Version Manager
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Installer Node.js LTS
nvm install --lts
nvm use --lts
node --version
```

### 1.3 Installer PM2 (gestionnaire de processus)

```bash
npm install -g pm2
```

### 1.4 Installer PostgreSQL

```bash
# Pour Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Démarrer PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 1.5 Créer la base de données

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer la base de données
CREATE DATABASE garden_db;
CREATE USER garden_user WITH PASSWORD 'votre_mot_de_passe_fort';
GRANT ALL PRIVILEGES ON DATABASE garden_db TO garden_user;
\q
```

## 🌐 Étape 2 : Configurer Nginx

### 2.1 Créer la configuration Nginx

```bash
sudo nano /etc/nginx/sites-available/garden-gold-green
```

Ajoutez cette configuration :

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

### 2.2 Activer le site

```bash
sudo ln -s /etc/nginx/sites-available/garden-gold-green /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 2.3 Configurer SSL avec Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votredomaine.fr -d www.votredomaine.fr
```

## 📦 Étape 3 : Déployer l'Application

### 3.1 Créer le répertoire de l'application

```bash
sudo mkdir -p /var/www/garden-gold-green
sudo chown $USER:$USER /var/www/garden-gold-green
cd /var/www/garden-gold-green
```

### 3.2 Cloner le projet

```bash
# Si vous avez Git sur le serveur
git clone https://github.com/dryyss/Garden-Gold-Green.git .

# OU transférer les fichiers via FTP/SFTP
# Utilisez FileZilla ou WinSCP pour uploader les fichiers
```

### 3.3 Installer les dépendances

```bash
cd /var/www/garden-gold-green/garden-gold-green
npm install
```

### 3.4 Créer le fichier .env

```bash
nano .env
```

Ajoutez vos variables d'environnement :

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://garden_user:votre_mot_de_passe@localhost:5432/garden_db"

# Auth0
AUTH0_SECRET="générez-avec-openssl-rand-hex-32"
AUTH0_BASE_URL="https://votredomaine.fr"
AUTH0_ISSUER_BASE_URL="https://votre-tenant.auth0.com"
AUTH0_CLIENT_ID="votre-client-id"
AUTH0_CLIENT_SECRET="votre-client-secret"

# NextAuth
NEXTAUTH_URL="https://votredomaine.fr"
NEXTAUTH_SECRET="générez-avec-openssl-rand-hex-32"

# JWT
JWT_SECRET="générez-avec-openssl-rand-hex-32"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# PayPal (optionnel)
PAYPAL_CLIENT_ID="votre-paypal-client-id"
PAYPAL_CLIENT_SECRET="votre-paypal-client-secret"

# URL de l'application
NEXT_PUBLIC_APP_URL="https://votredomaine.fr"
NEXT_PUBLIC_BASE_URL="https://votredomaine.fr"

# Environnement
NODE_ENV="production"
```

Générez les secrets :

```bash
openssl rand -hex 32
```

### 3.5 Construire l'application

```bash
npm run build
```

### 3.6 Exécuter les migrations

```bash
npx prisma migrate deploy
npx prisma generate
```

### 3.7 Lancer avec PM2

```bash
pm2 start npm --name "garden-gold-green" -- start
pm2 save
pm2 startup
```

## 🔐 Étape 4 : Configurer Auth0

1. Connectez-vous à [auth0.com](https://auth0.com)
2. Créez une application de type "Regular Web Application"
3. Configurez les URLs autorisées :
   - **Allowed Callback URLs** : `https://votredomaine.fr/api/auth/callback`
   - **Allowed Logout URLs** : `https://votredomaine.fr`
   - **Allowed Web Origins** : `https://votredomaine.fr`

## 💳 Étape 5 : Configurer Stripe

1. Connectez-vous à [stripe.com](https://stripe.com)
2. Copiez vos clés API depuis le tableau de bord
3. Configurez les webhooks :
   - URL : `https://votredomaine.fr/api/stripe/webhook`
   - Événements : `payment_intent.succeeded`, `payment_intent.payment_failed`

## 🔄 Étape 6 : Gérer les mises à jour

### Mettre à jour le code

```bash
cd /var/www/garden-gold-green/garden-gold-green
git pull origin main
npm install
npm run build
pm2 restart garden-gold-green
```

### Voir les logs

```bash
pm2 logs garden-gold-green
```

### Redémarrer l'application

```bash
pm2 restart garden-gold-green
```

## ✅ Vérification

Une fois déployé, vérifiez :

- [ ] Le site s'affiche sur https://votredomaine.fr
- [ ] L'authentification fonctionne
- [ ] Les produits s'affichent
- [ ] Le panier fonctionne
- [ ] Les paiements Stripe fonctionnent
- [ ] Les webhooks Stripe reçoivent les événements
- [ ] Les emails sont envoyés

## 🐛 Dépannage

### Erreur de base de données
```bash
sudo systemctl status postgresql
sudo -u postgres psql -l
```

### Erreur Nginx
```bash
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### Erreur Node.js
```bash
pm2 logs garden-gold-green
pm2 status
```

### Problème de port
```bash
netstat -tulpn | grep 3000
```

## 🔐 Sécurité

### Firewall UFW

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Protection du fichier .env

```bash
chmod 600 .env
```

### Sauvegarde automatique

Créez un script de sauvegarde :

```bash
nano /var/www/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump garden_db > /var/backups/garden_db_$DATE.sql
tar -czf /var/backups/garden-files_$DATE.tar.gz /var/www/garden-gold-green
find /var/backups -name "*.sql" -mtime +30 -delete
find /var/backups -name "*.tar.gz" -mtime +30 -delete
```

Ajoutez à crontab :

```bash
crontab -e
# Ajouter cette ligne pour une sauvegarde quotidienne à 2h du matin
0 2 * * * /var/www/backup.sh
```

## 📊 Monitoring

### PM2 Monitoring

```bash
pm2 monit
```

### Installer PM2 Plus (optionnel)

```bash
pm2 link [secret_key]
```

## 🆘 Support

Pour toute question :
- Documentation IONOS : https://www.ionos.fr/assistance/
- Support IONOS : support@ionos.fr

---

**Bon déploiement ! 🚀**
