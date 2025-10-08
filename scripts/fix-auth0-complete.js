const fs = require('fs');
const path = require('path');

// Fonction pour corriger un fichier
function fixAuth0File(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Fichier non trouvé: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf-8');
  let modified = false;

  // Remplacer l'import si nécessaire
  if (content.includes("import { useAuth0 } from '@/hooks/useAuth0'")) {
    // Vérifier si on a déjà les bonnes variables destructurées
    if (!content.includes('const { user, isAuthenticated')) {
      // Remplacer la destructuration
      content = content.replace(
        /const \{ state: authState \} = useAuth0\(\)/g,
        'const { user, isAuthenticated, error, isLoading } = useAuth0()'
      );
      content = content.replace(
        /const \{ user, isAuthenticated \} = useAuth0\(\)/g,
        'const { user, isAuthenticated, error, isLoading } = useAuth0()'
      );
      modified = true;
    }
  }

  // Remplacer toutes les références authState
  content = content.replace(/authState\.isAuthenticated/g, 'isAuthenticated');
  content = content.replace(/authState\.user/g, 'user');
  content = content.replace(/authState\.error/g, 'error');
  content = content.replace(/authState\.isLoading/g, 'isLoading');

  // Sauvegarder si modifié
  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`✅ Corrigé: ${filePath}`);
    return true;
  } else {
    console.log(`⏭️  Aucun changement: ${filePath}`);
    return false;
  }
}

// Trouver tous les fichiers .tsx et .ts dans src
function findTsFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findTsFiles(fullPath));
    } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts'))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

console.log('🔄 Correction complète des références Auth0...\n');

const srcDir = path.join(__dirname, '..', 'src');
const allFiles = findTsFiles(srcDir);

let fixedCount = 0;

// Corriger tous les fichiers qui contiennent authState
allFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf-8');
  if (content.includes('authState.')) {
    const relativePath = path.relative(path.join(__dirname, '..'), filePath);
    if (fixAuth0File(relativePath)) {
      fixedCount++;
    }
  }
});

console.log(`\n✨ Correction terminée ! ${fixedCount} fichiers corrigés.`);
