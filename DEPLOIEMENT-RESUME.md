# 🚀 Résumé des Modifications pour le Déploiement IONOS

## ✅ Modifications Effectuées

### 1. Configuration de la Base de Données

**Avant** : SQLite (incompatible avec la production)
**Après** : PostgreSQL (production-ready)

Fichiers modifiés :
- `prisma/schema.prisma` : Changé le provider de `sqlite` à `postgresql`
- `env.example` : Mise à jour de la DATABASE_URL pour PostgreSQL

### 2. Documentation de Déploiement

**Nouveaux fichiers** :
- `DEPLOYMENT.md` : Guide complet de déploiement sur IONOS avec :
  - Installation de Node.js, PostgreSQL, PM2
  - Configuration de Nginx comme reverse proxy
  - Configuration de SSL avec Let's Encrypt
  - Commandes de déploiement étape par étape
  - Scripts de sauvegarde
  - Dépannage

### 3. Script de Déploiement Automatique

**Nouveau fichier** : `deploy.sh`

Ce script automatise :
- L'installation des dépendances
- La génération du client Prisma
- La construction de l'application
- Le démarrage avec PM2
- Les redémarrages automatiques

### 4. Mise à jour du README

**Modifications** :
- Référence au guide de déploiement
- IONOS ajouté comme plateforme principale
- Mise à jour de l'information sur la base de données

## 📋 Prochaines Étapes

### Sur votre serveur IONOS :

1. **Connectez-vous en SSH** à votre serveur IONOS

2. **Clonez votre projet** :
```bash
cd /var/www
git clone https://github.com/votre-repo/Garden-Gold-Green.git garden-gold-green
cd garden-gold-green/garden-gold-green
```

3. **Installez les prérequis** (suivre DEPLOYMENT.md) :
- Node.js 18+
- PostgreSQL
- PM2
- Nginx

4. **Configurez l'environnement** :
```bash
cp env.example .env
nano .env  # Remplissez avec vos valeurs
```

5. **Lancez le déploiement** :
```bash
chmod +x deploy.sh
./deploy.sh
```

6. **Configurez Nginx** (suivre DEPLOYMENT.md section 2)

7. **Configurez SSL** (suivre DEPLOYMENT.md section 2.3)

## 🔑 Variables d'Environnement Requises

Les variables suivantes doivent être configurées dans votre `.env` :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/garden_db"
AUTH0_SECRET="généré avec openssl rand -hex 32"
AUTH0_BASE_URL="https://votredomaine.fr"
AUTH0_ISSUER_BASE_URL="https://votre-tenant.auth0.com"
AUTH0_CLIENT_ID="votre-client-id"
AUTH0_CLIENT_SECRET="votre-client-secret"
NEXTAUTH_URL="https://votredomaine.fr"
NEXTAUTH_SECRET="généré avec openssl rand -hex 32"
JWT_SECRET="généré avec openssl rand -hex 32"
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_APP_URL="https://votredomaine.fr"
NEXT_PUBLIC_BASE_URL="https://votredomaine.fr"
NODE_ENV="production"
```

## 📚 Ressources

- **Guide Complet** : `DEPLOYMENT.md`
- **Documentation IONOS** : https://www.ionos.fr/assistance/
- **Support IONOS** : support@ionos.fr

## ⚠️ Points Importants

1. **Ne commitez JAMAIS** votre fichier `.env` sur Git
2. Utilisez des **secrets différents** pour développement et production
3. Configurez le **firewall** (UFW) sur votre serveur
4. Mettez en place des **sauvegardes automatiques** (voir DEPLOYMENT.md)
5. Surveillez les **logs** avec `pm2 logs garden-gold-green`

## 🆘 En Cas de Problème

Consultez la section "Dépannage" dans `DEPLOYMENT.md`

---

**Bon déploiement ! 🌿✨**
