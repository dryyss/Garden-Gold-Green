import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPrice(priceCents: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(priceCents / 100)
}

export function formatProductSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9\s-]/g, '') // Garde seulement lettres, chiffres, espaces et tirets
    .replace(/\s+/g, '-') // Remplace espaces par tirets
    .replace(/-+/g, '-') // Supprime les tirets multiples
    .trim()
}

export function calculateDiscount(originalPrice: number, discountedPrice: number): number {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
}

export function isOutOfStock(stock: number): boolean {
  return stock <= 0
}

export function getStockStatus(stock: number): { status: 'in-stock' | 'low-stock' | 'out-of-stock'; message: string } {
  if (stock <= 0) {
    return { status: 'out-of-stock', message: 'Rupture de stock' }
  }
  if (stock <= 5) {
    return { status: 'low-stock', message: `Plus que ${stock} en stock` }
  }
  return { status: 'in-stock', message: 'En stock' }
}
