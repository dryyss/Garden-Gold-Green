# Flux de Sauvegarde et Récupération des Commandes

## 📋 Vue d'ensemble

Ce document explique comment les modifications des commandes sont sauvegardées par les admins et comment les clients récupèrent leurs informations de commande.

---

## 🔧 **1. SAUVEGARDE DES MODIFICATIONS (Côté Admin)**

### Endpoint: `PATCH /api/orders/admin`

**Localisation:** `src/app/api/orders/admin/route.ts`

**Fonctionnement:**

1. **Authentification:** 
   - Vérifie que l'utilisateur est admin/owner via `requireAdmin()`
   - Protégé par `src/lib/auth-utils.ts`

2. **Réception des données:**
   ```typescript
   {
     orderId: string,
     status?: string,
     trackingNumber?: string,
     carrier?: string,
     carrierTrackingUrl?: string,
     shippingStatus?: string,
     shippedAt?: string,
     deliveredAt?: string,
     estimatedDeliveryDate?: string,
     shippingHistoryEntry?: {
       status: string,
       message?: string,
       date?: string
     }
   }
   ```

3. **Traitement:**
   - Récupère la commande existante via `readOrdersMap()`
   - Met à jour l'historique de suivi si `shippingHistoryEntry` est fourni
   - Fusionne les nouvelles données avec les données existantes

4. **Sauvegarde dans Prisma:**
   - Appelle `upsertOrder()` dans `src/lib/orders-store.ts`
   - Utilise une transaction Prisma pour garantir la cohérence
   - Met à jour le champ `shippingInfo` (JSON) qui contient:
     ```json
     {
       "trackingNumber": "...",
       "carrier": "...",
       "carrierTrackingUrl": "...",
       "shippingStatus": "...",
       "shippedAt": "ISO_DATE",
       "estimatedDeliveryDate": "ISO_DATE",
       "history": [
         {
           "date": "ISO_DATE",
           "status": "...",
           "message": "..."
         }
       ]
     }
     ```

5. **Notification automatique:**
   - Si le statut passe à `"shipped"`, envoie un email au client
   - Utilise `sendOrderShippedEmail()` avec le numéro de suivi

**Exemple d'utilisation depuis l'admin:**
```typescript
// Dans src/app/admin/orders/[id]/page.tsx
const res = await fetch('/api/orders/admin', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderId: order.id,
    status: 'shipped',
    trackingNumber: '6A1234567890',
    carrier: 'La Poste',
    carrierTrackingUrl: 'https://...',
    shippingStatus: 'En transit',
    shippedAt: new Date().toISOString(),
    shippingHistoryEntry: {
      status: 'Colis expédié',
      message: 'Votre colis a été pris en charge par La Poste'
    }
  })
})
```

---

## 👤 **2. RÉCUPÉRATION DES COMMANDES (Côté Client)**

### A. Commandes de l'utilisateur connecté

**Endpoint:** `GET /api/orders`

**Localisation:** `src/app/api/orders/route.ts`

**Fonctionnement:**

1. **Authentification:**
   - Vérifie la session Auth0
   - Récupère `userId` depuis `session.user.sub`

2. **Récupération:**
   - Appelle `listOrdersByUser(userId)` dans `src/lib/orders-store.ts`
   - Requête Prisma: `prisma.order.findMany({ where: { userId } })`
   - Inclut les items avec leurs produits associés

3. **Retour:**
   ```json
   {
     "success": true,
     "orders": [
       {
         "id": "CMD-20251111-6541",
         "status": "shipped",
         "totalCents": 3980,
         "trackingNumber": "6A1234567890",
         "carrier": "La Poste",
         "shippingHistory": [...],
         "items": [...]
       }
     ]
   }
   ```

**Utilisation côté client:**
```typescript
// Dans src/app/orders/page.tsx
const response = await fetch('/api/orders')
const data = await response.json()
setOrders(data.orders)
```

---

### B. Suivi public (sans connexion)

**Endpoint:** `POST /api/orders/track`

**Localisation:** `src/app/api/orders/track/route.ts`

**Fonctionnement:**

1. **Validation:**
   - Requiert `orderId` et `email` dans le body
   - Pas besoin d'authentification (route publique)

2. **Recherche:**
   - Récupère toutes les commandes via `readOrdersMap()`
   - Filtre par `orderId` ET `customerEmail` (insensible à la casse)

3. **Sécurité:**
   - Vérifie que l'email correspond exactement à celui de la commande
   - Empêche l'accès aux commandes d'autres clients

**Utilisation:**
```typescript
// Dans src/app/track-order/page.tsx
const response = await fetch('/api/orders/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderId: 'CMD-20251111-6541',
    email: 'client@example.com'
  })
})
const data = await response.json()
setOrder(data.order)
```

---

## 🗄️ **3. STRUCTURE DE DONNÉES DANS PRISMA**

### Modèle Order

```prisma
model Order {
  id              String          @id @default(cuid())
  userId          String?         // null pour commandes express
  status          String          // pending, paid, shipped, delivered, etc.
  totalCents      Int
  currency        String          @default("EUR")
  
  // Informations client
  customerEmail   String?
  customerName    String?
  customerPhone   String?
  
  // Adresses (JSON)
  shippingAddress Json?
  billingAddress  Json?
  
  // Suivi (JSON structuré)
  shippingInfo    Json?           // Contient trackingNumber, carrier, history, etc.
  
  // Dates
  deliveredAt     DateTime?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  
  // Relations
  items           OrderItem[]
  user            User?           @relation(...)
}
```

