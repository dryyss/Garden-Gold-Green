# 🚀 COMMENCEZ ICI - Guide de Démarrage Rapide

## ⚡ Ce qui est Prêt

✅ **Tout le code est fonctionnel !**
- APIs admin complètes
- Système de commandes
- Tracking
- Retours
- Webhook Stripe
- UserProvider ajouté

---

## 🔧 Configuration à Faire (30 min)

### 1️⃣ Auth0 (15 min)

**Ouvrez** : https://manage.auth0.com/

#### Créer les Rôles
1. **User Management** > **Roles**
2. Créez `admin` et `customer`

#### Créer l'Action
1. **Actions** > **Triggers** > Cliquez **post-login**
2. **+ Create Action** > **Build Custom**
3. Nom : `Add Roles to Token`
4. Trigger : `Login / Post Login`
5. **Code** :
```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://gardengoldgreen.com';
  
  if (event.authorization) {
    api.idToken.setCustomClaim(namespace + '/roles', event.authorization.roles);
    api.accessToken.setCustomClaim(namespace + '/roles', event.authorization.roles);
  }
};
```
6. **Deploy**

#### Assigner le Rôle
1. **User Management** > **Users** > Votre utilisateur
2. **Roles** > **Assign Roles**
3. Cochez `admin`

---

### 2️⃣ Tester

1. **Déconnectez-vous** complètement
2. **Reconnectez-vous**
3. **Ouvrez la console** (F12)
4. **Cherchez** les logs 🔍

Vous devriez voir :
```
🔍 Roles claim: ["admin"]
🔍 Final role: admin
🔍 Header - Is Admin: true
```

5. **Le lien "Admin"** devrait apparaître dans le menu utilisateur !

---

## 📦 Commandes

### Le Webhook Stripe Fonctionne Déjà

**Si vos commandes ne sont pas dans l'historique** :

1. **Vérifiez** que vous étiez connecté lors du checkout
2. **Ouvrez Prisma Studio** :
```bash
npx prisma studio
```
3. Allez dans table `Order`
4. Vérifiez `userId` et `customerEmail`

### Numéro de Commande

Les commandes ont un numéro : `CMD-20250101-0001`

---

## 🎯 URLs Importantes

- **Dashboard Admin** : http://localhost:3000/admin
- **Mes Commandes** : http://localhost:3000/orders
- **Suivi** : http://localhost:3000/track-order
- **Login** : http://localhost:3000/auth/login

---

## 🆘 Dépannage

### Rôle Admin Ne Marche Pas

**Logs à vérifier** dans la console (F12) :
```
🔍 Auth0 User: {...}
🔍 Roles claim: [...] ou undefined
🔍 Final role: admin ou customer
```

**Si "undefined"** :
- L'action Auth0 n'est pas active
- Retournez dans Auth0 > Actions > Triggers > Login
- Vérifiez que l'action est déployée

**Si "customer"** :
- Le rôle n'est pas assigné
- Vérifiez User Management > Users > Votre compte > Roles

---

### Commandes Vides

```bash
# Tester l'API
curl http://localhost:3000/api/orders
```

**Si vide** :
- Vous n'avez pas encore passé de commande
- Les commandes ont été créées avec `userId: null`
- Vérifiez avec Prisma Studio

---

## ✅ Checklist

- [ ] Auth0 : Rôles créés
- [ ] Auth0 : Action créée et déployée
- [ ] Auth0 : Rôle admin assigné
- [ ] Site : Déconnecté/Reconnecté
- [ ] Console : Logs 🔍 vérifiés
- [ ] Header : Lien Admin visible
- [ ] Dashboard : /admin accessible

---

## 📚 Plus d'Infos

- **Auth0** : `AUTH0-V4-CORRECT.md`
- **Problèmes** : `PROBLÈMES-RÉSOLUS.md`
- **Résumé** : `RÉSUMÉ-FINAL.md`

---

**DITES-MOI** ce que vous voyez dans les logs après reconnexion ! 🔍







