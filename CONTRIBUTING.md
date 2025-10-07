# 🤝 Guide de Contribution

Merci de votre intérêt à contribuer au projet Garden Gold Green ! Ce guide vous aidera à comprendre comment contribuer efficacement.

## 🚀 Démarrage Rapide

### 1. Fork et Clone
```bash
# Fork le repository sur GitHub
# Puis clonez votre fork
git clone https://github.com/VOTRE-USERNAME/Garden-Gold-Green.git
cd Garden-Gold-Green
```

### 2. Installation
```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local

# Lancer le serveur de développement
npm run dev
```

### 3. Créer une branche
```bash
git checkout -b feature/nom-de-votre-feature
```

## 📋 Processus de Contribution

### 1. **Issues**
- Vérifiez d'abord s'il existe déjà une issue pour votre demande
- Créez une issue claire avec un titre descriptif
- Utilisez les labels appropriés (bug, feature, enhancement, etc.)

### 2. **Développement**
- Suivez les conventions de code existantes
- Écrivez des tests pour vos nouvelles fonctionnalités
- Assurez-vous que tous les tests passent
- Vérifiez que le linting est correct

### 3. **Pull Request**
- Créez une PR claire avec une description détaillée
- Liez votre PR à l'issue correspondante
- Demandez une review à au moins un mainteneur

## 🎨 Conventions de Code

### TypeScript
```typescript
// ✅ Bon
interface User {
  id: string
  email: string
  name: string
}

// ❌ Éviter
const user: any = {}
```

### React Components
```tsx
// ✅ Bon - Composant fonctionnel avec TypeScript
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button 
      className={`btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```

### CSS/Tailwind
```tsx
// ✅ Bon - Classes Tailwind organisées
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
  <h2 className="text-xl font-bold text-gray-900">Titre</h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Action
  </button>
</div>
```

## 🧪 Tests

### Lancer les tests
```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:coverage
```

### Écrire des tests
```tsx
// Exemple de test pour un composant
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/Button'

