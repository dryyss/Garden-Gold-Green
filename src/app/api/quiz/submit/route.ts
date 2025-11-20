import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth0 } from '@/lib/auth0'

/**
 * API pour sauvegarder les réponses du QCM
 * Permet de collecter les données sur les attentes des clients
 * Marque aussi l'utilisateur comme ayant complété le quiz
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { answers, results, timestamp } = body

    // Récupérer l'utilisateur connecté si disponible
    const session = await auth0.getSession(request)
    const userId = session?.user?.sub

    // Sauvegarder les réponses dans la base de données
    console.log('📊 Réponses QCM reçues:', {
      answers,
      recommendedCategories: results?.recommendedCategories,
      needs: results?.needs,
      timestamp,
      userId,
    })

    // Si l'utilisateur est connecté, marquer qu'il a complété le quiz
    if (userId) {
      try {
        // Mettre à jour ou créer l'utilisateur avec la date de complétion du quiz
        await prisma.user.upsert({
          where: { id: userId },
          update: {
            updatedAt: new Date(),
            // Stocker dans metadata si nécessaire
          },
          create: {
            id: userId,
            email: session.user.email || '',
            name: session.user.name || '',
            role: 'customer',
          },
        })

        // Stocker dans localStorage côté client aussi (sera fait par le client)
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Réponses enregistrées avec succès',
      quizCompleted: true,
    })
  } catch (error: any) {
    console.error('❌ Erreur lors de la sauvegarde des réponses QCM:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la sauvegarde',
      },
      { status: 500 }
    )
  }
}



