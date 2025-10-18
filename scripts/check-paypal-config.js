#!/usr/bin/env node

/**
 * Script de vérification de la configuration PayPal
 * Usage: node scripts/check-paypal-config.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration PayPal...\n');

// Vérifier si .env.local existe
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ Fichier .env.local manquant');
  console.log('📝 Créez le fichier .env.local avec les variables PayPal');
  process.exit(1);
}

// Lire le fichier .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');

// Vérifier les variables PayPal
const paypalClientId = envLines.find(line => line.startsWith('PAYPAL_CLIENT_ID='));
const paypalClientSecret = envLines.find(line => line.startsWith('PAYPAL_CLIENT_SECRET='));
const appUrl = envLines.find(line => line.startsWith('NEXT_PUBLIC_APP_URL='));

console.log('📋 Configuration trouvée :');
console.log(`   PAYPAL_CLIENT_ID: ${paypalClientId ? '✅ Défini' : '❌ Manquant'}`);
console.log(`   PAYPAL_CLIENT_SECRET: ${paypalClientSecret ? '✅ Défini' : '❌ Manquant'}`);
console.log(`   NEXT_PUBLIC_APP_URL: ${appUrl ? '✅ Défini' : '❌ Manquant'}`);

if (paypalClientId && paypalClientSecret) {
  const clientId = paypalClientId.split('=')[1];
  const clientSecret = paypalClientSecret.split('=')[1];
  
  console.log('\n🔑 Détails des clés :');
  console.log(`   Client ID: ${clientId.substring(0, 10)}...`);
  console.log(`   Client Secret: ${clientSecret.substring(0, 10)}...`);
  
  // Vérifier le format des clés
  if (clientId.includes('your-paypal-client-id') || clientId === '') {
    console.log('⚠️  Client ID semble être une valeur par défaut');
  }
  
  if (clientSecret.includes('your-paypal-client-secret') || clientSecret === '') {
    console.log('⚠️  Client Secret semble être une valeur par défaut');
  }
  
  console.log('\n✅ Configuration PayPal semble correcte !');
  console.log('🚀 Vous pouvez maintenant tester PayPal');
} else {
  console.log('\n❌ Configuration PayPal incomplète');
  console.log('📖 Consultez CONFIGURATION_PAYPAL_URGENTE.md pour la configuration');
  process.exit(1);
}

// Vérifier les URLs de retour
if (appUrl) {
  const url = appUrl.split('=')[1];
  console.log(`\n🌐 URL de l'application: ${url}`);
  console.log('📝 Configurez ces URLs dans PayPal Developer :');
  console.log(`   Return URL: ${url}/checkout/success`);
  console.log(`   Cancel URL: ${url}/cart`);
}

console.log('\n🎯 Prochaines étapes :');
console.log('1. Redémarrez le serveur : npm run dev');
console.log('2. Testez PayPal sur la page panier');
console.log('3. Vérifiez les logs dans la console du navigateur');