describe('Button', () => {
  it('should render with correct text', () => {
    render(<Button onClick={() => {}}>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

## 📝 Documentation

### Composants
- Documentez les props avec JSDoc
- Ajoutez des exemples d'utilisation
- Incluez des notes sur l'accessibilité si applicable

```tsx
/**
 * Button component for user interactions
 * 
 * @param children - Content to display inside the button
 * @param onClick - Function to call when button is clicked
 * @param variant - Visual style variant
 * @param disabled - Whether the button is disabled
 * 
 * @example
 * <Button onClick={handleClick} variant="primary">
 *   Save Changes
 * </Button>
 */
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}
```

### API Routes
- Documentez les endpoints avec des exemples
- Incluez les codes d'erreur possibles
- Spécifiez les types de données

## 🐛 Signaler un Bug

### Template d'Issue
```markdown
## 🐛 Description du Bug
Description claire et concise du problème.

## 🔄 Étapes pour Reproduire
1. Aller à '...'
2. Cliquer sur '...'
3. Voir l'erreur

## ✅ Comportement Attendu
Description de ce qui devrait se passer.

## 📱 Environnement
- OS: [e.g. Windows 10, macOS 12]
- Navigateur: [e.g. Chrome 91, Firefox 89]
- Version: [e.g. 1.0.0]

## 📸 Captures d'Écran
Si applicable, ajoutez des captures d'écran.

## 📋 Informations Supplémentaires
Toute autre information pertinente.
```

## ✨ Proposer une Feature

### Template d'Issue
```markdown
## 🚀 Description de la Feature
Description claire de la fonctionnalité souhaitée.

## 💡 Motivation
Pourquoi cette feature serait-elle utile ?

## 📋 Détails d'Implémentation
- [ ] Étape 1
- [ ] Étape 2
- [ ] Étape 3

## 🎨 Design/Mockups
Si applicable, ajoutez des mockups ou designs.

## 📚 Documentation
Quelle documentation sera nécessaire ?
```

## 🔍 Review Process

### Pour les Reviewers
- Vérifiez que le code suit les conventions
- Testez les nouvelles fonctionnalités
- Vérifiez la sécurité et les performances
- Assurez-vous que la documentation est à jour

### Pour les Contributeurs
- Répondez aux commentaires de review
- Faites les modifications demandées
- Testez après chaque modification
- Gardez la PR à jour avec main

## 📞 Support

- **Discord** : [Lien du serveur Discord]
- **Email** : dev@gardengoldgreen.com
- **Issues** : [GitHub Issues](https://github.com/dryyss/Garden-Gold-Green/issues)

## 📄 Licence

En contribuant, vous acceptez que vos contributions soient sous la licence MIT.

---

Merci de contribuer à Garden Gold Green ! 🌿✨

Merci de votre intérêt à contribuer au projet Garden Gold Green ! Ce guide vous aidera à comprendre comment contribuer efficacement.

## 🚀 Démarrage Rapide

### 1. Fork et Clone
```bash
# Fork le repository sur GitHub
# Puis clonez votre fork
git clone https://github.com/VOTRE-USERNAME/Garden-Gold-Green.git
cd Garden-Gold-Green
```

### 2. Installation
```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local

# Lancer le serveur de développement
npm run dev
```

### 3. Créer une branche
```bash
git checkout -b feature/nom-de-votre-feature
```

## 📋 Processus de Contribution

### 1. **Issues**
- Vérifiez d'abord s'il existe déjà une issue pour votre demande
- Créez une issue claire avec un titre descriptif
- Utilisez les labels appropriés (bug, feature, enhancement, etc.)

### 2. **Développement**
- Suivez les conventions de code existantes
- Écrivez des tests pour vos nouvelles fonctionnalités
- Assurez-vous que tous les tests passent
- Vérifiez que le linting est correct

### 3. **Pull Request**
- Créez une PR claire avec une description détaillée
- Liez votre PR à l'issue correspondante
- Demandez une review à au moins un mainteneur

## 🎨 Conventions de Code

### TypeScript
```typescript
// ✅ Bon
interface User {
  id: string
  email: string
  name: string
}

// ❌ Éviter
const user: any = {}
```

### React Components
```tsx
// ✅ Bon - Composant fonctionnel avec TypeScript
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button 
      className={`btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```

### CSS/Tailwind
```tsx
// ✅ Bon - Classes Tailwind organisées
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
  <h2 className="text-xl font-bold text-gray-900">Titre</h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Action
  </button>
</div>
```

## 🧪 Tests

### Lancer les tests
```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:coverage
```

### Écrire des tests
```tsx
// Exemple de test pour un composant
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/Button'

describe('Button', () => {
  it('should render with correct text', () => {
    render(<Button onClick={() => {}}>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

## 📝 Documentation

### Composants
- Documentez les props avec JSDoc
- Ajoutez des exemples d'utilisation
- Incluez des notes sur l'accessibilité si applicable

```tsx
/**
 * Button component for user interactions
 * 
 * @param children - Content to display inside the button
 * @param onClick - Function to call when button is clicked
 * @param variant - Visual style variant
 * @param disabled - Whether the button is disabled
 * 
 * @example
 * <Button onClick={handleClick} variant="primary">
 *   Save Changes
 * </Button>
 */
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}
```

### API Routes
- Documentez les endpoints avec des exemples
- Incluez les codes d'erreur possibles
- Spécifiez les types de données

## 🐛 Signaler un Bug

### Template d'Issue
```markdown
## 🐛 Description du Bug
Description claire et concise du problème.

## 🔄 Étapes pour Reproduire
1. Aller à '...'
2. Cliquer sur '...'
3. Voir l'erreur

## ✅ Comportement Attendu
Description de ce qui devrait se passer.

## 📱 Environnement
- OS: [e.g. Windows 10, macOS 12]
- Navigateur: [e.g. Chrome 91, Firefox 89]
- Version: [e.g. 1.0.0]

## 📸 Captures d'Écran
Si applicable, ajoutez des captures d'écran.

## 📋 Informations Supplémentaires
Toute autre information pertinente.
```

## ✨ Proposer une Feature

### Template d'Issue
```markdown
## 🚀 Description de la Feature
Description claire de la fonctionnalité souhaitée.

## 💡 Motivation
Pourquoi cette feature serait-elle utile ?

## 📋 Détails d'Implémentation
- [ ] Étape 1
- [ ] Étape 2
- [ ] Étape 3

## 🎨 Design/Mockups
Si applicable, ajoutez des mockups ou designs.

## 📚 Documentation
Quelle documentation sera nécessaire ?
```

## 🔍 Review Process

### Pour les Reviewers
- Vérifiez que le code suit les conventions
- Testez les nouvelles fonctionnalités
- Vérifiez la sécurité et les performances
- Assurez-vous que la documentation est à jour

### Pour les Contributeurs
- Répondez aux commentaires de review
- Faites les modifications demandées
- Testez après chaque modification
- Gardez la PR à jour avec main

## 📞 Support

- **Discord** : [Lien du serveur Discord]
- **Email** : dev@gardengoldgreen.com
- **Issues** : [GitHub Issues](https://github.com/dryyss/Garden-Gold-Green/issues)

## 📄 Licence

En contribuant, vous acceptez que vos contributions soient sous la licence MIT.

---

Merci de contribuer à Garden Gold Green ! 🌿✨
