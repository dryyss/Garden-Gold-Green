# Script PowerShell pour créer la base de données PostgreSQL
# Ce script vous guide pour créer la base de données et l'utilisateur

Write-Host "🐘 Configuration de PostgreSQL pour Garden Gold Green" -ForegroundColor Cyan
Write-Host ""

# Vérifier si psql est disponible
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue

if (-not $psqlPath) {
    Write-Host "❌ psql n'est pas trouvé dans le PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Yellow
    Write-Host "1. Ajouter PostgreSQL au PATH" -ForegroundColor White
    Write-Host "   C:\Program Files\PostgreSQL\18\bin" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Ou exécutez manuellement dans pgAdmin ou psql:" -ForegroundColor White
    Write-Host "   psql -U postgres -f scripts/setup-postgres-db.sql" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "✅ psql trouvé: $($psqlPath.Source)" -ForegroundColor Green
Write-Host ""

# Demander le mot de passe postgres
Write-Host "Entrez le mot de passe de l'utilisateur 'postgres':" -ForegroundColor Yellow
$postgresPassword = Read-Host -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($postgresPassword)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Créer les commandes SQL
$sqlCommands = @"
-- Créer l'utilisateur
DO `$`$`$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'garden_user') THEN
    CREATE USER garden_user WITH PASSWORD 'dit8oand';
  END IF;
END
`$`$`$;

-- Créer la base de données
SELECT 'CREATE DATABASE garden_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'garden_db')\gexec
"@

Write-Host "🔧 Création de l'utilisateur et de la base de données..." -ForegroundColor Cyan

try {
    # Exécuter les commandes
    $env:PGPASSWORD = $plainPassword
    $sqlCommands | & $psqlPath.Source -U postgres -d postgres
    
    Write-Host ""
    Write-Host "✅ Configuration terminée!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Prochaines étapes:" -ForegroundColor Yellow
    Write-Host "1. npm run db:push" -ForegroundColor White
    Write-Host "2. npm run db:migrate-all" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "❌ Erreur: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Exécutez manuellement dans psql:" -ForegroundColor Yellow
    Write-Host "psql -U postgres -f scripts/setup-postgres-db.sql" -ForegroundColor White
} finally {
    Remove-Variable -Name PGPASSWORD -ErrorAction SilentlyContinue
}

