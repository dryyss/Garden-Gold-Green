import { getSession, updateUser } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { phone, address } = body

    // Mettre à jour les métadonnées utilisateur dans Auth0
    await updateUser(session.user.sub, {
      user_metadata: {
        phone,
        address
      }
    })

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

