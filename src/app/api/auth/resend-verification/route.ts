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
      
      const errorMessage = error.message || 'Une erreur est survenue'
      
      // Si l'erreur indique que l'email est déjà vérifié, on le signale
      if (
        errorMessage.includes('already verified') ||
        errorMessage.includes('email_verified') ||
        errorMessage.includes('déjà vérifié')
      ) {
        return NextResponse.json({
          success: false,
          error: 'Votre email est déjà vérifié'
        }, { status: 400 })
      }
      
      // Si le service d'email n'est pas configuré
      if (errorMessage.includes('email service') || errorMessage.includes('email provider')) {
        return NextResponse.json({
          success: false,
          error: 'Service d\'email non configuré. Veuillez contacter le support.',
          details: 'Le service d\'envoi d\'email n\'est pas configuré dans Auth0. Veuillez configurer un fournisseur d\'email (SendGrid, Mailgun, etc.) dans le dashboard Auth0.'
        }, { status: 500 })
      }
      
      // Si l'utilisateur n'existe pas
      if (errorMessage.includes('non trouvé') || errorMessage.includes('not found')) {
        return NextResponse.json({
          success: false,
          error: 'Utilisateur non trouvé'
        }, { status: 404 })
      }
      
      return NextResponse.json(
        { 
          success: false,
          error: 'Erreur lors de l\'envoi de l\'email de vérification',
          details: errorMessage
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




