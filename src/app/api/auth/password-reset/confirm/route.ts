import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

interface ResetTokenPayload {
  userId: string
  email: string
  iat: number
  exp: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token et nouveau mot de passe requis' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      )
    }

    let payload: ResetTokenPayload
    try {
      payload = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback-secret-key'
      ) as ResetTokenPayload
    } catch (error) {
      return NextResponse.json(
        { error: 'Token invalide ou expiré' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    })

    if (!user || user.email.toLowerCase() !== payload.email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Utilisateur introuvable' },
        { status: 404 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Erreur réinitialisation mot de passe:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la réinitialisation du mot de passe' },
      { status: 500 }
    )
  }
}


