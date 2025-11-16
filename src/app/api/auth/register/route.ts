import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte avec cet email existe déjà' },
        { status: 409 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    // Créer l'utilisateur (id requis car il n'y a pas de default dans Prisma)
    const userId = `local-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        id: userId,
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'customer'
      }
    })

    // Envoyer l'email de bienvenue (asynchrone)
    sendWelcomeEmail(user.email, user.name || user.email.split('@')[0] || 'Client').catch(error => {
      console.error('❌ Erreur lors de l\'envoi de l\'email de bienvenue:', error)
    })

    // Générer le token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '7d' }
    )

    // Retourner les données utilisateur (sans le mot de passe)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt
    }

    return NextResponse.json({
      token,
      user: userData,
      message: 'Compte créé avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'inscription' },
      { status: 500 }
    )
  }
}


