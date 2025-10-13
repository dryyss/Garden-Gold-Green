#!/usr/bin/env node

/**
 * Script pour remplacer toutes les images via.placeholder.com par des images locales
 */

const fs = require('fs');
const path = require('path');

console.log('🖼️ Remplacement des images placeholder...\n');

// Mappage des URLs placeholder vers les images locales
const imageMapping = {
  'https://via.placeholder.com/400x288/00C853/FFFFFF?text=CBD+Oil+10%25': '/products/cbd-oil-10.svg',
  'https://via.placeholder.com/400x288/00C853/FFFFFF?text=CBD+Oil+20%25': '/products/cbd-oil-20.svg',
  'https://via.placeholder.com/400x288/FFD700/000000?text=CBD+Cream+2%25': '/products/cbd-cream.svg',
  'https://via.placeholder.com/400x288/C0C0C0/000000?text=CBD+Gummies+25mg': '/products/cbd-gummies.svg',
  'https://via.placeholder.com/400x288/00C853/FFFFFF?text=CBD+Capsules+15mg': '/products/cbd-capsules.svg',
  'https://via.placeholder.com/400x288/FFD700/000000?text=Vape+Pen+Kit': '/products/vape-pen.svg',
  'https://via.placeholder.com/400x288/00C853/FFFFFF?text=Massage+Oil+8%25': '/products/massage-oil.svg',
  'https://via.placeholder.com/400x288/C0C0C0/000000?text=Sleep+Gummies+50mg': '/products/sleep-gummies.svg',
  'https://via.placeholder.com/400x288/FFD700/000000?text=Face+Serum+3%25': '/products/face-serum.svg',
  'https://via.placeholder.com/400x288/00C853/FFFFFF?text=Pet+Treats+1%25': '/products/pet-treats.svg',
  'https://via.placeholder.com/400x288/00C853/FFFFFF?text=CBD%2520Tincture%252010%2525': '/products/tincture.svg',
  'https://via.placeholder.com/400x288/FFD700/000000?text=CBD%2520Vape%2520Juice%252020%2525': '/products/vape-juice.svg',
  
  // Patterns génériques
  'CBD+Oil+10%25': 'cbd-oil-10.svg',
  'CBD+Oil+20%25': 'cbd-oil-20.svg',
  'CBD+Cream+2%25': 'cbd-cream.svg',
  'CBD+Gummies+25mg': 'cbd-gummies.svg',
  'CBD+Capsules+15mg': 'cbd-capsules.svg',
  'Vape+Pen+Kit': 'vape-pen.svg',
  'Massage+Oil+8%25': 'massage-oil.svg',
  'Sleep+Gummies+50mg': 'sleep-gummies.svg',
  'Face+Serum+3%25': 'face-serum.svg',
  'Pet+Treats+1%25': 'pet-treats.svg',
  'CBD%2520Tincture%252010%2525': 'tincture.svg',
  'CBD%2520Vape%2520Juice%252020%2525': 'vape-juice.svg'
};

// Fichiers à traiter
const filesToProcess = [
  'src/data/products.json',
  'src/app/page.tsx',
  'src/app/[locale]/page.tsx',
  'src/app/[locale]/learn/page.tsx',
  'src/app/[locale]/orders/page.tsx',
  'src/app/[locale]/account/favorites/page.tsx',
  'src/app/[locale]/blog/[slug]/page.tsx',
  'src/app/[locale]/blog/page.tsx'
];

let totalReplacements = 0;

filesToProcess.forEach(filePath => {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️ Fichier non trouvé: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf-8');
  let fileReplacements = 0;
  
  // Remplacer les URLs complètes
  Object.entries(imageMapping).forEach(([placeholder, localImage]) => {
    if (placeholder.includes('https://via.placeholder.com')) {
      const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, localImage);
        fileReplacements += matches.length;
      }
    }
  });
  
  // Remplacer les patterns génériques
  content = content.replace(/https:\/\/via\.placeholder\.com\/400x288\/([^\/]+)\/([^\/\?]+)\?text=([^"]+)/g, (match, bgColor, textColor, text) => {
    // Déterminer l'image locale basée sur le texte
    let localImage = '/products/default.svg';
    
    if (text.includes('Oil+10%25')) localImage = '/products/cbd-oil-10.svg';
    else if (text.includes('Oil+20%25')) localImage = '/products/cbd-oil-20.svg';
    else if (text.includes('Cream+2%25')) localImage = '/products/cbd-cream.svg';
    else if (text.includes('Gummies+25mg')) localImage = '/products/cbd-gummies.svg';
    else if (text.includes('Capsules+15mg')) localImage = '/products/cbd-capsules.svg';
    else if (text.includes('Vape+Pen+Kit')) localImage = '/products/vape-pen.svg';
    else if (text.includes('Massage+Oil+8%25')) localImage = '/products/massage-oil.svg';
    else if (text.includes('Sleep+Gummies+50mg')) localImage = '/products/sleep-gummies.svg';
    else if (text.includes('Face+Serum+3%25')) localImage = '/products/face-serum.svg';
    else if (text.includes('Pet+Treats+1%25')) localImage = '/products/pet-treats.svg';
    else if (text.includes('Tincture')) localImage = '/products/tincture.svg';
    else if (text.includes('Vape+Juice')) localImage = '/products/vape-juice.svg';
    
    fileReplacements++;
    return localImage;
  });
  
  if (fileReplacements > 0) {
    fs.writeFileSync(fullPath, content);
    console.log(`✅ ${filePath}: ${fileReplacements} remplacements`);
    totalReplacements += fileReplacements;
  }
});

console.log(`\n🎉 Total: ${totalReplacements} images remplacées !`);
console.log('\n📁 Images créées dans public/products/:');
console.log('   - cbd-oil-10.svg');
console.log('   - cbd-oil-20.svg');
console.log('   - cbd-cream.svg');
console.log('   - cbd-gummies.svg');
console.log('   - cbd-capsules.svg');
console.log('   - vape-pen.svg');
console.log('   - massage-oil.svg');
console.log('   - sleep-gummies.svg');
console.log('   - face-serum.svg');
console.log('   - pet-treats.svg');
console.log('   - tincture.svg');
console.log('   - vape-juice.svg');

console.log('\n🚀 Les images ne devraient plus générer d\'erreurs 500 !');
