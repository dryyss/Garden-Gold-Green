import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * API pour sauvegarder les réponses du QCM
 * Permet de collecter les données sur les attentes des clients
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { answers, results, timestamp } = body

    // Sauvegarder les réponses dans la base de données
    // Note: Vous pouvez créer une table QuizResponse dans Prisma si nécessaire
    // Pour l'instant, on log juste les données
    console.log('📊 Réponses QCM reçues:', {
      answers,
      recommendedCategories: results?.recommendedCategories,
      needs: results?.needs,
      timestamp,
    })

    // TODO: Créer une table QuizResponse dans Prisma si vous voulez stocker les données
    // await prisma.quizResponse.create({
    //   data: {
    //     answers: JSON.stringify(answers),
    //     recommendedCategories: results.recommendedCategories,
    //     needs: results.needs,
    //     score: JSON.stringify(results.score),
    //   },
    // })

    return NextResponse.json({
      success: true,
      message: 'Réponses enregistrées avec succès',
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


