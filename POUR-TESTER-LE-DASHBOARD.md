# 🎯 Comment Tester le Dashboard Admin

## 🚀 DÉMARRAGE RAPIDE

### 1. **Migration de la Base de Données** (IMPORTANT !)
Le nouveau modèle `Promotion` doit être ajouté à la base de données :

```bash
cd garden-gold-green
npx prisma migrate dev --name add-promotions
npx prisma generate
```

### 2. **Démarrer le Serveur**
```bash
npm run dev
```

### 3. **Accéder au Dashboard**
Ouvre ton navigateur et va sur :
```
http://localhost:3000/fr/admin
```

> **Note** : La sécurité est contournée pour les tests, tu peux accéder sans connexion.

---

## 📋 CE QU'IL FAUT TESTER

### ✅ **Dashboard Principal**
- [ ] Les statistiques s'affichent-elles correctement ?
- [ ] Les chiffres (revenus, commandes, clients) correspondent-ils à ta BDD ?
- [ ] Les commandes récentes apparaissent-elles ?

### ✅ **Onglet Orders (Commandes)**
- [ ] La liste des commandes s'affiche ?
- [ ] La recherche fonctionne (tape un email, un nom) ?
- [ ] Les filtres par statut fonctionnent ?
- [ ] Clique sur l'icône œil (👁️) → la modale s'ouvre ?
- [ ] Change le statut d'une commande → ça se met à jour ?

### ✅ **Onglet Products (Produits)**
- [ ] Les produits s'affichent avec leurs images ?
- [ ] Les stats (stock, ventes) sont correctes ?
- [ ] Les produits sans stock apparaissent en rouge ?

### ✅ **Onglet Gestion Utilisateurs** (visible uniquement si tu es Owner)
- [ ] La liste des utilisateurs s'affiche ?
- [ ] Change le rôle d'un utilisateur → ça fonctionne ?
- [ ] Clique sur l'icône poubelle → confirmation puis suppression ?
- [ ] La recherche fonctionne ?

---

## 🐛 PROBLÈMES POSSIBLES

### **Erreur : Prisma Client**
```
Error: Invalid `prisma.promotion.findMany()` invocation
```
**Solution** : Tu as oublié la migration ! Lance :
```bash
npx prisma migrate dev --name add-promotions
npx prisma generate
```

### **Erreur : Failed to fetch**
**Causes possibles** :
1. Le serveur n'est pas démarré (`npm run dev`)
2. L'API `/api/admin/...` retourne une erreur (regarde la console du terminal)

**Solution** : Regarde les logs dans ton terminal pour voir l'erreur exacte.

### **Rien ne s'affiche dans le dashboard**
**Cause** : Base de données vide
**Solution** : Ajoute des données de test :
```bash
npx prisma db seed
```

### **Les images ne s'affichent pas**
**Normal** : Les images viennent de la BDD. Si tu n'as pas de vraies images, tu verras l'icône par défaut `/products/default.svg`.

---

## 🔑 CLÉS À FOURNIR (quand tu reviens)

### **Pour l'Upload d'Images (Cloudinary)**
1. Va sur https://cloudinary.com/users/register_free
2. Inscris-toi (gratuit)
3. Récupère ces 3 valeurs dans le Dashboard Cloudinary :
```env
CLOUDINARY_CLOUD_NAME=dxyz123
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcXYZ123...
```
4. Ajoute-les dans ton fichier `.env`

---

## 📊 TESTS À EFFECTUER

### **Test 1 : Créer une Promotion**
1. Va sur l'onglet "Promotions" (je vais l'ajouter)
2. Clique sur "Ajouter une promotion"
3. Remplis :
   - Code : `NOEL2024`
   - Type : Pourcentage
   - Valeur : 20
   - Date de fin : 31/12/2024
4. Sauvegarde
5. Vérifie que ça apparaît dans la liste

### **Test 2 : Modifier un Utilisateur**
1. Va sur "Gestion Utilisateurs"
2. Change le rôle d'un client en "admin"
3. Vérifie que ça se met à jour immédiatement

