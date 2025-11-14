# Script PowerShell pour mettre à jour la base de données après les changements du schéma Prisma

Write-Host "🔄 Mise à jour de la base de données..." -ForegroundColor Cyan

# Générer le client Prisma
Write-Host "📦 Génération du client Prisma..." -ForegroundColor Yellow
npx prisma generate

# Appliquer les migrations
Write-Host "🚀 Application des migrations..." -ForegroundColor Yellow
npx prisma db push

Write-Host "✅ Base de données mise à jour avec succès!" -ForegroundColor Green

# Créer un utilisateur admin si demandé
$createAdmin = Read-Host "Voulez-vous créer un utilisateur admin maintenant? (o/n)"
if ($createAdmin -eq "o" -or $createAdmin -eq "O") {
    $email = Read-Host "Email"
    $password = Read-Host "Mot de passe" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
    $plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    tsx scripts/create-admin-user.ts $email $plainPassword
}

Write-Host "🎉 Terminé!" -ForegroundColor Green

