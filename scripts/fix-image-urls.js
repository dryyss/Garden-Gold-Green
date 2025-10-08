const fs = require('fs');
const path = require('path');

// Lire le fichier products.json
const productsPath = path.join(__dirname, '../src/data/products.json');
let content = fs.readFileSync(productsPath, 'utf-8');

console.log('🔍 Recherche des URLs d\'images avec encodage incorrect...');

// Compter les occurrences avant correction
const countBefore = (content.match(/%25/g) || []).length;
console.log(`📊 Trouvé ${countBefore} occurrences de %25`);

// Remplacer %2525 par %25 (double encodage)
content = content.replace(/%2525/g, '%25');

// Remplacer %252B par + (espace encodé)
content = content.replace(/%252B/g, '+');

// Remplacer les autres encodages doubles
content = content.replace(/%2520/g, ' ');
content = content.replace(/%253D/g, '=');
content = content.replace(/%253F/g, '?');
content = content.replace(/%2526/g, '&');

// Compter les occurrences après correction
const countAfter = (content.match(/%2525/g) || []).length;

console.log(`✨ Correction terminée`);
console.log(`📉 %2525 restants: ${countAfter}`);

// Sauvegarder le fichier corrigé
fs.writeFileSync(productsPath, content, 'utf-8');

console.log('✅ Fichier products.json corrigé !');

