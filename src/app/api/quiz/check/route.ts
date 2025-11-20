import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'

/**
 * API pour vérifier si l'utilisateur a déjà complété le quiz
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession(request)
    const userId = session?.user?.sub

    if (!userId) {
      // Si l'utilisateur n'est pas connecté, on ne peut pas vérifier côté serveur
      // Le client utilisera localStorage
      return NextResponse.json({
        completed: false,
        userId: null,
      })
    }

    // Vérifier dans localStorage côté client (on retourne juste l'info que l'utilisateur est connecté)
    // Le client vérifiera localStorage avec la clé `quiz_completed_${userId}`
    return NextResponse.json({
      completed: false, // Le client vérifiera localStorage
      userId,
    })
  } catch (error: any) {
    console.error('❌ Erreur lors de la vérification du quiz:', error)
    return NextResponse.json(
      {
        completed: false,
        error: 'Erreur lors de la vérification',
      },
      { status: 500 }
    )
  }
}

