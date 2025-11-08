# 🧪 Guide de Test - Actions Auth0

## 📋 Prérequis

Avant de tester, assurez-vous que :
- ✅ Les 2 actions sont créées et déployées
- ✅ Les secrets sont configurés
- ✅ Les actions sont attachées au trigger Post Login
- ✅ L'application M2M existe avec les bonnes permissions

---

## 🎯 Méthode 1 : Test dans Auth0 (Simulateur)

### Étape 1 : Tester l'Action Individuellement

1. **Auth0 Dashboard** > **Actions** > **Library**
2. Cliquez sur votre action **"Assign Default Role on Login"**
3. Cliquez sur **"Test"** (ou **"Run"**)
4. Vous verrez un JSON de test similaire à celui que vous avez vu

### Étape 2 : Vérifier les Logs

1. Après avoir testé, cliquez sur **"View Logs"** ou **"Logs"**
2. Vous devriez voir :
   - `✅ Rôle par défaut assigné avec succès à: [email]`
   - Ou des erreurs si quelque chose ne va pas

⚠️ **Note** : Le simulateur peut avoir des limitations (erreur "fetch failed"). Testez avec une vraie connexion pour être sûr.

---

## 🎯 Méthode 2 : Test avec une Vraie Connexion (RECOMMANDÉ)

### Étape 1 : Préparer un Utilisateur de Test

1. **Auth0 Dashboard** > **User Management** > **Users**
2. Créez un nouvel utilisateur ou utilisez un existant
3. **Important** : Assurez-vous que cet utilisateur n'a **AUCUN rôle** assigné
4. Notez l'email de l'utilisateur

### Étape 2 : Vérifier les Logs en Temps Réel

1. **Auth0 Dashboard** > **Actions** > **Logs**
2. Gardez cette page ouverte (les logs apparaîtront en temps réel)

### Étape 3 : Se Connecter

1. Allez sur votre application (ex: `http://localhost:3000`)
2. Cliquez sur **"Login"** ou **"Se connecter"**
3. Connectez-vous avec l'utilisateur de test (celui sans rôle)

### Étape 4 : Vérifier les Résultats

#### Dans Auth0 Logs
Vous devriez voir :
```
ℹ️ Utilisateur sans rôles détecté: test@example.com
📡 Obtention du token Management API...
📝 Assignation du rôle par défaut...
✅ Rôle par défaut assigné avec succès à: test@example.com
📋 Rôles de l'utilisateur: customer
✅ Rôles ajoutés au token depuis event.authorization: customer
```

#### Dans votre Application
1. Ouvrez la console du navigateur (F12)
2. Vous devriez voir :
```javascript
🔍 Auth0 User: {sub: "...", email: "...", "https://gardengoldgreen.com/roles": ["customer"]}
🔍 Roles claim: ["customer"]
🔍 Final role: customer
```

---

## 🎯 Méthode 3 : Test Complet avec Vérification

### Test 1 : Utilisateur Sans Rôle

1. **Créer un utilisateur** sans aucun rôle dans Auth0
2. **Se connecter** avec cet utilisateur
3. **Vérifier** :
   - ✅ Le rôle par défaut est assigné (dans Auth0 > Users > [Utilisateur] > Roles)
   - ✅ Le token contient les rôles (dans la console du navigateur)

### Test 2 : Utilisateur Avec Rôle Existant

1. **Assigner manuellement un rôle** (ex: "admin") à un utilisateur
2. **Se connecter** avec cet utilisateur
3. **Vérifier** :
   - ✅ Le log dit "Utilisateur a déjà des rôles: admin"
   - ✅ Le token contient tous les rôles (dans la console)

### Test 3 : Vérifier les Rôles dans le Token

Dans votre application, ajoutez ce code temporaire pour vérifier :

```javascript
// Dans votre composant qui utilise Auth0
import { useUser } from '@auth0/nextjs-auth0/client';

function TestRoles() {
  const { user } = useUser();
  
  useEffect(() => {
    if (user) {
      console.log('=== TEST DES RÔLES ===');
      console.log('User complet:', user);
      console.log('Roles claim:', user['https://gardengoldgreen.com/roles']);
      console.log('Roles type:', typeof user['https://gardengoldgreen.com/roles']);
      console.log('Roles length:', user['https://gardengoldgreen.com/roles']?.length);
      console.log('====================');
    }
  }, [user]);
  
  return null;
}
```

---

## 🔍 Dépannage

### Problème : "fetch failed" dans les logs

**Cause** : Le simulateur Auth0 a des limitations réseau

**Solution** : 
- Ignorez cette erreur dans le simulateur
- Testez avec une vraie connexion
- Si ça échoue aussi en production, vérifiez les secrets

### Problème : Rôles non assignés

**Vérifier** :
1. Les secrets sont corrects
2. L'application M2M a les permissions `read:roles` et `update:users`
3. Le `defaultRoleID` est correct (commence par `rol_`)
4. Les actions sont bien attachées au trigger Post Login

### Problème : Rôles non dans le token

**Vérifier** :
1. L'Action 2 est bien attachée au trigger
2. L'Action 2 est déployée
3. Le namespace est correct : `https://gardengoldgreen.com`
4. Vous vous êtes déconnecté et reconnecté après avoir déployé

### Problème : Erreur "Property 'status' does not exist"

**Solution** : 
- Ce sont des erreurs TypeScript de l'éditeur
- Ignorez-les, le code fonctionne quand même
- Le code utilise déjà des vérifications pour éviter ces erreurs

---

## 📊 Checklist de Test

- [ ] Action 1 déployée
- [ ] Action 2 déployée
- [ ] Secrets configurés
- [ ] Actions attachées au trigger Post Login
- [ ] Application M2M créée avec les bonnes permissions
- [ ] Test avec utilisateur sans rôle → Rôle assigné ✅
- [ ] Test avec utilisateur avec rôle → Rôle existant conservé ✅
- [ ] Rôles visibles dans le token (console navigateur) ✅
- [ ] Rôles visibles dans Auth0Context ✅

---

## 🎯 Test Rapide (5 minutes)

1. **Créer un utilisateur test** sans rôle
2. **Se connecter** avec cet utilisateur
3. **Vérifier dans Auth0** : User Management > Users > [Utilisateur] > Roles → Doit avoir le rôle par défaut
4. **Vérifier dans la console** : `auth0User['https://gardengoldgreen.com/roles']` → Doit contenir le rôle

Si ces 4 points sont OK, c'est bon ! ✅






