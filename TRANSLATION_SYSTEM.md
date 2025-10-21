# Système de Traduction Multilingue

## Vue d'ensemble

Ce système de traduction permet de gérer 4 langues sur le site :
- **Français** (par défaut)
- **Anglais**
- **Espagnol**
- **Néerlandais**

## Fonctionnalités

### Détection automatique de la langue
- Le système détecte automatiquement la langue du navigateur de l'utilisateur
- Si la langue détectée n'est pas supportée, l'anglais est utilisé par défaut
- La préférence de langue est sauvegardée dans le localStorage

### Sélection de langue
- Sélecteur de langue dans le header (desktop)
- Sélecteur de langue dans le menu mobile
- Sélecteur de langue dans le footer

## Structure des fichiers

```
src/
├── locales/
│   ├── fr.json    # Traductions françaises
│   ├── en.json    # Traductions anglaises
│   ├── es.json    # Traductions espagnoles
│   └── nl.json    # Traductions néerlandaises
├── contexts/
│   └── TranslationContext.tsx  # Contexte de traduction
└── components/
    ├── LanguageSelector.tsx    # Composant de sélection de langue
    └── TranslationTest.tsx     # Composant de test (dev uniquement)
```

## Utilisation

### Dans un composant React

```tsx
import { useTranslation } from '@/contexts/TranslationContext'

function MonComposant() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('header.title')}</h1>
      <p>{t('footer.description')}</p>
    </div>
  )
}
```

### Hooks disponibles

```tsx
import { 
  useTranslation,    // Hook principal
  useLanguage,       // Obtenir la langue actuelle
  useT,             // Obtenir la fonction de traduction
  useSetLanguage     // Changer de langue
} from '@/contexts/TranslationContext'

function MonComposant() {
  const { t, language, setLanguage } = useTranslation()
  const currentLang = useLanguage()
  const translate = useT()
  const changeLanguage = useSetLanguage()
  
  // Utilisation...
}
```

## Structure des traductions

Les fichiers de traduction suivent une structure hiérarchique :

```json
{
  "common": {
    "loading": "Chargement...",
    "error": "Erreur"
  },
  "header": {
    "title": "GARDEN GOLD GREEN",
    "navigation": {
      "home": "Accueil",
      "shop": "Boutique"
    }
  }
}
```

### Accès aux traductions

```tsx
// Traductions simples
t('common.loading')           // "Chargement..."
t('header.title')            // "GARDEN GOLD GREEN"

// Traductions imbriquées
t('header.navigation.home')  // "Accueil"
t('header.user.profile')     // "Mon profil"
```

## Ajout de nouvelles traductions

1. **Ajouter la clé dans tous les fichiers de langue** (`fr.json`, `en.json`, `es.json`, `nl.json`)
2. **Utiliser la clé dans le composant** avec `t('ma.nouvelle.cle')`

### Exemple

Dans `fr.json` :
```json
{
  "products": {
    "newFeature": "Nouvelle fonctionnalité"
  }
}
```

Dans `en.json` :
```json
{
  "products": {
    "newFeature": "New feature"
  }
}
```

Dans le composant :
```tsx
<p>{t('products.newFeature')}</p>
```

## Composant de sélection de langue

Le composant `LanguageSelector` s'adapte automatiquement selon le contexte :

```tsx
// Dans le header
<LanguageSelector variant="header" />

// Dans le footer
<LanguageSelector variant="footer" />

// Dans le menu mobile
<LanguageSelector variant="mobile" />
```

## Gestion des erreurs

- Si une traduction n'est pas trouvée, la clé est retournée telle quelle
- En cas d'erreur de chargement d'une langue, le français est utilisé en fallback
- Les erreurs sont loggées dans la console en mode développement

## Performance

- Les traductions sont chargées de manière asynchrone
- Le système utilise le lazy loading pour les fichiers de traduction
- La langue est mise en cache dans le localStorage
- L'attribut `lang` du HTML est mis à jour automatiquement

## Développement

En mode développement, un composant `TranslationTest` est affiché pour tester les traductions. Il montre :
- La langue actuelle
- Quelques traductions de test
- Les clés utilisées

## Configuration

Le système est configuré dans `src/contexts/TranslationContext.tsx` :
- Langues supportées
- Langue par défaut
- Détection automatique
- Gestion des erreurs

## Maintenance

Pour ajouter une nouvelle langue :
1. Créer un nouveau fichier `src/locales/[code].json`
2. Ajouter le code de langue dans le type `SupportedLanguage`
3. Ajouter la langue dans le tableau `languages` du composant `LanguageSelector`
4. Mettre à jour la fonction `getDefaultLanguage` si nécessaire

