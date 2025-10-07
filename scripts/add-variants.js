const fs = require('fs');
const path = require('path');

// Lire le fichier products.json
const productsPath = path.join(__dirname, '../src/data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

// Grammages disponibles par catégorie
const weightsByCategory = {
  'huiles-cbd': [10, 30, 50], // ml
  'fleurs-cbd': [1, 3, 5, 10], // grammes
  'cosmetics-cbd': [30, 50, 100], // ml ou grammes selon le produit
  'capsules-cbd': [30, 60, 90], // nombre de capsules
  'edibles-cbd': [100, 250, 500], // grammes
};

// Fonction pour générer des variantes pour un produit
function generateVariants(product) {
  const category = product.categories[0]?.slug || 'huiles-cbd';
  const weights = weightsByCategory[category] || [10, 30, 50];
  
  // Créer des variantes
  const variants = weights.map((weight, index) => {
    // Prix augmente avec le grammage mais pas proportionnellement (dégressif)
    const basePrice = product.priceCents;
    let priceMultiplier;
    
    if (index === 0) {
      priceMultiplier = 1; // Prix de base
    } else if (index === 1) {
      priceMultiplier = 2.5; // ~-15% par unité
    } else if (index === 2) {
      priceMultiplier = 4; // ~-20% par unité
    } else {
      priceMultiplier = 6; // ~-25% par unité
    }
    
    const price = Math.round(basePrice * priceMultiplier);
    
    // Stock aléatoire
    const stock = Math.floor(Math.random() * 100) + 10;
    
    return {
      id: `${product.id}-v${index + 1}`,
      weight: weight,
      unit: category.includes('fleurs') || category.includes('edibles') ? 'g' : 
            category.includes('capsules') ? 'caps' : 'ml',
      priceCents: price,
      stock: stock,
      sku: `${product.sku}-${weight}`,
      isDefault: index === 0
    };
  });
  
  return variants;
}

// Mettre à jour chaque produit avec des variantes
const updatedProducts = products.map(product => {
  // Si le produit a déjà des variantes, on le laisse tel quel
  if (product.variants && product.variants.length > 0) {
    return product;
  }
  
  // Sinon, on génère des variantes
  const variants = generateVariants(product);
  
  return {
    ...product,
    variants: variants,
    // Garder le stock global pour rétrocompatibilité
    totalStock: variants.reduce((sum, v) => sum + v.stock, 0)
  };
});

// Sauvegarder le fichier mis à jour
fs.writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2), 'utf-8');

console.log('✅ Variantes ajoutées avec succès !');
console.log(`📦 ${updatedProducts.length} produits mis à jour`);
console.log(`🔢 Chaque produit a maintenant entre 3 et 4 variantes de grammage`);

const path = require('path');

// Lire le fichier products.json
const productsPath = path.join(__dirname, '../src/data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

// Grammages disponibles par catégorie
const weightsByCategory = {
  'huiles-cbd': [10, 30, 50], // ml
  'fleurs-cbd': [1, 3, 5, 10], // grammes
  'cosmetics-cbd': [30, 50, 100], // ml ou grammes selon le produit
  'capsules-cbd': [30, 60, 90], // nombre de capsules
  'edibles-cbd': [100, 250, 500], // grammes
};

// Fonction pour générer des variantes pour un produit
function generateVariants(product) {
  const category = product.categories[0]?.slug || 'huiles-cbd';
  const weights = weightsByCategory[category] || [10, 30, 50];
  
  // Créer des variantes
  const variants = weights.map((weight, index) => {
    // Prix augmente avec le grammage mais pas proportionnellement (dégressif)
    const basePrice = product.priceCents;
    let priceMultiplier;
    
    if (index === 0) {
      priceMultiplier = 1; // Prix de base
    } else if (index === 1) {
      priceMultiplier = 2.5; // ~-15% par unité
    } else if (index === 2) {
      priceMultiplier = 4; // ~-20% par unité
    } else {
      priceMultiplier = 6; // ~-25% par unité
    }
    
    const price = Math.round(basePrice * priceMultiplier);
    
    // Stock aléatoire
    const stock = Math.floor(Math.random() * 100) + 10;
    
    return {
      id: `${product.id}-v${index + 1}`,
      weight: weight,
      unit: category.includes('fleurs') || category.includes('edibles') ? 'g' : 
            category.includes('capsules') ? 'caps' : 'ml',
      priceCents: price,
      stock: stock,
      sku: `${product.sku}-${weight}`,
      isDefault: index === 0
    };
  });
  
  return variants;
}

// Mettre à jour chaque produit avec des variantes
const updatedProducts = products.map(product => {
  // Si le produit a déjà des variantes, on le laisse tel quel
  if (product.variants && product.variants.length > 0) {
    return product;
  }
  
  // Sinon, on génère des variantes
  const variants = generateVariants(product);
  
  return {
    ...product,
    variants: variants,
    // Garder le stock global pour rétrocompatibilité
    totalStock: variants.reduce((sum, v) => sum + v.stock, 0)
  };
});

// Sauvegarder le fichier mis à jour
fs.writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2), 'utf-8');

console.log('✅ Variantes ajoutées avec succès !');
console.log(`📦 ${updatedProducts.length} produits mis à jour`);
console.log(`🔢 Chaque produit a maintenant entre 3 et 4 variantes de grammage`);