### **Test 3 : Changer le Statut d'une Commande**
1. Va sur "Orders"
2. Clique sur l'œil d'une commande
3. Change le statut de "pending" à "paid"
4. Ferme la modale
5. Vérifie que le statut est bien mis à jour dans le tableau

### **Test 4 : Rechercher une Commande**
1. Va sur "Orders"
2. Tape un email dans la barre de recherche
3. Vérifie que seules les commandes correspondantes s'affichent

---

## 🎨 FONCTIONNALITÉS À VALIDER

### **Filtres et Recherche**
- [x] Recherche de commandes par email/client
- [x] Filtre par statut de commande
- [x] Recherche d'utilisateurs

### **Modales et Détails**
- [x] Modale de détails de commande
- [x] Changement de statut en temps réel

### **Gestion des Utilisateurs**
- [x] Changement de rôle
- [x] Suppression d'utilisateur
- [x] Affichage des statistiques (commandes, montant)

### **Statistiques**
- [x] Dashboard avec chiffres clés
- [x] Revenus totaux
- [x] Nombre de commandes
- [x] Nombre de clients

---

## 🚨 CE QUI MANQUE (et pourquoi)

### **Upload d'Images**
**Nécessite** : Clés Cloudinary (tu ne les as pas encore fournies)
**Impact** : Tu ne peux pas uploader d'images de produits depuis l'interface

### **Génération de Factures PDF**
**Nécessite** : Installation du package `pdf-lib` ou `jspdf`
**Impact** : Le bouton "Télécharger facture" affiche juste un message

### **Notifications Email**
**Nécessite** : Configuration SendGrid (clés déjà dans `.env` ?)
**Impact** : Pas d'email automatique aux clients

### **Interface des Promotions**
**Statut** : APIs créées, interface à ajouter dans le dashboard
**Temps estimé** : 30 min

---

## 💡 SUGGESTIONS D'AMÉLIORATIONS

### **Urgentes**
1. Tester le dashboard sur mobile
2. Vérifier que toutes les APIs fonctionnent
3. Ajouter l'onglet "Promotions" dans le dashboard

### **Importantes**
1. Ajouter l'export CSV des commandes
2. Créer l'interface pour gérer les promotions visuellement
3. Ajouter la pagination sur les listes (si > 50 éléments)

### **Nice to Have**
1. Graphiques de revenus (Chart.js)
2. Notifications en temps réel (toast au lieu d'alert)
3. Dark mode pour le dashboard

---

## 🔒 RÉACTIVER LA SÉCURITÉ

Quand les tests sont terminés et que tout fonctionne bien :

**1. Modifier le fichier `.env`**
```env
NEXT_PUBLIC_FORCE_ADMIN_BYPASS=false
BYPASS_ADMIN_SECURITY=false
```

**2. Redémarrer le serveur**
```bash
npm run dev
```

**3. Tester la connexion**
- Va sur `/fr/admin`
- Tu devrais être redirigé vers la page de connexion
- Connecte-toi avec un compte admin/owner
- Vérifie que l'accès fonctionne

---

## 📝 CHECKLIST FINALE

### Avant de déployer en production :
- [ ] Migration Prisma effectuée (`npx prisma migrate deploy`)
- [ ] Sécurité réactivée (variables d'environnement)
- [ ] Tests sur tous les onglets
- [ ] Vérification des permissions (admin vs owner)
- [ ] Test de création/modification/suppression
- [ ] Backup de la base de données

---

## 📞 EN CAS DE PROBLÈME

### Console du Navigateur (F12)
Ouvre les DevTools (F12) et regarde l'onglet "Console" pour voir les erreurs JavaScript.

### Logs du Terminal
Regarde le terminal où tourne `npm run dev` pour voir les erreurs serveur.

### Erreurs Courantes
1. **500 Internal Server Error** → Problème d'API ou de BDD
2. **401 Unauthorized** → Sécurité activée sans connexion
3. **404 Not Found** → Route API inexistante

---

**Bon courage pour les tests ! 🚀**

Si tu vois des bugs ou des choses à améliorer, note-les et on les corrigera ensemble quand tu reviendras.