### Structure de `shippingInfo` (JSON)

```typescript
{
  trackingNumber?: string
  carrier?: string
  carrierTrackingUrl?: string
  shippingStatus?: string
  shippedAt?: string          // ISO date string
  estimatedDeliveryDate?: string  // ISO date string
  history?: Array<{
    date: string              // ISO date string
    status: string
    message?: string
  }>
}
```

---

## 🔄 **4. FLUX COMPLET**

### Scénario: Admin met à jour une commande

```
1. Admin ouvre /admin/orders/[id]
   ↓
2. Admin remplit le formulaire (tracking, transporteur, etc.)
   ↓
3. Clic sur "Mettre à jour"
   ↓
4. POST /api/orders/admin (PATCH)
   ↓
5. upsertOrder() dans orders-store.ts
   ↓
6. Transaction Prisma:
   - Met à jour Order.shippingInfo (JSON)
   - Met à jour Order.status, Order.shippedAt, etc.
   ↓
7. Si status = "shipped" → Envoi email automatique
   ↓
8. Retour de la commande mise à jour
   ↓
9. Interface admin se met à jour
```

### Scénario: Client consulte ses commandes

```
1. Client connecté ouvre /orders
   ↓
2. GET /api/orders
   ↓
3. listOrdersByUser(userId)
   ↓
4. Prisma: SELECT * FROM Order WHERE userId = ?
   ↓
5. Retour des commandes avec shippingInfo décodé
   ↓
6. Affichage dans l'interface client
   - Statut de la commande
   - Numéro de suivi
   - Historique d'expédition
   - Timeline visuelle
```

### Scénario: Suivi public (sans compte)

```
1. Client visite /track-order
   ↓
2. Saisit orderId et email
   ↓
3. POST /api/orders/track
   ↓
4. Recherche dans toutes les commandes
   - Filtre par orderId ET email
   ↓
5. Retour de la commande si trouvée
   ↓
6. Affichage des informations de suivi
```

---

## 📧 **5. NOTIFICATIONS EMAIL**

### Email d'expédition automatique

**Déclencheur:** Quand `status` passe de `!shipped` à `shipped`

**Fonction:** `sendOrderShippedEmail()` dans `src/app/api/orders/admin/route.ts`

**Contenu:**
- Numéro de commande
- Numéro de suivi
- Lien de suivi (transporteur)
- Lien vers la page de suivi du site

**Configuration:** Utilise le service d'email configuré (Resend, SendGrid, etc.)

---

## 🔐 **6. SÉCURITÉ**

### Protection Admin
- `requireAdmin()` vérifie les rôles `admin` ou `owner`
- Utilise Auth0 pour l'authentification
- Vérifie les rôles depuis `Auth0Context`

### Protection Client
- `GET /api/orders`: Vérifie `userId` via session Auth0
- `POST /api/orders/track`: Vérifie l'email correspond à la commande
- Les clients ne peuvent voir que leurs propres commandes

---

## 🛠️ **7. FONCTIONS UTILITAIRES**

### `src/lib/orders-store.ts`

- **`upsertOrder()`**: Crée ou met à jour une commande dans Prisma
- **`listOrdersByUser()`**: Liste les commandes d'un utilisateur
- **`getOrderById()`**: Récupère une commande par ID
- **`readOrdersMap()`**: Récupère toutes les commandes (admin)
- **`mapPrismaOrder()`**: Convertit Prisma Order → OrderRecord
- **`toShippingInfoPayload()`**: Structure les données de suivi

### Normalisation des données

Les données de suivi sont normalisées avant sauvegarde:
- Dates converties en ISO strings
- Historique trié par date
- Valeurs null gérées correctement

---

## 📝 **8. EXEMPLES DE REQUÊTES**

### Admin met à jour une commande

```bash
curl -X PATCH http://localhost:3000/api/orders/admin \
  -H "Content-Type: application/json" \
  -H "Cookie: appSession=..." \
  -d '{
    "orderId": "CMD-20251111-6541",
    "status": "shipped",
    "trackingNumber": "6A1234567890",
    "carrier": "La Poste",
    "carrierTrackingUrl": "https://www.laposte.fr/...",
    "shippingStatus": "En transit",
    "shippedAt": "2025-11-12T10:00:00Z",
    "shippingHistoryEntry": {
      "status": "Colis expédié",
      "message": "Votre colis a été pris en charge"
    }
  }'
```

### Client récupère ses commandes

```bash
curl http://localhost:3000/api/orders \
  -H "Cookie: appSession=..."
```

### Suivi public

```bash
curl -X POST http://localhost:3000/api/orders/track \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "CMD-20251111-6541",
    "email": "client@example.com"
  }'
```

---

## ✅ **RÉSUMÉ**

1. **Admin sauvegarde** → `PATCH /api/orders/admin` → Prisma (`shippingInfo` JSON)
2. **Client connecté** → `GET /api/orders` → Filtre par `userId`
3. **Suivi public** → `POST /api/orders/track` → Filtre par `orderId` + `email`
4. **Email automatique** → Envoyé quand `status` = `"shipped"`
5. **Données structurées** → `shippingInfo` JSON dans Prisma avec historique horodaté


