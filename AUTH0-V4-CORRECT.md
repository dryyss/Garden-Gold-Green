# 🔧 Configuration Auth0 v4 - CORRIGÉ

## ⚠️ IMPORTANT : Cette Version Fonctionne !

Auth0 a changé son interface. Le guide précédent est obsolète. Voici la vraie méthode :

---

## 📋 Les 3 Étapes

### ✅ ÉTAPE 1 : Créer les Rôles

1. Allez sur https://manage.auth0.com/
2. Menu gauche > **User Management** > **Roles**
3. Cliquez **+ Create Role**
4. Créez `admin` et `customer`

---

### ✅ ÉTAPE 2 : Créer et Déployer l'Action (CRITIQUE)

1. Menu gauche > **Actions** > **Triggers**
2. Dans la section **Login**, cliquez sur **post-login**
3. Vous voyez votre page de trigger
4. Cliquez **+ Create Action** ou **"..."** > **Create**
5. Choisissez **Build Custom**
6. Nommez : `Add Roles to Token`
7. Trigger : `Login / Post Login`
8. Cliquez **Create**

**CODE À METTRE** :
```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://gardengoldgreen.com';
  
  if (event.authorization) {
    api.idToken.setCustomClaim(namespace + '/roles', event.authorization.roles);
    api.accessToken.setCustomClaim(namespace + '/roles', event.authorization.roles);
  }
};
```

9. Cliquez **Deploy**
10. **IMPORTANT** : Retournez à **Actions > Triggers > Login > post-login**
11. Cliquez sur les 3 points **"..."** de votre action
12. Cliquez **Push Changes** ou **Save** si l'option existe

**NOUVELLE INTERFACE** : L'action est automatiquement ajoutée au trigger quand vous la créez !

---

### ✅ ÉTAPE 3 : Assigner le Rôle

1. Menu gauche > **User Management** > **Users**
2. Cliquez sur votre utilisateur
3. Onglet **Roles**
4. Cliquez **Assign Roles**
5. Cochez `admin`
6. Cliquez **Assign**

---

## 🧪 TESTER

1. **Déconnectez-vous complètement** du site
2. **Fermez le navigateur** (ou videz le cache avec Ctrl+Shift+Delete)
3. **Reconnectez-vous**
4. **Ouvrez la console** (F12)
5. **Regardez les logs** 🔍

Vous devriez voir :
```
🔍 Auth0 User: {sub: "...", email: "...", "https://gardengoldgreen.com/roles": ["admin"]}
🔍 Roles claim: ["admin"]
🔍 Final role: admin
🔍 Header - User: votre-email@example.com
🔍 Header - Role: admin
🔍 Header - Is Admin: true
```

6. **Le lien "Admin" devrait apparaître** dans le menu utilisateur 🛡️

---

## 🆘 Si Ça Ne Marche Pas

### Les Logs Montrent "undefined"

**Cause** : L'action n'est pas active
**Solution** :
1. Retournez Actions > Triggers > Login > post-login
2. Vérifiez que votre action est visible
3. Si pas là, créez-la à nouveau (parfois c'est un bug Auth0)

### Les Logs Montrent "customer"

**Cause** : Le rôle n'est pas assigné
**Solution** : Relisez ÉTAPE 3

### Aucune Log

**Cause** : UserProvider manquant
**Solution** : J'ai déjà ajouté UserProvider dans le layout ✅

---

## 📞 Dites-Moi

Après avoir fait les 3 étapes et reconnecté, **ouvrez la console et dites-moi ce que vous voyez !**

Les logs 🔍 vous diront exactement où est le problème !

