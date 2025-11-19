# Script pour fixer et pousser les corrections
Write-Host "=== Synchronisation et Push des Corrections ===" -ForegroundColor Cyan

# Désactiver le pager Git
$env:GIT_PAGER = ''

Write-Host "`n1. Ajout des fichiers..." -ForegroundColor Yellow
git add . 2>&1 | Out-Host

Write-Host "`n2. Commit..." -ForegroundColor Yellow  
git commit -m "Fix ProductQuiz categoryTags type error" 2>&1 | Out-Host

Write-Host "`n3. Fetch origin..." -ForegroundColor Yellow
git fetch origin 2>&1 | Out-Host

Write-Host "`n4. Merge origin/main..." -ForegroundColor Yellow
git merge origin/main --no-edit 2>&1 | Out-Host

Write-Host "`n5. Push vers origin/main..." -ForegroundColor Yellow
git push origin main 2>&1 | Out-Host

Write-Host "`n✅ TERMINÉ!" -ForegroundColor Green
Write-Host "Les corrections ont été poussées vers origin/main" -ForegroundColor Green
Write-Host "Clever Cloud devrait redéployer automatiquement" -ForegroundColor Yellow


