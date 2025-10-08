const fs = require('fs');
const path = require('path');

// Fonction pour corriger un fichier
function fixAuth0File(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf-8');
  let modified = false;

  // Si le fichier contient authState, on le corrige
  if (content.includes('authState.')) {
    // S'assurer qu'on a le bon import
    if (content.includes("import { useAuth0 } from '@/hooks/useAuth0'")) {
      // Corriger la destructuration pour inclure toutes les propriétés nécessaires
      content = content.replace(
        /const \{ user, isAuthenticated \} = useAuth0\(\)/g,
        'const { user, isAuthenticated, error, isLoading } = useAuth0()'
      );
      content = content.replace(
        /const \{ state: authState \} = useAuth0\(\)/g,
        'const { user, isAuthenticated, error, isLoading } = useAuth0()'
      );
    }

    // Remplacer toutes les références
    content = content.replace(/authState\.isAuthenticated/g, 'isAuthenticated');
    content = content.replace(/authState\.user/g, 'user');
    content = content.replace(/authState\.error/g, 'error');
    content = content.replace(/authState\.isLoading/g, 'isLoading');

    // Sauvegarder
    fs.writeFileSync(fullPath, content, 'utf-8');
    modified = true;
  }

  return modified;
}

// Fonction récursive pour trouver tous les fichiers
function findAndFixFiles(dir) {
  const files = fs.readdirSync(dir);
  let fixedCount = 0;

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      fixedCount += findAndFixFiles(fullPath);
    } else if (stat.isFile() && (file.endsWith('.tsx') || file.endsWith('.ts'))) {
      const relativePath = path.relative(path.join(__dirname, '..'), fullPath);
      if (fixAuth0File(relativePath)) {
        console.log(`✅ Corrigé: ${relativePath}`);
        fixedCount++;
      }
    }
  }

  return fixedCount;
}

console.log('🔄 Correction finale des références Auth0...\n');

const srcDir = path.join(__dirname, '..', 'src');
const fixedCount = findAndFixFiles(srcDir);

console.log(`\n✨ Correction terminée ! ${fixedCount} fichiers corrigés.`);
