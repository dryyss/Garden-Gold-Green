'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

interface ImageWithLoadingProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  quality?: number
  sizes?: string
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
}

export function ImageWithLoading({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  quality = 75,
  sizes,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError
}: ImageWithLoadingProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  // Image de fallback en cas d'erreur
  const fallbackSrc = '/logo.png'

  return (
    <div className={`relative ${className}`}>
      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 z-10">
          <div className="flex flex-col items-center space-y-2">
            <FontAwesomeIcon 
              icon={faSpinner} 
              className="w-8 h-8 text-brand-gold animate-spin" 
            />
            <span className="text-xs text-gray-300">Chargement...</span>
          </div>
        </div>
      )}

      {/* Image principale */}
      <Image
        src={hasError ? fallbackSrc : src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${hasError ? 'grayscale' : ''}`}
        priority={priority}
        quality={quality}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
      />

      {/* Overlay d'erreur */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/80 z-20">
          <div className="text-center text-gray-400">
            <div className="w-8 h-8 mx-auto mb-2 bg-gray-600 rounded flex items-center justify-center">
              <span className="text-xs">!</span>
            </div>
            <span className="text-xs">Image non disponible</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Composant spécialisé pour les images de produits
export function ProductImage({
  src,
  alt,
  className = '',
  priority = false,
  ...props
}: Omit<ImageWithLoadingProps, 'width' | 'height' | 'fill'>) {
  return (
    <ImageWithLoading
      src={src}
      alt={alt}
      fill
      className={`object-cover ${className}`}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      {...props}
    />
  )
}

// Composant pour les images de logo
export function LogoImage({
  src,
  alt,
  className = '',
  priority = true,
  ...props
}: Omit<ImageWithLoadingProps, 'width' | 'height' | 'fill'>) {
  return (
    <ImageWithLoading
      src={src}
      alt={alt}
      width={48}
      height={48}
      className={`object-contain ${className}`}
      priority={priority}
      {...props}
    />
  )
}

// Composant pour les images hero
export function HeroImage({
  src,
  alt,
  className = '',
  priority = true,
  ...props
}: Omit<ImageWithLoadingProps, 'width' | 'height' | 'fill'>) {
  return (
    <ImageWithLoading
      src={src}
      alt={alt}
      fill
      className={`object-cover ${className}`}
      priority={priority}
      sizes="100vw"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      {...props}
    />
  )
}
