# Script pour synchroniser les branches et pousser les corrections
$ErrorActionPreference = "Stop"

Write-Host "🔍 Vérification de l'état Git..." -ForegroundColor Cyan
git status --short

Write-Host "`n📦 Ajout de tous les fichiers modifiés..." -ForegroundColor Cyan
git add .

Write-Host "💾 Création du commit..." -ForegroundColor Cyan
git commit -m "Fix ProductQuiz categoryTags type error and sync branches"

Write-Host "`n🔄 Récupération des dernières modifications de origin/main..." -ForegroundColor Cyan
git fetch origin main

Write-Host "🔄 Merge de origin/main..." -ForegroundColor Cyan
git merge origin/main --no-edit

Write-Host "`n🚀 Push vers origin/main..." -ForegroundColor Cyan
git push origin main

Write-Host "`n✅ Terminé! Les modifications ont été poussées vers origin/main" -ForegroundColor Green
Write-Host "Clever Cloud devrait maintenant redéployer avec la correction." -ForegroundColor Yellow


