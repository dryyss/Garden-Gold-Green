# Corrections des Variables d'Environnement Clever Cloud

## Problèmes identifiés

1. ❌ **URLs en localhost** : Plusieurs variables utilisent `http://localhost:3000` au lieu de l'URL de production
2. ❌ **APP_BASE_URL manquant** : Variable requise pour Auth0 v4
3. ❌ **Espaces en fin de valeurs** : Certaines valeurs ont des espaces superflus

## Variables à modifier dans Clever Cloud

### 1. Ajouter APP_BASE_URL (NOUVELLE VARIABLE)

```json
{
  "name": "APP_BASE_URL",
  "value": "https://gardengoldgreen.com"
}
```

**OU** si vous avez un autre domaine de production, utilisez celui-ci.

### 2. Modifier les URLs de localhost vers la production

Remplacez toutes les occurrences de `http://localhost:3000` par votre URL de production :

#### AUTH0_BASE_URL
```json
{
  "name": "AUTH0_BASE_URL",
  "value": "https://gardengoldgreen.com"
}
```

#### NEXT_PUBLIC_APP_URL
```json
{
  "name": "NEXT_PUBLIC_APP_URL",
  "value": "https://gardengoldgreen.com"
}
```

#### NEXT_PUBLIC_BASE_URL
```json
{
  "name": "NEXT_PUBLIC_BASE_URL",
  "value": "https://gardengoldgreen.com"
}
```

#### NEXTAUTH_URL
```json
{
  "name": "NEXTAUTH_URL",
  "value": "https://gardengoldgreen.com"
}
```

#### STRIPE_PORTAL_RETURN_URL
```json
{
  "name": "STRIPE_PORTAL_RETURN_URL",
  "value": "https://gardengoldgreen.com/profile"
}
```

### 3. Corriger les espaces en fin de valeurs

#### SENDGRID_FROM_EMAIL
```json
{
  "name": "SENDGRID_FROM_EMAIL",
  "value": "contact@gardengoldgreen.com"
}
```
**Note** : Supprimer l'espace en fin

#### SENDGRID_TEMPLATE_ORDER_CONFIRMATION
```json
{
  "name": "SENDGRID_TEMPLATE_ORDER_CONFIRMATION",
  "value": "d-4cc6433d611c44468687c57afd199004"
}
```
**Note** : Supprimer l'espace en fin

#### SENDGRID_TEMPLATE_ORDER_SHIPPED
```json
{
  "name": "SENDGRID_TEMPLATE_ORDER_SHIPPED",
  "value": "d-f40d32806645424c8189b9a0b6d1ce38"
}
```
**Note** : Supprimer l'espace en fin

#### SENDGRID_TEMPLATE_PASSWORD_RESET
```json
{
  "name": "SENDGRID_TEMPLATE_PASSWORD_RESET",
  "value": "d-70ea34117747431982e2b1a1b629c20c"
}
```
**Note** : Supprimer l'espace en fin

#### SENDGRID_TEMPLATE_WELCOME
```json
{
  "name": "SENDGRID_TEMPLATE_WELCOME",
  "value": "d-6a8226610d11408eb2ed0fd7afd1b4bd"
}
```
**Note** : Supprimer l'espace en fin

## Variables à conserver telles quelles

Les variables suivantes sont correctes et ne nécessitent pas de modification :

- `AUTH0_ACTION_WEBHOOK_SECRET`
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`
- `AUTH0_ISSUER_BASE_URL`
- `AUTH0_M2M_AUDIENCE`
- `AUTH0_M2M_CLIENT_ID`
- `AUTH0_M2M_CLIENT_SECRET`
- `AUTH0_SECRET`
- `NEXT_PUBLIC_FORCE_ADMIN_BYPASS`
- `NEXT_PUBLIC_STRIPE_ENABLE_PAYPAL`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `SENDGRID_API_KEY`
- `SENDGRID_TEMPLATE_NEWSLETTER_WELCOME`
- `STRIPE_ENABLE_PAYPAL`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Instructions pour appliquer les modifications

1. Connectez-vous à votre dashboard Clever Cloud
2. Allez dans **Environment variables** pour votre application **Garden-Gold-Green**
3. Pour chaque variable listée ci-dessus :
   - Cliquez sur **REMOVE** pour supprimer l'ancienne valeur
   - Cliquez sur **ADD** et entrez le nouveau nom et la nouvelle valeur
4. Cliquez sur **UPDATE CHANGES** en bas de la page
5. Redéployez l'application pour que les changements prennent effet

## Vérification

Après le redéploiement, vérifiez que :
- ✅ L'avertissement `Missing: appBaseUrl` n'apparaît plus dans les logs
- ✅ Les images se chargent correctement
- ✅ Les produits sont récupérés depuis la base de données
- ✅ L'authentification Auth0 fonctionne

## Note importante

**Remplacez `https://gardengoldgreen.com` par votre URL de production réelle** si elle est différente.

