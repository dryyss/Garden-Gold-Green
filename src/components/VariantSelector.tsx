'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

interface Variant {
  id: string
  weight: number
  unit: string
  priceCents: number
  stock: number
  sku: string
  isDefault?: boolean
}

interface VariantSelectorProps {
  variants: Variant[]
  selectedVariant: Variant
  onVariantChange: (variant: Variant) => void
}

export function VariantSelector({
  variants,
  selectedVariant,
  onVariantChange,
}: VariantSelectorProps) {
  if (!variants || variants.length === 0) {
    return null
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-3">
        Grammage
      </label>
      <div className="grid grid-cols-3 gap-3">
        {variants.map((variant) => {
          const isSelected = selectedVariant.id === variant.id
          const isOutOfStock = variant.stock === 0
          const price = (variant.priceCents / 100).toFixed(2)

          return (
            <button
              key={variant.id}
              onClick={() => !isOutOfStock && onVariantChange(variant)}
              disabled={isOutOfStock}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-300
                ${isSelected
                  ? 'border-brand-gold bg-brand-gold/10 shadow-gold-glow'
                  : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                }
                ${isOutOfStock
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
                }
              `}
            >
              {/* Checkmark */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-brand-gold rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faCheck} className="text-black text-xs" />
                </div>
              )}

              {/* Weight */}
              <div className="text-center">
                <div className={`text-lg font-bold ${isSelected ? 'text-brand-gold' : 'text-white'}`}>
                  {variant.weight}{variant.unit}
                </div>

                {/* Price */}
                <div className={`text-sm mt-1 ${isSelected ? 'text-brand-gold' : 'text-gray-400'}`}>
                  {price} €
                </div>

                {/* Stock indicator */}
                {isOutOfStock ? (
                  <div className="text-xs text-red-500 mt-1">Rupture</div>
                ) : variant.stock < 10 ? (
                  <div className="text-xs text-orange-500 mt-1">
                    Plus que {variant.stock}
                  </div>
                ) : null}
              </div>
            </button>
          )
        })}
      </div>

      {/* Price per unit info */}
      {selectedVariant && (
        <div className="mt-3 text-xs text-gray-400">
          Prix unitaire : {(selectedVariant.priceCents / 100 / selectedVariant.weight).toFixed(2)} €/{selectedVariant.unit}
        </div>
      )}
    </div>
  )
}

