'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { AddToCartButton } from './AddToCartButton'
import { useTranslation } from '@/contexts/TranslationContext'

interface Product {
  id: string
  slug: string
  name: string
  image: string
  price: number
  rating?: number
  reviewCount?: number
  category?: string
  inStock?: boolean
  totalStock?: number
  isNew?: boolean
  isBestSeller?: boolean
}

interface ProductRecommendationsProps {
  products: Product[]
  title?: string
}

export function ProductRecommendations({ 
  products, 
  title 
}: ProductRecommendationsProps) {
  const { t } = useTranslation()
  if (products.length === 0) {
    return null
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-white mb-6 gold-text-gradient">
        {title || t('sections.youMightLike')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="card-bg rounded-xl overflow-hidden group hover:shadow-gold-glow transition-all duration-300"
          >
            {/* Image */}
            <Link
              href={`/products/${product.slug}`}
              className="block relative h-48 overflow-hidden"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.isNew && (
                  <span className="bg-brand-gold text-black text-xs font-bold px-3 py-1 rounded-full">
                    NOUVEAU
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="bg-brand-green text-white text-xs font-bold px-3 py-1 rounded-full">
                    BEST SELLER
                  </span>
                )}
                {!product.inStock && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    RUPTURE
                  </span>
                )}
              </div>
            </Link>

            {/* Content */}
            <div className="p-4">
              {/* Category */}
              {product.category && (
                <p className="text-brand-green text-xs font-semibold uppercase mb-2">
                  {product.category}
                </p>
              )}

              {/* Title */}
              <Link
                href={`/products/${product.slug}`}
                className="block mb-2"
              >
                <h3 className="text-white font-semibold text-sm line-clamp-2 hover:text-brand-gold transition-colors">
                  {product.name}
                </h3>
              </Link>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex text-brand-gold text-xs">
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon
                        key={i}
                        icon={faStar}
                        className={i < Math.floor(product.rating!) ? 'opacity-100' : 'opacity-30'}
                      />
                    ))}
                  </div>
                  {product.reviewCount && (
                    <span className="text-xs text-gray-400">
                      ({product.reviewCount})
                    </span>
                  )}
                </div>
              )}

              {/* Stock indicator */}
              {product.totalStock !== undefined && product.inStock && (
                <div className="mb-3">
                  {product.totalStock < 10 ? (
                    <span className="text-xs text-orange-500 font-semibold">
                      Plus que {product.totalStock} en stock !
                    </span>
                  ) : product.totalStock < 30 ? (
                    <span className="text-xs text-yellow-500">
                      {product.totalStock} en stock
                    </span>
                  ) : (
                    <span className="text-xs text-green-500">En stock</span>
                  )}
                </div>
              )}

              {/* Price and Action */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold gold-text-gradient">
                  {product.price.toFixed(2)} €
                </span>

                <AddToCartButton
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                  }}
                  className="px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

