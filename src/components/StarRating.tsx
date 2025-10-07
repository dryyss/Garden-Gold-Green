import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
  className?: string
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 'md', 
  showNumber = false,
  className = ''
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  // Ajouter les étoiles pleines
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <FontAwesomeIcon 
        key={i} 
        icon={faStar} 
        className={`${sizeClasses[size]} text-brand-gold`} 
      />
    )
  }

  // Ajouter l'étoile à moitié si nécessaire
  if (hasHalfStar) {
    stars.push(
      <FontAwesomeIcon 
        key="half" 
        icon={faStarHalfStroke} 
        className={`${sizeClasses[size]} text-brand-gold`} 
      />
    )
  }

  // Ajouter les étoiles vides pour compléter
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0)
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <FontAwesomeIcon 
        key={`empty-${i}`} 
        icon={faStar} 
        className={`${sizeClasses[size]} text-gray-600`} 
      />
    )
  }

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div className="flex space-x-1">
        {stars}
      </div>
      {showNumber && (
        <span className="text-gray-400 text-sm ml-2">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  )
}
