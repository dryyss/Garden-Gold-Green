'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faBox } from '@fortawesome/free-solid-svg-icons'

interface Variant {
  id: string
  weight: number
  unit: string
  priceCents: number
  stock: number
  sku: string
  isDefault: boolean
}

interface VariantSelectorProps {
  variants: Variant[]
  selectedVariant: Variant
  onVariantChange: (variant: Variant) => void
  className?: string
}

export function VariantSelector({ 
  variants, 
  selectedVariant, 
  onVariantChange,
  className = ''
}: VariantSelectorProps) {
  // Trier les variantes par poids
  const sortedVariants = [...variants].sort((a, b) => a.weight - b.weight)

  const formatPrice = (priceCents: number) => {
    return (priceCents / 100).toFixed(2)
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { label: 'Rupture de stock', color: 'text-red-500', bgColor: 'bg-red-500/10', borderColor: 'border-red-500' }
    } else if (stock < 10) {
      return { label: `Plus que ${stock} en stock`, color: 'text-orange-500', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500' }
    } else if (stock < 30) {
      return { label: `${stock} en stock`, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500' }
    } else {
      return { label: `${stock} en stock`, color: 'text-green-500', bgColor: 'bg-green-500/10', borderColor: 'border-green-500' }
    }
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <FontAwesomeIcon icon={faBox} className="w-4 h-4 text-brand-gold" />
        Choisissez votre format
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sortedVariants.map((variant) => {
          const isSelected = selectedVariant.id === variant.id
          const stockStatus = getStockStatus(variant.stock)
          const isOutOfStock = variant.stock === 0

          return (
            <button
              key={variant.id}
              onClick={() => !isOutOfStock && onVariantChange(variant)}
              disabled={isOutOfStock}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-300
                ${isSelected 
                  ? 'border-brand-gold bg-brand-gold/10 shadow-gold-glow' 
                  : isOutOfStock
                  ? 'border-gray-600 bg-gray-800/50 opacity-50 cursor-not-allowed'
                  : 'border-white/20 bg-white/5 hover:border-brand-gold/50 hover:bg-white/10'
                }
              `}
            >
              {/* Badge de sélection */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-black" />
                </div>
              )}

              {/* Poids */}
              <div className="text-left mb-2">
                <div className="text-2xl font-bold text-white">
                  {variant.weight}{variant.unit}
                </div>
                {variant.isDefault && (
                  <div className="inline-block mt-1 px-2 py-0.5 bg-brand-green/20 text-brand-green text-xs rounded-full">
                    Populaire
                  </div>
                )}
              </div>

              {/* Prix */}
              <div className="text-left mb-2">
                <div className="text-xl font-bold text-brand-gold">
                  {formatPrice(variant.priceCents)} €
                </div>
                <div className="text-xs text-gray-400">
                  {(variant.priceCents / 100 / variant.weight).toFixed(2)} €/{variant.unit}
                </div>
              </div>

              {/* Stock */}
              <div className={`text-xs ${stockStatus.color} flex items-center gap-1`}>
                <div className={`w-2 h-2 rounded-full ${stockStatus.bgColor} ${stockStatus.borderColor} border`}></div>
                {stockStatus.label}
              </div>

              {/* Badge rupture de stock */}
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl">
                  <span className="text-red-500 font-bold text-sm">Rupture de stock</span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Informations sur la variante sélectionnée */}
      <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-gray-400 text-sm">Format sélectionné :</span>
            <span className="text-white font-semibold ml-2">
              {selectedVariant.weight}{selectedVariant.unit}
            </span>
          </div>
          <div>
            <span className="text-gray-400 text-sm">SKU :</span>
            <span className="text-white font-mono text-sm ml-2">
              {selectedVariant.sku}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}


import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faBox } from '@fortawesome/free-solid-svg-icons'

interface Variant {
  id: string
  weight: number
  unit: string
  priceCents: number
  stock: number
  sku: string
  isDefault: boolean
}

interface VariantSelectorProps {
  variants: Variant[]
  selectedVariant: Variant
  onVariantChange: (variant: Variant) => void
  className?: string
}

export function VariantSelector({ 
  variants, 
  selectedVariant, 
  onVariantChange,
  className = ''
}: VariantSelectorProps) {
  // Trier les variantes par poids
  const sortedVariants = [...variants].sort((a, b) => a.weight - b.weight)

  const formatPrice = (priceCents: number) => {
    return (priceCents / 100).toFixed(2)
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { label: 'Rupture de stock', color: 'text-red-500', bgColor: 'bg-red-500/10', borderColor: 'border-red-500' }
    } else if (stock < 10) {
      return { label: `Plus que ${stock} en stock`, color: 'text-orange-500', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500' }
    } else if (stock < 30) {
      return { label: `${stock} en stock`, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500' }
    } else {
      return { label: `${stock} en stock`, color: 'text-green-500', bgColor: 'bg-green-500/10', borderColor: 'border-green-500' }
    }
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <FontAwesomeIcon icon={faBox} className="w-4 h-4 text-brand-gold" />
        Choisissez votre format
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sortedVariants.map((variant) => {
          const isSelected = selectedVariant.id === variant.id
          const stockStatus = getStockStatus(variant.stock)
          const isOutOfStock = variant.stock === 0

          return (
            <button
              key={variant.id}
              onClick={() => !isOutOfStock && onVariantChange(variant)}
              disabled={isOutOfStock}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-300
                ${isSelected 
                  ? 'border-brand-gold bg-brand-gold/10 shadow-gold-glow' 
                  : isOutOfStock
                  ? 'border-gray-600 bg-gray-800/50 opacity-50 cursor-not-allowed'
                  : 'border-white/20 bg-white/5 hover:border-brand-gold/50 hover:bg-white/10'
                }
              `}
            >
              {/* Badge de sélection */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-black" />
                </div>
              )}

              {/* Poids */}
              <div className="text-left mb-2">
                <div className="text-2xl font-bold text-white">
                  {variant.weight}{variant.unit}
                </div>
                {variant.isDefault && (
                  <div className="inline-block mt-1 px-2 py-0.5 bg-brand-green/20 text-brand-green text-xs rounded-full">
                    Populaire
                  </div>
                )}
              </div>

              {/* Prix */}
              <div className="text-left mb-2">
                <div className="text-xl font-bold text-brand-gold">
                  {formatPrice(variant.priceCents)} €
                </div>
                <div className="text-xs text-gray-400">
                  {(variant.priceCents / 100 / variant.weight).toFixed(2)} €/{variant.unit}
                </div>
              </div>

              {/* Stock */}
              <div className={`text-xs ${stockStatus.color} flex items-center gap-1`}>
                <div className={`w-2 h-2 rounded-full ${stockStatus.bgColor} ${stockStatus.borderColor} border`}></div>
                {stockStatus.label}
              </div>

              {/* Badge rupture de stock */}
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl">
                  <span className="text-red-500 font-bold text-sm">Rupture de stock</span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Informations sur la variante sélectionnée */}
      <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-gray-400 text-sm">Format sélectionné :</span>
            <span className="text-white font-semibold ml-2">
              {selectedVariant.weight}{selectedVariant.unit}
            </span>
          </div>
          <div>
            <span className="text-gray-400 text-sm">SKU :</span>
            <span className="text-white font-mono text-sm ml-2">
              {selectedVariant.sku}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

