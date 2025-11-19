#!/bin/bash
# Script pour merger et pousser les modifications

echo "📦 Staging des fichiers..."
git add .

echo "💾 Création du commit..."
git commit -m "Fix ProductQuiz categoryTags type error"

echo "🔄 Pull des dernières modifications de origin/main..."
git pull origin main --no-edit

echo "🚀 Push vers origin/main..."
git push origin main

echo "✅ Terminé!"


