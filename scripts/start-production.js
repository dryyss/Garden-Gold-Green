#!/usr/bin/env node

/**
 * Script de démarrage en production pour Clever Cloud
 * Vérifie si le build existe, sinon le construit avant de démarrer
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const NEXT_DIR = path.join(process.cwd(), '.next');
const BUILD_ID_FILE = path.join(NEXT_DIR, 'BUILD_ID');

/**
 * Configure DATABASE_URL from Clever Cloud variables if not set
 */
function configureDatabaseUrl() {
  // Vérifier d'abord si DATABASE_URL est déjà définie
  if (process.env.DATABASE_URL) {
    console.log('ℹ️  DATABASE_URL est déjà définie');
    return true;
  }
  
  // Si DATABASE_URL n'est pas définie, utiliser POSTGRESQL_ADDON_URI (Clever Cloud)
  if (process.env.POSTGRESQL_ADDON_URI) {
    process.env.DATABASE_URL = process.env.POSTGRESQL_ADDON_URI;
    console.log('✅ DATABASE_URL configurée à partir de POSTGRESQL_ADDON_URI');
    return true;
  }
  
  // Si toujours pas de DATABASE_URL, essayer de la construire depuis les variables individuelles
  if (process.env.POSTGRESQL_ADDON_HOST) {
    const host = process.env.POSTGRESQL_ADDON_HOST;
    const db = process.env.POSTGRESQL_ADDON_DB;
    const user = process.env.POSTGRESQL_ADDON_USER;
    const password = process.env.POSTGRESQL_ADDON_PASSWORD;
    const port = process.env.POSTGRESQL_ADDON_PORT || '5432';
    
    if (host && db && user && password) {
      process.env.DATABASE_URL = `postgresql://${user}:${password}@${host}:${port}/${db}?schema=public`;
      console.log('✅ DATABASE_URL construite à partir des variables POSTGRESQL_ADDON_*');
      return true;
    } else {
      console.warn('⚠️  Variables POSTGRESQL_ADDON_* incomplètes:', {
        host: !!host,
        db: !!db,
        user: !!user,
        password: !!password,
        port: port
      });
    }
  }
  
  // Si toujours pas de DATABASE_URL, afficher un avertissement
  console.warn('⚠️  DATABASE_URL n\'est pas définie');
  const availableVars = Object.keys(process.env).filter(key => 
    key.includes('POSTGRESQL') || key.includes('DATABASE')
  );
  if (availableVars.length > 0) {
    console.warn('Variables disponibles:', availableVars.join(', '));
  } else {
    console.warn('Aucune variable PostgreSQL trouvée dans l\'environnement');
  }
  
  // Ne pas bloquer si DATABASE_URL n'est pas disponible (pour le build Next.js)
  // Mais retourner false pour que les migrations Prisma soient ignorées
  return false;
}

