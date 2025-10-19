'use client'

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faUser, faCalendar } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from '@/contexts/TranslationContext'
import { StarRating } from './StarRating'

interface Comment {
  id: string
  userId: string
  userName: string
  productId: string
  rating: number
  comment: string
  date: string
  verified: boolean
}

interface ProductCommentsProps {
  productId: string
}

export function ProductComments({ productId }: ProductCommentsProps) {
  const { t } = useTranslation()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [newRating, setNewRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchComments()
  }, [productId])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (error) {
      console.error(t('products.comments.loadError'), error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || newRating === 0) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/products/${productId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: newRating,
          comment: newComment.trim(),
        }),
      })

      if (response.ok) {
        setNewComment('')
        setNewRating(0)
        fetchComments()
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du commentaire:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const averageRating = comments.length > 0 
    ? comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length 
    : 0

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8">
      {/* En-tête avec note moyenne */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          {t('products.comments.title')} ({comments.length})
        </h3>
        {comments.length > 0 && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-3xl font-bold text-brand-gold mr-2">
                {averageRating.toFixed(1)}
              </span>
              <StarRating rating={averageRating} size="lg" />
            </div>
            <span className="text-gray-400">
              {t('products.comments.basedOn', { count: comments.length })}
            </span>
          </div>
        )}
      </div>

      {/* Formulaire d'ajout de commentaire */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h4 className="text-lg font-semibold text-white mb-4">
          {t('products.comments.addComment')}
        </h4>
        <form onSubmit={handleSubmitComment}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('products.comments.rating')}
            </label>
            <StarRating 
              rating={newRating} 
              onRatingChange={setNewRating}
              interactive={true}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('products.comments.comment')}
            </label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={t('forms.placeholders.productComment')}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
              rows={4}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim() || newRating === 0}
            className="btn-gold px-6 py-2 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t('products.comments.submitting') : t('products.comments.submit')}
          </button>
        </form>
      </div>

      {/* Liste des commentaires */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-lg">
              {t('products.comments.noComments')}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {t('products.comments.beFirst')}
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-brand-gold to-brand-green rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faUser} className="text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-white">
                        {comment.userName}
                      </span>
                      {comment.verified && (
                        <span className="bg-brand-green text-white text-xs px-2 py-1 rounded-full">
                          {t('products.comments.verifiedPurchase')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <FontAwesomeIcon icon={faCalendar} />
                      <span>
                        {new Date(comment.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
                <StarRating rating={comment.rating} size="sm" />
              </div>
              
              <p className="text-gray-300 leading-relaxed">
                {comment.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
