# Script pour commit et push les modifications
$env:GIT_PAGER = 'cat'

Write-Host "📦 Staging des fichiers..."
git add .

Write-Host "💾 Création du commit..."
git commit -m "Fix ProductQuiz categoryTags type error"

Write-Host "🚀 Push vers origin/main..."
git push origin main

Write-Host "✅ Terminé!"


