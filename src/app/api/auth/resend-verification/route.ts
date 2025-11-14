import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { sendVerificationEmail } from '@/lib/auth0-management'

export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession(request)

    if (!session?.user?.sub) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      )
    }

    const userId = session.user.sub

    console.log(`📧 Renvoi d'email de vérification pour l'utilisateur ${userId}`)

    try {
      await sendVerificationEmail(userId)
      
      return NextResponse.json({
        success: true,
        message: 'Email de vérification envoyé avec succès'
      })
    } catch (error: any) {
      console.error('❌ Erreur lors du renvoi de l\'email de vérification:', error)
      
      // Si l'erreur indique que l'email est déjà vérifié, on le signale
      if (error.message?.includes('already verified') || error.message?.includes('email_verified')) {
        return NextResponse.json({
          success: false,
          error: 'Votre email est déjà vérifié'
        }, { status: 400 })
      }
      
      return NextResponse.json(
        { 
          success: false,
          error: 'Erreur lors de l\'envoi de l\'email de vérification',
          details: error.message || 'Une erreur est survenue'
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('❌ Erreur dans resend-verification:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur interne du serveur',
        details: error.message || 'Une erreur est survenue'
      },
      { status: 500 }
    )
  }
}

