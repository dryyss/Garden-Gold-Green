# 🔧 Code Auth0 à Copier (Version Correcte)

## ⚠️ Votre Code a une Erreur

Vous avez mis :
```javascript
const namespace = 'https://gardengoldgreen.com' |;  // ❌ ERREUR : le | en trop
```

## ✅ Code CORRECT

Copiez-collez ce code EXACT dans Auth0 :

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://gardengoldgreen.com';
  
  if (event.authorization) {
    api.idToken.setCustomClaim(namespace + '/roles', event.authorization.roles);
    api.accessToken.setCustomClaim(namespace + '/roles', event.authorization.roles);
  }
};
```

## 🎯 Dans Auth0

1. **Supprimez** tout le code actuel
2. **Copiez-collez** le code ci-dessus
3. **Deploy**
4. **Déconnectez-vous** du site
5. **Reconnectez-vous**
6. **Ouvrez la console** (F12)

Vous devriez voir :
```
🔍 Roles claim: ["admin"]
```

---

**C'est juste une erreur de syntaxe !** Corrigez le `|` et ça marchera ! ✅







