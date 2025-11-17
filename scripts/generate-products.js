const fs = require('fs');
const path = require('path');

// Données de base pour générer les produits
const categories = [
  { name: "Huiles CBD", slug: "huiles-cbd" },
  { name: "Cosmétiques CBD", slug: "cosmetiques-cbd" },
  { name: "Fleurs CBD", slug: "fleurs-cbd" },
  { name: "Capsules CBD", slug: "capsules-cbd" },
  { name: "Vape CBD", slug: "vape-cbd" }
];

const productTypes = {
  "Huiles CBD": [
    "CBD Oil", "Full Spectrum Oil", "Broad Spectrum Oil", "Isolate Oil", 
    "CBD Tincture", "Sublingual Drops", "CBD Extract", "Raw CBD Oil"
  ],
  "Cosmétiques CBD": [
    "CBD Cream", "CBD Balm", "CBD Lotion", "CBD Serum", "CBD Face Mask",
    "CBD Body Butter", "CBD Lip Balm", "CBD Shampoo", "CBD Soap", "CBD Bath Bomb"
  ],
  "Fleurs CBD": [
    "CBD Gummies", "CBD Chocolates", "CBD Honey", "CBD Tea", "CBD Coffee",
    "CBD Cookies", "CBD Brownies", "CBD Energy Bar", "CBD Protein Powder"
  ],
  "Capsules CBD": [
    "CBD Capsules", "CBD Softgels", "CBD Pills", "CBD Tablets", "CBD Gel Caps"
  ],
  "Vape CBD": [
    "CBD Vape Juice", "CBD Cartridge", "CBD Disposable Pen", "CBD Pods", "CBD Wax"
  ]
};

const concentrations = [1, 2, 3, 5, 8, 10, 15, 20, 25, 30, 50];
const priceRanges = {
  "Huiles CBD": [1990, 2990, 3990, 4990, 5990, 6990, 7990, 8990],
  "Cosmétiques CBD": [1490, 2490, 3490, 4490, 5490, 6490, 7490],
  "Fleurs CBD": [1990, 2990, 3990, 4990, 5990, 6990],
  "Capsules CBD": [2990, 3990, 4990, 5990, 6990, 7990],
  "Vape CBD": [1990, 2990, 3990, 4990, 5990, 6990, 7990, 8990]
};

function generateProduct(id, category) {
  const categoryData = categories.find(c => c.slug === category.slug);
  const productTypesForCategory = productTypes[categoryData.name] || ["CBD Product"];
  const productType = productTypesForCategory[Math.floor(Math.random() * productTypesForCategory.length)];
  const concentration = concentrations[Math.floor(Math.random() * concentrations.length)];
  const priceRange = priceRanges[categoryData.name] || [1990, 4990];
  const price = priceRange[Math.floor(Math.random() * priceRange.length)];
  
  const title = `${productType} ${concentration}%`;
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  const descriptions = [
    `Produit CBD premium de haute qualité avec ${concentration}% de CBD. Fabriqué avec des ingrédients naturels et testé en laboratoire.`,
    `Excellente qualité CBD ${concentration}% pour une expérience optimale. Idéal pour un usage quotidien et le bien-être général.`,
    `CBD ${concentration}% de qualité supérieure, soigneusement sélectionné et testé pour garantir pureté et efficacité.`,
    `Formule premium avec ${concentration}% de CBD, conçue pour offrir les meilleurs résultats. Produit 100% naturel.`
  ];
  
  const colorMap = {
    "Huiles CBD": "00C853",
    "Cosmétiques CBD": "FFD700", 
    "Fleurs CBD": "C0C0C0",
    "Capsules CBD": "00C853",
    "Vape CBD": "FFD700"
  };
  
  const textColor = colorMap[categoryData.name] === "FFD700" ? "000000" : "FFFFFF";
  // Utiliser une image locale par défaut au lieu de placeholder
  const imageUrl = '/logo.png';
  
  return {
    id: id.toString(),
    title: title,
    slug: slug,
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    priceCents: price,
    currency: "EUR",
    cbdPercent: concentration,
    sku: `GG-${category.slug.substring(0, 2).toUpperCase()}-${id.toString().padStart(3, '0')}`,
    stock: Math.floor(Math.random() * 100) + 10,
    images: [imageUrl],
    published: true,
    categories: [category]
  };
}

// Générer 100 produits
const products = [];
let id = 1;

// Ajouter les 10 premiers produits existants
const existingProducts = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/products.json'), 'utf8'));
products.push(...existingProducts);
id = 11;

// Générer 90 produits supplémentaires
for (let i = 0; i < 90; i++) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  products.push(generateProduct(id, category));
  id++;
}

// Sauvegarder le fichier
fs.writeFileSync(
  path.join(__dirname, '../src/data/products.json'), 
  JSON.stringify(products, null, 2)
);

console.log(`✅ Généré ${products.length} produits dans src/data/products.json`);








