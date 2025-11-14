import { promises as fs } from 'fs'
import path from 'path'
import productsData from '@/data/products.json'
import categoriesData from '@/data/categories.json'

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
  categories?: Array<{ name: string; slug: string }>
  variants?: ProductVariant[]
  totalStock?: number
  createdAt?: string
  updatedAt?: string
}

type ProductsMap = Record<string, ProductRecord>

const productsFilePath = path.join(process.cwd(), 'src', 'data', 'products.json')

async function ensureProductsFile(): Promise<void> {
  try {
    await fs.access(productsFilePath)
  } catch {
    const dir = path.dirname(productsFilePath)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(productsFilePath, JSON.stringify([], null, 2), 'utf8')
  }
}

async function readProductsArray(): Promise<ProductRecord[]> {
  await ensureProductsFile()
  try {
    const raw = await fs.readFile(productsFilePath, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as ProductRecord[]) : []
  } catch (error) {
    console.error('❌ Erreur lecture products.json:', error)
    // Retourner les produits chargés depuis l'import si le fichier n'est pas accessible
    return Array.isArray(productsData) ? (productsData as ProductRecord[]) : []
  }
}

async function writeProductsArray(products: ProductRecord[]): Promise<void> {
  await ensureProductsFile()
  const content = JSON.stringify(products, null, 2)
  await fs.writeFile(productsFilePath, content, 'utf8')
}

function readProductsMap(products: ProductRecord[]): ProductsMap {
  return products.reduce<ProductsMap>((acc, product) => {
    acc[product.id] = product
    return acc
  }, {})
}

export async function listProducts(): Promise<ProductRecord[]> {
  return await readProductsArray()
}

export async function getProductById(id: string): Promise<ProductRecord | null> {
  const products = await readProductsArray()
  return products.find(p => p.id === id) || null
}

export async function getProductBySlug(slug: string): Promise<ProductRecord | null> {
  const products = await readProductsArray()
  return products.find(p => p.slug === slug) || null
}

export async function upsertProduct(
  product: Omit<ProductRecord, 'createdAt' | 'updatedAt'> & Partial<ProductRecord>
): Promise<ProductRecord> {
  const products = await readProductsArray()
  const existingIndex = products.findIndex(p => p.id === product.id)
  const now = new Date().toISOString()
  
  // Convertir categoryIds en objets categories si nécessaire
  let categories = product.categories || []
  if ((product as any).categoryIds && Array.isArray((product as any).categoryIds)) {
    const categoryIds = (product as any).categoryIds as string[]
    categories = categoryIds
      .map(id => categoriesData.find(cat => cat.id === id))
      .filter(Boolean)
      .map(cat => ({ name: cat!.name, slug: cat!.slug }))
  }

  const existing = existingIndex >= 0 ? products[existingIndex] : null
  const next: ProductRecord = {
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.description ?? existing?.description ?? '',
    priceCents: product.priceCents,
    currency: product.currency ?? existing?.currency ?? 'EUR',
    cbdPercent: product.cbdPercent ?? existing?.cbdPercent ?? null,
    sku: product.sku ?? existing?.sku,
    stock: product.stock ?? existing?.stock ?? 0,
    images: product.images ?? existing?.images ?? [],
    published: product.published ?? existing?.published ?? true,
    isFeatured: product.isFeatured ?? existing?.isFeatured ?? false,
    categories: categories.length > 0 ? categories : (existing?.categories ?? []),
    variants: product.variants ?? existing?.variants ?? [],
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  }

  if (existingIndex >= 0) {
    products[existingIndex] = next
  } else {
    products.push(next)
  }

  await writeProductsArray(products)
  return next
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await readProductsArray()
  const index = products.findIndex(p => p.id === id)
  if (index < 0) return false
  products.splice(index, 1)
  await writeProductsArray(products)
  return true
}

export async function filterProducts(filters: {
  search?: string
  category?: string
  featured?: boolean
  published?: boolean
  lowStock?: boolean
}): Promise<ProductRecord[]> {
  let products = await readProductsArray()

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    products = products.filter(p => 
      p.title.toLowerCase().includes(searchLower) ||
      p.description?.toLowerCase().includes(searchLower) ||
      p.sku?.toLowerCase().includes(searchLower)
    )
  }

  if (filters.category) {
    products = products.filter(p =>
      p.categories?.some(cat => cat.slug === filters.category)
    )
  }

  if (filters.featured !== undefined) {
    products = products.filter(p => p.isFeatured === filters.featured)
  }

  if (filters.published !== undefined) {
    products = products.filter(p => p.published === filters.published)
  }

  if (filters.lowStock) {
    products = products.filter(p => p.stock <= 10)
  }

  return products
}

