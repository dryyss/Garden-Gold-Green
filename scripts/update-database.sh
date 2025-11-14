#!/bin/bash

# Script pour mettre à jour la base de données après les changements du schéma Prisma

echo "🔄 Mise à jour de la base de données..."

# Générer le client Prisma
echo "📦 Génération du client Prisma..."
npx prisma generate

# Appliquer les migrations
echo "🚀 Application des migrations..."
npx prisma db push

echo "✅ Base de données mise à jour avec succès!"

# Créer un utilisateur admin si demandé
read -p "Voulez-vous créer un utilisateur admin maintenant? (o/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Oo]$ ]]
then
    read -p "Email: " email
    read -sp "Mot de passe: " password
    echo
    tsx scripts/create-admin-user.ts "$email" "$password"
fi

echo "🎉 Terminé!"

