# 🔍 Diagnostic des erreurs

## Quelle erreur rencontrez-vous exactement ?

### 1. Erreur de build TypeScript ?

**Symptômes** : Le build échoue avec une erreur TypeScript

**Vérification** :
```bash
npm run build
```

**Si vous voyez** :
```
Type error: Type 'product' is not assignable to type 'OpenGraph'
```

**Solution** : ✅ Déjà corrigé dans le code. Vérifiez que vous avez bien pull les dernières modifications :
```bash
git pull origin main
```

---

### 2. Erreur "via.placeholder.com" ?

**Symptômes** : Erreurs dans les logs comme :
```
[TypeError: fetch failed] {
  [cause]: [Error: getaddrinfo EAI_AGAIN via.placeholder.com]
}
```

**Vérification** :
```bash
grep -r "via.placeholder.com" src/
```

**Si vous trouvez des résultats** : ✅ Déjà corrigé. Vérifiez que vous avez bien pull les dernières modifications.

---

### 3. Erreur "/logo.png received null" ?

**Symptômes** : 
```
⨯ The requested resource isn't a valid image for /logo.png received null
```

**Causes possibles** :
1. Les logos ne sont pas dans le dossier `public/`
2. Les logos ne sont pas déployés sur Clever Cloud
3. Le chemin est incorrect

**Vérification** :
```bash
ls -la public/logo*.png
```

**Solution** :
1. Vérifiez que `public/logo.png` et `public/logo2.png` existent
2. Vérifiez qu'ils sont bien commités :
```bash
git ls-files public/logo*.png
```
3. Si absents, ajoutez-les :
```bash
git add public/logo*.png
git commit -m "Ajout des logos"
git push
```

---

### 4. Erreur Auth0 "Callback URL mismatch" ?

**Symptômes** : Dans les logs Auth0 :
```
Failed Login - Callback URL mismatch. https://gardengoldgr...
```

**Solution** : ⚠️ **À corriger dans Auth0 Dashboard** (pas dans le code)

1. Allez sur https://manage.auth0.com/
2. Applications > "Garden Gold Green"
3. Dans "Allowed Callback URLs", mettez :
   ```
   https://gardengoldgreen.com/api/auth/callback,http://localhost:3000/api/auth/callback
   ```
4. Sauvegardez

**Voir** : `AUTH0-CALLBACK-URGENT-FIX.md` pour plus de détails

---

### 5. Erreur Prisma "table Product does not exist" ?

**Symptômes** :
```
Invalid `prisma.product.findMany()` invocation:
The table `public.Product` does not exist in the current database.
```

**Solution** :
1. Vérifiez que `DATABASE_URL` est correctement configurée dans Clever Cloud
2. Exécutez les migrations :
```bash
npx prisma migrate deploy
```

---

## Vérification rapide

### 1. Vérifiez que vous avez les dernières modifications

```bash
cd garden-gold-green
git pull origin main
git status
```

### 2. Vérifiez les erreurs de build localement

```bash
npm run build
```

### 3. Vérifiez les logs Clever Cloud

Allez dans Clever Cloud > Votre app > Logs

---

## Partagez ces informations

Pour vous aider plus précisément, partagez :

1. **Le message d'erreur exact** (copier-coller)
2. **Où l'erreur apparaît** :
   - Build local ?
   - Build Clever Cloud ?
   - Runtime (quand vous utilisez l'app) ?
   - Logs Auth0 ?
3. **Les logs récents** de Clever Cloud (si applicable)

