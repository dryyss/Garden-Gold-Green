import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { getAuth0UserRoles } from '@/lib/auth0-management'

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession(request)
    
    if (!session?.user?.sub) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const auth0UserId = session.user.sub
    
    try {
      const roles = await getAuth0UserRoles(auth0UserId)
      
      return NextResponse.json({
        success: true,
        roles,
        userId: auth0UserId,
      })
    } catch (error: any) {
      console.error('❌ Erreur récupération rôles Auth0:', error)
      return NextResponse.json(
        { 
          error: 'Impossible de récupérer les rôles',
          details: error.message 
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('❌ Erreur route user-roles:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}



