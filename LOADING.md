# Système de Loading

## ✅ Installation terminée

### Test rapide
```bash
npm run dev
```
Ouvrez http://localhost:3001

### Pages de test
- `/test-loading` - Tests basiques
- `/test-loading-advanced` - Tous les exemples

## Utilisation

### Pour un paiement
```tsx
import { useLoadingAction } from '@/hooks/useLoadingAction'

const { executePayment } = useLoadingAction()

await executePayment(async () => {
  await fetch('/api/checkout', { method: 'POST', ... })
})
```

### Pour charger des données
```tsx
import { InlineLoading } from '@/components/LoadingOverlay'

if (loading) return <InlineLoading message="Chargement..." />
```

### Pour une action
```tsx
import { useLoading } from '@/contexts/LoadingContext'

const { showLoading, hideLoading } = useLoading()

showLoading('Message...')
await action()
hideLoading()
```

## Composants créés
- `LogoLoading.tsx` - Animation principale
- `LoadingOverlay.tsx` - Pour actions
- `NavigationLoading.tsx` - Changements de page
- `LoadingContext.tsx` - Contexte global
- `useLoadingAction.ts` - Hook pour actions

C'est tout ! 🚀

