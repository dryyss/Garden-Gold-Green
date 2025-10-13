#!/usr/bin/env node

/**
 * Script de vérification de la configuration Auth0
 * Exécutez : node scripts/check-auth0-config.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration Auth0...\n');

let hasErrors = false;

// Vérifier l'existence de .env.local
const envLocalPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envLocalPath)) {
  console.error('❌ ERREUR : Le fichier .env.local n\'existe pas !');
  console.error('   📝 Créez-le avec le contenu de CREER_ENV_LOCAL.md\n');
  hasErrors = true;
} else {
  console.log('✅ Le fichier .env.local existe');
  
  // Lire et vérifier les variables
  const envContent = fs.readFileSync(envLocalPath, 'utf-8');
  const requiredVars = [
    'AUTH0_SECRET',
    'AUTH0_BASE_URL',
    'AUTH0_ISSUER_BASE_URL',
    'AUTH0_CLIENT_ID',
    'AUTH0_CLIENT_SECRET'
  ];
  
  let allVarsPresent = true;
  requiredVars.forEach(varName => {
    if (!envContent.includes(varName + '=')) {
      console.error(`❌ ERREUR : Variable ${varName} manquante dans .env.local`);
      allVarsPresent = false;
      hasErrors = true;
    }
  });
  
  if (allVarsPresent) {
    console.log('✅ Toutes les variables Auth0 sont présentes');
  }
  
  // Vérifier que les valeurs ne sont pas les placeholders
  if (envContent.includes('your-auth0-secret-here') || 
      envContent.includes('use-openssl-rand-hex-32')) {
    console.error('❌ ERREUR : AUTH0_SECRET contient encore un placeholder');
    console.error('   📝 Utilisez le secret fourni dans CREER_ENV_LOCAL.md\n');
    hasErrors = true;
  }
  
  if (envContent.includes('your-client-secret-here')) {
    console.error('❌ ERREUR : AUTH0_CLIENT_SECRET contient encore un placeholder');
    hasErrors = true;
  }
}

// Vérifier la route API
const routePath = path.join(__dirname, '..', 'src', 'app', 'api', 'auth', '[auth0]', 'route.ts');
if (!fs.existsSync(routePath)) {
  console.error('❌ ERREUR : Route API Auth0 manquante');
  console.error('   📝 Le fichier src/app/api/auth/[auth0]/route.ts n\'existe pas\n');
  hasErrors = true;
} else {
  console.log('✅ Route API Auth0 existe');
  
  // Vérifier le contenu
  const routeContent = fs.readFileSync(routePath, 'utf-8');
  if (!routeContent.includes('handleAuth')) {
    console.error('❌ ERREUR : La route API ne contient pas handleAuth');
    hasErrors = true;
  } else if (routeContent.includes('handleAuth()')) {
    console.error('❌ ERREUR : Syntaxe incorrecte - utilisez "handleAuth" au lieu de "handleAuth()"');
    hasErrors = true;
  } else {
    console.log('✅ Route API correctement configurée');
  }
}

// Vérifier le package.json
const packagePath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  if (packageJson.dependencies && packageJson.dependencies['@auth0/nextjs-auth0']) {
    console.log(`✅ Package @auth0/nextjs-auth0 installé (v${packageJson.dependencies['@auth0/nextjs-auth0']})`);
  } else {
    console.error('❌ ERREUR : Package @auth0/nextjs-auth0 non installé');
    console.error('   📝 Exécutez : npm install @auth0/nextjs-auth0\n');
    hasErrors = true;
  }
}

console.log('\n' + '='.repeat(60));

if (hasErrors) {
  console.log('❌ Configuration incomplète - Corrigez les erreurs ci-dessus');
  console.log('\n📚 Consultez :');
  console.log('   - CREER_ENV_LOCAL.md pour créer .env.local');
  console.log('   - README_AUTH0.md pour le guide complet');
  process.exit(1);
} else {
  console.log('✅ Configuration Auth0 OK !');
  console.log('\n🚀 Vous pouvez lancer : npm run dev');
  console.log('📝 N\'oubliez pas de configurer Auth0 Dashboard (voir README_AUTH0.md)');
  process.exit(0);
}

