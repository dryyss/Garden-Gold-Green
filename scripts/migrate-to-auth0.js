const fs = require('fs');
const path = require('path');

// Fichiers à migrer
const filesToMigrate = [
  'src/app/cart/page.tsx',
  'src/app/products/[slug]/page.tsx',
  'src/app/orders/[id]/page.tsx',
  'src/app/orders/page.tsx',
  'src/app/profile/page.tsx',
  'src/components/SystemTest.tsx',
  'src/components/RegisterModal.tsx',
  'src/components/LoginModal.tsx',
  'src/hooks/useAuthNotifications.ts',
  'src/components/AdminGuard.tsx',
  'src/components/ProtectedRoute.tsx',
  'src/components/UserProfileModal.tsx'
];

function migrateFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Fichier non trouvé: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf-8');
  let modified = false;

  // Remplacer l'import
  if (content.includes("import { useAuth } from '@/contexts/AuthContext'")) {
    content = content.replace(
      "import { useAuth } from '@/contexts/AuthContext'",
      "import { useAuth0 } from '@/hooks/useAuth0'"
    );
    modified = true;
  }

  // Remplacer l'utilisation du hook
  if (content.includes('const { state: authState } = useAuth()')) {
    content = content.replace(
      'const { state: authState } = useAuth()',
      'const { user, isAuthenticated } = useAuth0()'
    );
    modified = true;
  }

  // Remplacer les références
  content = content.replace(/authState\.isAuthenticated/g, 'isAuthenticated');
  content = content.replace(/authState\.user/g, 'user');

  // Sauvegarder si modifié
  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`✅ Migré: ${filePath}`);
  } else {
    console.log(`⏭️  Aucun changement: ${filePath}`);
  }
}

console.log('🔄 Migration vers Auth0...\n');

filesToMigrate.forEach(migrateFile);

console.log('\n✨ Migration terminée !');
