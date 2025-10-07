'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

interface QuantitySelectorProps {
  quantity: number
  onQuantityChange: (quantity: number) => void
  min?: number
  max?: number
  className?: string
}

export function QuantitySelector({ 
  quantity, 
  onQuantityChange, 
  min = 1, 
  max = 99,
  className = ''
}: QuantitySelectorProps) {
  const handleIncrement = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1)
    }
  }

  const handleDecrement = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value >= min && value <= max) {
      onQuantityChange(value)
    }
  }

  return (
    <div className={`flex items-center border border-white/20 rounded-lg ${className}`}>
      <button
        onClick={handleDecrement}
        disabled={quantity <= min}
        className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Diminuer la quantité"
      >
        <FontAwesomeIcon icon={faMinus} className="text-sm" />
      </button>
      
      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={min}
        max={max}
        className="w-16 text-center bg-transparent text-white border-none outline-none focus:outline-none"
      />
      
      <button
        onClick={handleIncrement}
        disabled={quantity >= max}
        className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Augmenter la quantité"
      >
        <FontAwesomeIcon icon={faPlus} className="text-sm" />
      </button>
    </div>
  )
}
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

interface QuantitySelectorProps {
  quantity: number
  onQuantityChange: (quantity: number) => void
  min?: number
  max?: number
  className?: string
}

export function QuantitySelector({ 
  quantity, 
  onQuantityChange, 
  min = 1, 
  max = 99,
  className = ''
}: QuantitySelectorProps) {
  const handleIncrement = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1)
    }
  }

  const handleDecrement = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value >= min && value <= max) {
      onQuantityChange(value)
    }
  }

  return (
    <div className={`flex items-center border border-white/20 rounded-lg ${className}`}>
      <button
        onClick={handleDecrement}
        disabled={quantity <= min}
        className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Diminuer la quantité"
      >
        <FontAwesomeIcon icon={faMinus} className="text-sm" />
      </button>
      
      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={min}
        max={max}
        className="w-16 text-center bg-transparent text-white border-none outline-none focus:outline-none"
      />
      
      <button
        onClick={handleIncrement}
        disabled={quantity >= max}
        className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Augmenter la quantité"
      >
        <FontAwesomeIcon icon={faPlus} className="text-sm" />
      </button>
    </div>
  )
}