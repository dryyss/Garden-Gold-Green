#!/bin/bash

# Script de déploiement pour Garden Gold Green sur IONOS
# Usage: ./deploy.sh

set -e

echo "🚀 Déploiement de Garden Gold Green..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier si on est dans le bon répertoire
if [ ! -f "package.json" ]; then
    log_error "Fichier package.json introuvable. Êtes-vous dans le répertoire du projet ?"
    exit 1
fi

# Vérifier si .env existe
if [ ! -f ".env" ]; then
    log_warning "Fichier .env introuvable. Créez-en un depuis env.example"
    cp env.example .env
    log_info "Fichier .env créé depuis env.example. Veuillez le remplir avec vos variables d'environnement"
    exit 1
fi

log_info "Installation des dépendances..."
npm install

log_info "Génération du client Prisma..."
npx prisma generate

log_info "Application des migrations de base de données..."
npx prisma migrate deploy

log_info "Construction de l'application..."
npm run build

log_info "Application construite avec succès !"

# Vérifier si PM2 est installé
if command -v pm2 &> /dev/null; then
    log_info "PM2 détecté. Démarrage de l'application..."
    
    # Vérifier si l'application est déjà en cours d'exécution
    if pm2 list | grep -q "garden-gold-green"; then
        log_info "Redémarrage de l'application..."
        pm2 restart garden-gold-green
    else
        log_info "Démarrage de l'application..."
        pm2 start npm --name "garden-gold-green" -- start
        pm2 save
    fi
    
    log_info "Application démarrée avec PM2"
    log_info "Pour voir les logs: pm2 logs garden-gold-green"
    log_info "Pour voir le statut: pm2 status"
else
    log_warning "PM2 n'est pas installé. Installation de PM2..."
    npm install -g pm2
    
    log_info "Démarrage de l'application avec PM2..."
    pm2 start npm --name "garden-gold-green" -- start
    pm2 save
    
    log_info "Pour que PM2 démarre au boot: pm2 startup"
fi

log_info "✅ Déploiement terminé avec succès !"

echo ""
echo "📋 Prochaines étapes:"
echo "1. Configurez votre serveur web (Nginx/Apache) pour proxifier les requêtes vers localhost:3000"
echo "2. Configurez SSL avec Let's Encrypt pour HTTPS: sudo certbot --nginx -d VOTRE_DOMAINE.fr"
echo "3. Vérifiez que l'application fonctionne: pm2 logs garden-gold-green"
echo ""
echo "📖 Pour plus d'informations, consultez GUIDE-DEPLOIEMENT-COMPLET.md"