function buildExists() {
  try {
    // Vérifier si le répertoire .next existe
    if (!fs.existsSync(NEXT_DIR)) {
      return false;
    }
    
    // Vérifier si BUILD_ID existe (fichier créé par next build)
    if (!fs.existsSync(BUILD_ID_FILE)) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

function buildApplication() {
  console.log('🔨 Build de production non trouvé. Construction de l\'application...');
  
  // Configurer DATABASE_URL avant de construire (ne bloque pas si elle n'est pas disponible)
  const hasDatabaseUrl = configureDatabaseUrl();
  
  if (!hasDatabaseUrl) {
    console.warn('⚠️  DATABASE_URL n\'est pas disponible - les migrations seront ignorées');
    console.warn('⚠️  Le build Next.js continuera, mais la connexion à la base de données pourrait échouer');
  }
  
  try {
    // Générer le client Prisma (ne nécessite pas DATABASE_URL)
    console.log('📦 Génération du client Prisma...');
    try {
      execSync('npx prisma generate', { 
        stdio: 'inherit',
        env: { ...process.env }
      });
      console.log('✅ Client Prisma généré avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la génération du client Prisma:', error.message);
      // Même si la génération échoue, continuer avec le build Next.js
      console.warn('⚠️  Continuation du build...');
    }
    
    // Appliquer les migrations (seulement si DATABASE_URL est disponible)
    if (hasDatabaseUrl) {
      console.log('🗄️  Application des migrations Prisma...');
      try {
        execSync('npx prisma migrate deploy', { 
          stdio: 'inherit',
          env: { ...process.env }
        });
        console.log('✅ Migrations Prisma appliquées avec succès');
      } catch (error) {
        // Vérifier le code de sortie
        const exitCode = error.status || error.code || 1;
        const errorOutput = (error.stderr || error.stdout || '').toString();
        
        // Si l'erreur est liée à l'absence de migrations, c'est OK
        if (errorOutput.includes('No migrations found') || errorOutput.includes('no migration')) {
          console.log('ℹ️  Aucune migration à appliquer (normal pour une nouvelle base de données)');
        } else if (errorOutput.includes('Environment variable not found: DATABASE_URL')) {
          console.error('❌ DATABASE_URL n\'est toujours pas disponible pour les migrations');
          console.error('Vérifiez que POSTGRESQL_ADDON_URI ou les variables POSTGRESQL_ADDON_* sont définies');
          console.log('⚠️  Continuation du build sans migrations...');
        } else {
          console.log(`⚠️  Erreur lors des migrations (code ${exitCode}): ${error.message}`);
          console.log('⚠️  Continuation du build...');
        }
      }
    } else {
      console.log('⚠️  Migrations Prisma ignorées (DATABASE_URL non disponible)');
    }
    
    // Construire l'application Next.js
    console.log('🏗️  Construction de l\'application Next.js...');
    console.log('⏳ Cela peut prendre plusieurs minutes...');
    
    const startTime = Date.now();
    try {
      execSync('next build', { 
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'production' },
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer pour les logs
      });
      
      const duration = Math.round((Date.now() - startTime) / 1000);
      console.log(`✅ Build terminé avec succès en ${duration} secondes!`);
      return true;
    } catch (error) {
      const duration = Math.round((Date.now() - startTime) / 1000);
      console.error(`❌ Erreur lors du build après ${duration} secondes`);
      throw error;
    }
  } catch (error) {
    console.error('❌ Erreur lors du build:', error.message);
    if (error.stdout) console.error('stdout:', error.stdout.toString());
    if (error.stderr) console.error('stderr:', error.stderr.toString());
    process.exit(1);
  }
}

function startApplication() {
  console.log('🚀 Démarrage de l\'application Next.js...');
  // Utiliser spawn pour éviter que le processus parent ne soit bloqué
  const { spawn } = require('child_process');
  const nextProcess = spawn('next', ['start'], {
    stdio: 'inherit',
    shell: true
  });
  
  nextProcess.on('error', (error) => {
    console.error('❌ Erreur lors du démarrage:', error.message);
    process.exit(1);
  });
  
  nextProcess.on('exit', (code) => {
    process.exit(code || 0);
  });
  
  // Gérer la terminaison propre
  process.on('SIGTERM', () => {
    nextProcess.kill('SIGTERM');
  });
  
  process.on('SIGINT', () => {
    nextProcess.kill('SIGINT');
  });
}

// Fonction principale
function main() {
  // Configurer DATABASE_URL dès le début (important pour Prisma)
  configureDatabaseUrl();
  
  console.log('🔍 Vérification du build de production...');
  
  if (!buildExists()) {
    console.log('⚠️  Aucun build de production trouvé');
    buildApplication();
  } else {
    console.log('✅ Build de production trouvé');
    // S'assurer que DATABASE_URL est configurée même si le build existe
    configureDatabaseUrl();
  }
  
  // Démarrer l'application
  startApplication();
}

// Exécuter le script
main();

