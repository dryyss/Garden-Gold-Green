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
  
  try {
    // Générer le client Prisma
    console.log('📦 Génération du client Prisma...');
    execSync('npx prisma generate', { 
      stdio: 'inherit',
      env: { ...process.env }
    });
    
    // Appliquer les migrations (sans échec si aucune migration)
    console.log('🗄️  Application des migrations Prisma...');
    try {
      execSync('npx prisma migrate deploy', { 
        stdio: 'inherit',
        env: { ...process.env }
      });
    } catch (error) {
      // Si pas de migrations ou erreur non bloquante, continuer
      if (error.status !== 0) {
        console.log('⚠️  Aucune migration à appliquer ou erreur (non bloquant)');
      }
    }
    
    // Construire l'application Next.js
    console.log('🏗️  Construction de l\'application Next.js...');
    execSync('next build', { 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
    
    console.log('✅ Build terminé avec succès!');
    return true;
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
  console.log('🔍 Vérification du build de production...');
  
  if (!buildExists()) {
    console.log('⚠️  Aucun build de production trouvé');
    buildApplication();
  } else {
    console.log('✅ Build de production trouvé');
  }
  
  // Démarrer l'application
  startApplication();
}

// Exécuter le script
main();

