import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

/**
 * Script pour créer un utilisateur admin
 * Usage: tsx scripts/create-admin-user.ts <email> <password>
 */
async function createAdminUser(email: string, password: string) {
  try {
    console.log(`🔨 Création d'un utilisateur admin avec l'email: ${email}`)
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      console.log('⚠️  L\'utilisateur existe déjà')
      
      // Demander si on veut mettre à jour le rôle
      await prisma.user.update({
        where: { email: email.toLowerCase() },
        data: { role: 'admin' }
      })
      
      console.log('✅ Rôle admin assigné à l\'utilisateur existant')
      return
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    // Créer l'utilisateur admin
    // Générer un ID basé sur l'email (format similaire à auth0)
    const userId = `admin-${email.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
    
    const admin = await prisma.user.create({
      data: {
        id: userId,
        email: email.toLowerCase(),
        name: 'Administrator',
        password: hashedPassword,
        role: 'admin'
      }
    })

    console.log('✅ Utilisateur admin créé avec succès!')
    console.log(`   ID: ${admin.id}`)
    console.log(`   Email: ${admin.email}`)
    console.log(`   Rôle: ${admin.role}`)
    console.log('\n🔑 Vous pouvez maintenant vous connecter avec ces identifiants')

  } catch (error) {
    console.error('❌ Erreur lors de la création:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Exécution du script
const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
  console.error('❌ Usage: tsx scripts/create-admin-user.ts <email> <password>')
  console.error('   Exemple: tsx scripts/create-admin-user.ts admin@example.com MySecurePass123!')
  process.exit(1)
}

createAdminUser(email, password)
  .then(() => process.exit(0))
  .catch(() => process.exit(1))

