'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faTrash, faGripVertical, faImage } from '@fortawesome/free-solid-svg-icons'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  mainImageIndex?: number
  onMainImageChange?: (index: number) => void
  label?: string
  required?: boolean
}

export function ImageUploader({
  images,
  onChange,
  mainImageIndex = 0,
  onMainImageChange,
  label = 'Images',
  required = false
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )

    if (files.length > 0) {
      handleFiles(files)
    }
  }

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => 
      file.type.startsWith('image/')
    )

    if (files.length > 0) {
      handleFiles(files)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFiles = (files: File[]) => {
    const newImages: string[] = []
    
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) {
          newImages.push(result)
          if (newImages.length === files.length) {
            onChange([...images, ...newImages])
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
    if (onMainImageChange && index === mainImageIndex && newImages.length > 0) {
      onMainImageChange(0)
    } else if (onMainImageChange && index < mainImageIndex) {
      onMainImageChange(mainImageIndex - 1)
    }
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleDragOverItem = (e: DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newImages = [...images]
    const draggedItem = newImages[draggedIndex]
    newImages.splice(draggedIndex, 1)
    newImages.splice(index, 0, draggedItem)
    
    onChange(newImages)
    
    // Mettre à jour l'index de l'image principale si nécessaire
    if (onMainImageChange) {
      if (draggedIndex === mainImageIndex) {
        onMainImageChange(index)
      } else if (index === mainImageIndex && draggedIndex < mainImageIndex) {
        onMainImageChange(mainImageIndex + 1)
      } else if (index < mainImageIndex && draggedIndex > mainImageIndex) {
        onMainImageChange(mainImageIndex - 1)
      }
    }
    
    setDraggedIndex(index)
  }

  const setAsMain = (index: number) => {
    if (onMainImageChange) {
      onMainImageChange(index)
    }
  }

  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>

      {/* Zone de drop */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragging 
            ? 'border-brand-gold bg-brand-gold/10' 
            : 'border-white/20 hover:border-white/40 bg-black/20'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        <FontAwesomeIcon icon={faUpload} className="text-3xl text-gray-400 mb-2" />
        <p className="text-gray-400 text-sm">
          Glissez-déposez vos images ici ou cliquez pour sélectionner
        </p>
        <p className="text-gray-500 text-xs mt-1">
          Formats acceptés: JPG, PNG, WEBP
        </p>
      </div>

      {/* Liste des images */}
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOverItem(e, index)}
              className={`
                relative group bg-black/30 rounded-lg overflow-hidden border-2 transition-all
                ${index === mainImageIndex 
                  ? 'border-brand-gold ring-2 ring-brand-gold/50' 
                  : 'border-white/10'
                }
                ${draggedIndex === index ? 'opacity-50' : ''}
              `}
            >
              {/* Image */}
              <div className="aspect-square relative">
                <Image
                  src={image}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Overlay avec actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {index !== mainImageIndex && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setAsMain(index)
                    }}
                    className="bg-brand-gold text-black px-3 py-1 rounded text-xs font-semibold hover:bg-yellow-500"
                    title="Définir comme image principale"
                  >
                    Principale
                  </button>
                )}
                {index === mainImageIndex && (
                  <span className="bg-brand-gold text-black px-3 py-1 rounded text-xs font-semibold">
                    Principale
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeImage(index)
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-600"
                  title="Supprimer"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>

              {/* Indicateur de drag */}
              <div className="absolute top-2 left-2 bg-black/70 rounded p-1">
                <FontAwesomeIcon icon={faGripVertical} className="text-gray-400 text-xs" />
              </div>

              {/* Badge image principale */}
              {index === mainImageIndex && (
                <div className="absolute top-2 right-2 bg-brand-gold text-black px-2 py-1 rounded text-xs font-semibold">
                  Principale
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      {images.length > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          💡 Glissez les images pour les réorganiser. La première image est l'image principale.
        </p>
      )}
    </div>
  )
}



