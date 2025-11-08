# 🔍 Comment Vérifier les Logs de l'Action Auth0

## ⚠️ Important : Deux Types de Logs

Auth0 a **2 endroits différents** pour les logs :

1. **Dashboard > Logs** → Logs généraux (connexions, API, etc.)
2. **Actions > Logs** → Logs spécifiques des Actions (c'est ce qu'on cherche !)

---

## 🎯 Vérifier les Logs de l'Action

### Étape 1 : Aller dans les Logs des Actions

1. **Auth0 Dashboard** > **Actions** (menu de gauche)
2. Cliquez sur **"Logs"** (pas "Dashboard" > "Logs")
3. Vous verrez les logs spécifiques de vos Actions

### Étape 2 : Trouver la Dernière Exécution

1. Dans **Actions > Logs**, cherchez la dernière connexion
2. Cliquez sur une entrée pour voir les détails
3. Vous devriez voir les `console.log` de votre Action

**Ce que vous devriez voir si ça fonctionne** :
```
ℹ️ Utilisateur sans rôles détecté: test@example.com
📡 Obtention du token Management API...
📝 Assignation du rôle par défaut...
✅ Rôle par défaut assigné avec succès à: test@example.com
```

**Si vous ne voyez rien** :
- L'Action ne s'exécute pas
- Vérifiez les points suivants

---

## ✅ Vérifications à Faire

### 1. L'Action est-elle Déployée ?

1. **Actions** > **Library**
2. Trouvez votre action **"Assign Default Role on Login"**
3. Vérifiez le statut :
   - ✅ **"Deployed"** = Bon
   - ❌ **"Draft"** = Il faut déployer !

**Si c'est "Draft"** :
- Cliquez sur l'action
- Cliquez sur **"Deploy"** en haut à droite

### 2. L'Action est-elle Attachée au Trigger ?

1. **Actions** > **Triggers** > **Login**
2. Cliquez sur **"post-login"**
3. Vérifiez que votre action est dans la liste

**Si elle n'est pas là** :
- Cliquez sur **"+ Add"** ou **"+"**
- Ajoutez votre action **"Assign Default Role on Login"**
- Sauvegardez

### 3. L'Action est-elle Activée ?

1. Dans **Actions > Triggers > Login > post-login**
2. Vérifiez que votre action a un toggle **ON** (pas grisé)
3. Si elle est désactivée, activez-la

---

## 🔍 Si Aucun Log n'Apparaît

Si vous ne voyez **aucun log** dans **Actions > Logs**, cela signifie que :

1. L'Action ne s'exécute pas du tout
2. Vérifiez :
   - ✅ Action déployée ?
   - ✅ Action attachée au trigger ?
   - ✅ Action activée dans le trigger ?

---

## 📋 Checklist Rapide

- [ ] Action déployée (pas "Draft")
- [ ] Action attachée au trigger post-login
- [ ] Action activée (toggle ON)
- [ ] Secrets configurés (domain, clientId, clientSecret, defaultRoleID)
- [ ] Application M2M créée avec permissions

---

## 🎯 Prochaine Étape

1. Allez dans **Actions > Logs** (pas Dashboard > Logs)
2. Dites-moi ce que vous voyez :
   - Des logs de l'Action ?
   - Aucun log ?
   - Des erreurs ?

3. Vérifiez aussi :
   - Le statut de l'Action (Draft ou Deployed ?)
   - L'Action est-elle dans le trigger post-login ?

 Partagez ces informations et je vous aiderai à résoudre le problème ! 🚀






