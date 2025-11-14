import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { listOrdersByUser, upsertOrder } from '@/lib/orders-store'

export async function GET(request: NextRequest) {
  try {
    // Récupérer la session utilisateur
    const session = await auth0.getSession(request)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const userId = session.user.sub
    const userEmail = session.user.email || undefined
    
    console.log(`🔍 GET /api/orders - userId: "${userId}", email: "${userEmail}"`)
    
    // Récupérer les commandes par userId ET par email (au cas où userId ne serait pas défini dans la commande)
    const orders = await listOrdersByUser(userId, userEmail)
    
    console.log(`📦 Retour de ${orders.length} commande(s)`)

    return NextResponse.json({
      success: true,
      orders,
    })

  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération des commandes:', error)
    
    // Gérer spécifiquement les erreurs de connexion à la base de données
    if (error?.code === 'P1001' || error?.code === 'P1000') {
      return NextResponse.json(
        { 
          error: 'Service temporairement indisponible',
          details: 'La connexion à la base de données n\'est pas disponible. Veuillez réessayer plus tard.',
          orders: [] // Retourner un tableau vide pour éviter les erreurs côté client
        },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur', orders: [] },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession(request)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const userId = session.user.sub
    const body = await request.json()
    const { items, totalCents, shippingAddress, customerEmail, customerName, customerPhone } = body

    console.log(`📥 POST /api/orders - userId: ${userId}`)
    console.log(`📦 Items reçus:`, JSON.stringify(items, null, 2))

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Aucun article dans la commande' },
        { status: 400 }
      )
    }

    if (!totalCents || totalCents <= 0) {
      return NextResponse.json(
        { error: 'Montant invalide' },
        { status: 400 }
      )
    }

    // Formater les items pour Prisma
    const formattedItems = items.map((item: any) => {
      // Si l'item vient du panier, il peut avoir 'id' au lieu de 'productId'
      const productId = item.productId || item.id
      if (!productId) {
        throw new Error(`Item sans productId ni id: ${JSON.stringify(item)}`)
      }
      
      // Si l'item a 'price' en euros, convertir en centimes
      let priceCents = item.priceCents
      if (!priceCents && typeof item.price === 'number') {
        priceCents = Math.round(item.price * 100)
      }
      if (typeof priceCents !== 'number') {
        throw new Error(`Item sans priceCents valide: ${JSON.stringify(item)}`)
      }
      
      return {
        productId: String(productId),
        name: item.name || item.title || `Produit ${productId}`,
        priceCents: priceCents,
        quantity: item.quantity || 1
      }
    })

    console.log(`✅ Items formatés:`, JSON.stringify(formattedItems, null, 2))

    const nowId = `MAN-${Date.now()}`
    const order = await upsertOrder({
      id: nowId,
      userId,
      status: 'pending',
      totalCents,
      currency: 'EUR',
      customerEmail: customerEmail || session.user.email || '',
      customerName: customerName || session.user.name || '',
      customerPhone: customerPhone || '',
      shippingAddress: shippingAddress || {},
      items: formattedItems,
    })

    return NextResponse.json({
      success: true,
      order,
    })

  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

