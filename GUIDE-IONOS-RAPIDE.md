# 🚀 Guide Rapide IONOS avec Votre Nom de Domaine

## ✅ Ce dont vous avez besoin

- ✅ Serveur VPS IONOS (pas hébergement partagé)
- ✅ Nom de domaine configuré
- ✅ Accès SSH au serveur
- ✅ 30 minutes de temps

## 🎯 Étapes Rapides

### Étape 1 : Connexion au serveur

```bash
ssh root@votredomaine.fr
# ou 
ssh root@IP_DE_VOTRE_SERVEUR
```

### Étape 2 : Installer Node.js

```bash
# Installer NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Installer Node.js
nvm install --lts
nvm use --lts
node --version  # Doit afficher v20.x.x ou v18.x.x

# Installer PM2 pour gérer l'application
npm install -g pm2
```

### Étape 3 : Installer PostgreSQL

```bash
# Installer PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib -y

# Démarrer PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Créer la base de données
sudo -u postgres psql

# Dans PostgreSQL, exécutez :
CREATE DATABASE garden_db;
CREATE USER garden_user WITH PASSWORD 'VotreMotDePasseFort123!';
GRANT ALL PRIVILEGES ON DATABASE garden_db TO garden_user;
\q
```

### Étape 4 : Installer Nginx

```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Étape 5 : Cloner votre projet

```bash
cd /var/www
git clone https://github.com/dryyss/Garden-Gold-Green.git garden-gold-green
cd garden-gold-green/garden-gold-green

# Installer les dépendances
npm install
```

### Étape 6 : Configurer l'environnement

```bash
# Créer le fichier .env
nano .env
```

Ajoutez ces variables (remplacez par vos valeurs) :

```env
# Base de données
DATABASE_URL="postgresql://garden_user:VotreMotDePasseFort123!@localhost:5432/garden_db"

# Générer un secret avec : openssl rand -hex 32
AUTH0_SECRET="générez-un-secret-securise"
AUTH0_BASE_URL="https://votredomaine.fr"
AUTH0_ISSUER_BASE_URL="https://votre-tenant.auth0.com"
AUTH0_CLIENT_ID="votre-client-id"
AUTH0_CLIENT_SECRET="votre-client-secret"

NEXTAUTH_URL="https://votredomaine.fr"
NEXTAUTH_SECRET="générez-un-secret-securise"

JWT_SECRET="générez-un-secret-securise"

STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

NEXT_PUBLIC_APP_URL="https://votredomaine.fr"
NEXT_PUBLIC_BASE_URL="https://votredomaine.fr"

NODE_ENV="production"
```

**Générer les secrets :**
```bash
openssl rand -hex 32
```
(Copiez le résultat pour AUTH0_SECRET, NEXTAUTH_SECRET, JWT_SECRET)

Sauvegardez avec `CTRL+O`, puis `CTRL+X`

### Étape 7 : Configurer Nginx pour votre domaine

```bash
sudo nano /etc/nginx/sites-available/garden-gold-green
```

Ajoutez cette configuration (remplacez **votredomaine.fr** par votre domaine) :

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

Activer le site :
```bash
sudo ln -s /etc/nginx/sites-available/garden-gold-green /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Étape 8 : Configurer SSL (HTTPS) avec Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d votredomaine.fr -d www.votredomaine.fr
```

Suivez les instructions (entre votre email, acceptez les conditions).

### Étape 9 : Construire et lancer l'application

```bash
cd /var/www/garden-gold-green/garden-gold-green

# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy

# Construire l'application
npm run build

# Lancer avec PM2
pm2 start npm --name "garden-gold-green" -- start

# Sauvegarder la configuration PM2
pm2 save
pm2 startup
```

### Étape 10 : Vérifier

Votre site devrait être accessible sur : **https://votredomaine.fr**

## 🔧 Configuration du Domaine IONOS

Dans votre panel IONOS :
1. Allez dans "Domains"
2. Trouvez votre domaine
3. Configurez les DNS :
   - **Type A** : Point vers l'IP de votre serveur VPS
   - **Type CNAME** : www → votredomaine.fr

## 🔄 Mettre à jour l'application

```bash
cd /var/www/garden-gold-green/garden-gold-green
git pull
npm install
npm run build
pm2 restart garden-gold-green
```

## 🐛 Problèmes Courants

### L'application ne démarre pas
```bash
pm2 logs garden-gold-green
```

### Erreur de base de données
```bash
sudo systemctl status postgresql
```

### Erreur Nginx
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### Port 3000 déjà utilisé
```bash
lsof -i :3000
kill -9 [PID]
```

## ✅ Checklist de vérification

- [ ] Node.js installé
- [ ] PostgreSQL installé et base créée
- [ ] Nginx configuré
- [ ] SSL configuré (HTTPS)
- [ ] Application lancée avec PM2
- [ ] DNS configuré
- [ ] Application accessible sur votre domaine

## 🆘 Besoin d'aide ?

- Consultez les logs : `pm2 logs garden-gold-green`
- Vérifiez Nginx : `sudo systemctl status nginx`
- Vérifiez PostgreSQL : `sudo systemctl status postgresql`

---

**Votre site est maintenant en ligne ! 🎉**

