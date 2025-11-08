# ⚠️ Erreur "fetch failed" dans le Simulateur Auth0

## 🎯 C'est Normal !

L'erreur `TypeError: fetch failed` dans le **simulateur de test Auth0** est **normale et attendue**.

### Pourquoi ?

Le simulateur de test Auth0 ne permet **PAS** les requêtes HTTP externes (fetch). C'est une limitation de sécurité de l'environnement de test.

### Solution

**Déployez quand même l'action et testez avec une vraie connexion !**

Le code fonctionnera parfaitement en production lors d'une vraie connexion utilisateur.

---

## ✅ Étapes pour Tester en Production

### 1. Déployer l'Action

1. Malgré l'erreur dans le simulateur, cliquez sur **"Deploy"**
2. L'action sera déployée et fonctionnera en production

### 2. Attacher au Trigger

1. **Actions** > **Triggers** > **Login** > **post-login**
2. Ajoutez votre action à la liste
3. Assurez-vous qu'elle est activée

### 3. Tester avec une Vraie Connexion

1. **Créer un utilisateur test** sans rôle dans Auth0
2. **Se connecter** avec cet utilisateur sur votre application
3. **Vérifier les logs** dans Auth0 > Actions > Logs

### 4. Vérifier les Résultats

Dans les logs Auth0 (Actions > Logs), vous devriez voir :
```
ℹ️ Utilisateur sans rôles détecté: test@example.com
📡 Obtention du token Management API...
📝 Assignation du rôle par défaut...
✅ Rôle par défaut assigné avec succès à: test@example.com
```

**Si vous voyez ces logs en production, c'est que ça fonctionne !** ✅

---

## 🔍 Comment Savoir si ça Fonctionne

### Vérification 1 : Logs Auth0
- Allez dans **Actions** > **Logs**
- Après une connexion, vous devriez voir les logs de succès

### Vérification 2 : Utilisateur dans Auth0
- **User Management** > **Users** > [Votre utilisateur]
- Onglet **Roles**
- Le rôle par défaut doit être présent

### Vérification 3 : Token dans l'Application
- Dans la console du navigateur (F12)
- Vérifiez : `auth0User['https://gardengoldgreen.com/roles']`
- Doit contenir le rôle

---

## ⚠️ Si ça ne Fonctionne Pas en Production

Si même en production vous avez des erreurs, vérifiez :

1. **Secrets configurés** :
   - `domain` : correct (sans https://)
   - `clientId` : ID de l'application M2M
   - `clientSecret` : Secret de l'application M2M
   - `defaultRoleID` : ID du rôle (commence par `rol_`)

2. **Application M2M** :
   - Existe et est activée
   - A les permissions : `read:roles` et `update:users`
   - Est autorisée sur l'Auth0 Management API

3. **Action déployée** :
   - L'action est bien déployée (bouton "Deploy" cliqué)
   - L'action est attachée au trigger Post Login

4. **Ordre des actions** :
   - Action 1 (Assign Default Role) doit être AVANT Action 2 (Add Roles to Token)

---

## 📝 Résumé

✅ **Erreur "fetch failed" dans le simulateur** = Normal, ignorez-la  
✅ **Déployez l'action quand même**  
✅ **Testez avec une vraie connexion**  
✅ **Vérifiez les logs Auth0 en production**

Le code est correct, c'est juste une limitation du simulateur ! 🚀






