import { prisma } from '@/lib/prisma'

export interface ProductVariant {
  id?: string
  title?: string
  weight?: number
  unit?: string
  priceCents?: number | string
  stock?: number | string
  sku?: string
  isDefault?: boolean
}

export interface ProductRecord {
  id: string
  title: string
  slug: string
  description?: string
  priceCents: number
  currency: string
  cbdPercent?: number | null
  sku?: string
  stock: number
  images: string[] | string
  published: boolean
  isFeatured?: boolean
  isNew?: boolean
  isOnSale?: boolean
  categories?: Array<{ name: string; slug: string }>
  variants?: ProductVariant[]
  totalStock?: number
  createdAt?: string
  updatedAt?: string
}

// Convertir Prisma Product vers ProductRecord
function prismaProductToRecord(product: any): ProductRecord {
  // Parser les images depuis JSON string
  let images: string[] = []
  try {
    if (typeof product.images === 'string') {
      images = JSON.parse(product.images)
    } else if (Array.isArray(product.images)) {
      images = product.images
    }
  } catch {
    images = []
  }

  // Calculer le stock total (produit + variantes)
  const variantsStock = product.variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) || 0
  const totalStock = (product.stock || 0) + variantsStock

  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.description || undefined,
    priceCents: product.priceCents,
    currency: product.currency || 'EUR',
    cbdPercent: product.cbdPercent,
    sku: product.sku || undefined,
    stock: product.stock || 0,
    images: images,
    published: product.published !== false,
    isFeatured: product.isFeatured || false,
    isNew: product.isNew || false,
    isOnSale: product.isOnSale || false,
    categories: product.categories?.map((cat: any) => ({
      name: cat.name,
      slug: cat.slug
    })) || [],
    variants: product.variants?.map((v: any) => ({
      id: v.id,
      title: v.title,
      priceCents: v.priceCents,
      stock: v.stock,
      sku: v.sku || undefined
    })) || [],
    totalStock,
    createdAt: product.createdAt?.toISOString(),
    updatedAt: product.updatedAt?.toISOString()
  }
}

export async function listProducts(): Promise<ProductRecord[]> {
  try {
    const products = await prisma.product.findMany({
      include: {
        categories: true,
        variants: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return products.map(prismaProductToRecord)
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération des produits:', error)
    return []
  }
}

export async function getProductById(id: string): Promise<ProductRecord | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        categories: true,
        variants: true
      }
    })
    return product ? prismaProductToRecord(product) : null
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération du produit:', error)
    return null
  }
}

export async function getProductBySlug(slug: string): Promise<ProductRecord | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        categories: true,
        variants: true
      }
    })
    return product ? prismaProductToRecord(product) : null
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération du produit:', error)
    return null
  }
}

export async function upsertProduct(
  product: Omit<ProductRecord, 'createdAt' | 'updatedAt'> & Partial<ProductRecord>
): Promise<ProductRecord> {
  try {
    // Convertir les images en JSON string
    const imagesJson = Array.isArray(product.images)
      ? JSON.stringify(product.images)
      : typeof product.images === 'string'
      ? JSON.stringify([product.images])
      : JSON.stringify([])

    // Préparer les catégories
    const categorySlugs = product.categories?.map(cat => cat.slug) || []

    const productData: any = {
      title: product.title,
      slug: product.slug,
      description: product.description || null,
      priceCents: product.priceCents,
      currency: product.currency || 'EUR',
      cbdPercent: product.cbdPercent ?? null,
      sku: product.sku || null,
      stock: product.stock || 0,
      images: imagesJson,
      published: product.published !== false,
      isFeatured: product.isFeatured || false,
      isNew: product.isNew || false,
      isOnSale: product.isOnSale || false,
      categories: {
        connect: categorySlugs.map(slug => ({ slug }))
      }
    }

    let result
    const existing = await prisma.product.findUnique({
      where: { id: product.id },
      include: { categories: true, variants: true }
    })

    if (existing) {
      // Mettre à jour
      result = await prisma.product.update({
        where: { id: product.id },
        data: productData,
        include: {
          categories: true,
          variants: true
        }
      })

      // Mettre à jour les variantes si fournies
      if (product.variants && product.variants.length > 0) {
        // Supprimer les anciennes variantes
        await prisma.productVariant.deleteMany({
          where: { productId: product.id }
        })

        // Créer les nouvelles variantes
        await prisma.productVariant.createMany({
          data: product.variants.map(variant => ({
            id: variant.id || `${product.id}-${variant.title || 'default'}`,
            title: variant.title || product.title,
            priceCents: typeof variant.priceCents === 'string'
              ? parseInt(variant.priceCents)
              : variant.priceCents || product.priceCents,
            stock: typeof variant.stock === 'string'
              ? parseInt(variant.stock)
              : variant.stock || 0,
            productId: product.id
          }))
        })

        // Recharger avec les nouvelles variantes
        result = await prisma.product.findUnique({
          where: { id: product.id },
          include: { categories: true, variants: true }
        })!
      }
    } else {
      // Créer
      result = await prisma.product.create({
        data: {
          ...productData,
          id: product.id,
          variants: {
            create: (product.variants || []).map(variant => ({
              id: variant.id || `${product.id}-${variant.title || 'default'}`,
              title: variant.title || product.title,
              priceCents: typeof variant.priceCents === 'string'
                ? parseInt(variant.priceCents)
                : variant.priceCents || product.priceCents,
              stock: typeof variant.stock === 'string'
                ? parseInt(variant.stock)
                : variant.stock || 0
            }))
          }
        },
        include: {
          categories: true,
          variants: true
        }
      })
    }

    return prismaProductToRecord(result)
  } catch (error: any) {
    console.error('❌ Erreur lors de la sauvegarde du produit:', error)
    throw error
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    await prisma.product.delete({
      where: { id }
    })
    return true
  } catch (error: any) {
    console.error('❌ Erreur suppression produit:', error)
    return false
  }
}

export async function filterProducts(filters: {
  search?: string
  category?: string
  featured?: boolean
  published?: boolean
  lowStock?: boolean
}): Promise<ProductRecord[]> {
  try {
    const where: any = {}

    if (filters.published !== undefined) {
      where.published = filters.published
    }

    if (filters.featured !== undefined) {
      where.isFeatured = filters.featured
    }

    if (filters.category) {
      where.categories = {
        some: {
          slug: filters.category
        }
      }
    }

    if (filters.lowStock) {
      where.stock = {
        lte: 10
      }
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        categories: true,
        variants: true
      },
      orderBy: { createdAt: 'desc' }
    })

    let filtered = products.map(prismaProductToRecord)

    // Filtre de recherche (fait en mémoire car Prisma ne supporte pas bien le full-text search)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.sku?.toLowerCase().includes(searchLower)
      )
    }

    return filtered
  } catch (error: any) {
    console.error('❌ Erreur lors du filtrage des produits:', error)
    return []
  }
}

