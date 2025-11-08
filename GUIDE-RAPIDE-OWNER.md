# ⚡ Guide Rapide : Configurer Owner

## 🎯 En 5 Minutes

### 1️⃣ Auth0 - Créer le Rôle
```
Auth0 > User Management > Roles > + Create Role
Name: owner
Create
```

### 2️⃣ Auth0 - Assigner à un Utilisateur
```
Auth0 > User Management > Users > [Votre utilisateur]
Onglet Roles > Assign Roles > Cocher "owner" > Assign
```

### 3️⃣ Vérifier l'Action Auth0
```
Auth0 > Actions > Triggers > Login > post-login
Vérifier que "Add Roles to Token" est déployée
```

### 4️⃣ Dans l'Application
```
1. Déconnectez-vous complètement
2. Reconnectez-vous
3. Ouvrez la console (F12)
4. Vérifiez : 🔍 Final role: owner
5. Allez sur /admin
6. Vous verrez l'onglet "Gestion Utilisateurs" 👑
```

### 5️⃣ Utiliser l'Interface
```
1. Cliquez sur "Gestion Utilisateurs"
2. Recherchez un utilisateur (email ou nom)
3. Changez son rôle dans le menu déroulant
4. ✅ C'est fait !
```

---

## 🔍 Vérifications

### Logs Console (F12)
```
✅ 🔍 Roles claim: ["owner"]
✅ 🔍 Final role: owner
```

### Interface Admin
```
✅ Onglet "Gestion Utilisateurs" visible avec 👑
✅ Peut modifier les rôles des utilisateurs
```

---

## ❌ Problèmes Courants

**Le rôle n'apparaît pas :**
- Déconnectez-vous et reconnectez-vous
- Videz le cache (Ctrl+Shift+Delete)
- Vérifiez que l'action Auth0 est déployée

**L'onglet n'apparaît pas :**
- Vérifiez les logs : `Final role: owner`
- Rafraîchissez la page (F5)

**Impossible de modifier un rôle :**
- Vous devez être owner (pas admin)
- Vérifiez les messages d'erreur

---

**✅ C'est tout ! Vous pouvez maintenant gérer tous les rôles depuis l'application.**






