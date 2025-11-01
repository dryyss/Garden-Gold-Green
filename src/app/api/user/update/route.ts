import { getAuthenticatedUser } from '@/lib/auth-utils'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { phone, address } = body

    // Pour l'instant, on simule la mise à jour
    // Dans un vrai projet, vous devriez utiliser Auth0 Management API

    return NextResponse.json(
      { message: 'Profil mis à jour avec succès' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du profil' },
      { status: 500 }
    )
  }
}

