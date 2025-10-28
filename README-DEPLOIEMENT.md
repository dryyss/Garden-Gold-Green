# 🚀 Déploiement Rapide - Garden Gold Green

## ✅ Étape 1 : Mettre le code sur GitHub

Votre code est déjà prêt. Il faut juste le commiter et le pousser :

```bash
# Ajouter tous les fichiers modifiés
git add .

# Commit avec un message
git commit -m "Prepare for deployment"

# Pousser sur GitHub
git push
```

## 🎯 Étape 2 : Choisir votre plateforme

### Option A : Railway (RECOMMANDÉ - 5 minutes) ⭐

**C'est le plus simple !**

1. Allez sur https://railway.app
2. Créez un compte avec GitHub
3. Cliquez sur "New Project" → "Deploy from GitHub repo"
4. Sélectionnez `Garden-Gold-Green`
5. Railway détecte automatiquement Next.js
6. Cliquez sur "+ New" → "Database" → "PostgreSQL"
7. Copiez la `DATABASE_URL` qui s'affiche
8. Cliquez sur votre application → "Variables"
9. Ajoutez toutes les variables de `env.example` :
   - Ajoutez la `DATABASE_URL` de Railway
   - Ajoutez vos clés Auth0, Stripe, etc.
10. **C'est déployé !** 🎉

**URL de votre app** : `https://votre-nom.railway.app`

### Option B : Render (Gratuit)

1. Allez sur https://render.com
2. Créez un compte
3. "New" → "Web Service"
4. Connectez votre repo GitHub
5. Render détecte Next.js
6. Ajoutez une base PostgreSQL
7. Configurez vos variables
8. **C'est déployé !**

### Option C : IONOS (Complexe)

Si vous voulez absolument utiliser IONOS, suivez le guide dans `DEPLOYMENT.md`

## 📋 Variables d'environnement nécessaires

Copiez les valeurs depuis `env.example` et remplissez les vôtres :

```env
DATABASE_URL="de la base de données PostgreSQL"
AUTH0_SECRET="généré avec: openssl rand -hex 32"
AUTH0_BASE_URL="votre URL de production"
AUTH0_ISSUER_BASE_URL="votre tenant Auth0"
AUTH0_CLIENT_ID="votre client ID"
AUTH0_CLIENT_SECRET="votre client secret"
NEXTAUTH_URL="votre URL de production"
NEXTAUTH_SECRET="généré avec: openssl rand -hex 32"
JWT_SECRET="généré avec: openssl rand -hex 32"
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_APP_URL="votre URL de production"
NEXT_PUBLIC_BASE_URL="votre URL de production"
NODE_ENV="production"
```

## 🔐 Générer les secrets

Sur Windows (PowerShell) :
```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Ou sur Mac/Linux :
```bash
openssl rand -hex 32
```

## ✅ Après le déploiement

1. ✅ Vérifiez que l'application démarre
2. ✅ Configurez Auth0 avec votre URL de production
3. ✅ Configurez Stripe avec votre URL de production
4. ✅ Testez l'authentification
5. ✅ Testez un paiement

## 📚 Plus d'informations

- Guide complet : `DEPLOYMENT.md`
- Guide simple : `DEPLOIEMENT-SIMPLE.md`
- Résumé : `DEPLOIEMENT-RESUME.md`

## 🆘 Besoin d'aide ?

Si vous bloquez, commencez par Railway (le plus simple). Sinon, consultez les guides.

---

**Bon déploiement ! 🌿✨**

