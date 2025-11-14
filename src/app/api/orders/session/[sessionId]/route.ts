import { NextRequest, NextResponse } from 'next/server'
import { readOrdersMap } from '@/lib/orders-store'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID requis' },
        { status: 400 }
      )
    }

    const orders = await readOrdersMap()
    const order = Object.values(orders).find(o => o.stripeSessionId === sessionId)

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)

  } catch (error: any) {
    console.error('❌ Erreur récupération commande:', error)
    
    // Gérer spécifiquement les erreurs de connexion à la base de données
    if (error?.code === 'P1001' || error?.code === 'P1000') {
      return NextResponse.json(
        { 
          error: 'Service temporairement indisponible',
          details: 'La connexion à la base de données n\'est pas disponible. Veuillez réessayer plus tard.'
        },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

