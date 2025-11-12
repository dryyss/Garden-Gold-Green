import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { sendPasswordResetEmail } from '@/lib/email'

const prisma = new PrismaClient()
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      // On renvoie un succès même si l'utilisateur n'existe pas pour éviter l'énumération
      return NextResponse.json({ success: true })
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '1h' }
    )

    const resetLink = `${APP_URL}/reset-password?token=${encodeURIComponent(token)}`

    await sendPasswordResetEmail(
      user.email,
      user.name || user.email.split('@')[0] || 'Client',
      resetLink
    ).catch(error => {
      console.error('❌ Erreur envoi email reset password:', error)
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Erreur demande reset password:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la demande de réinitialisation' },
      { status: 500 }
    )
  }
}


