'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckCircle,
  faArrowRight,
  faArrowLeft,
  faSpinner,
  faLeaf,
  faFlaskVial,
  faHeart,
  faMoon,
  faDumbbell,
  faBrain,
  faSmile,
  faShoppingBag,
} from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from '@/contexts/TranslationContext'
import Link from 'next/link'

interface Question {
  id: string
  question: string
  type: 'single' | 'multiple'
  options: {
    id: string
    label: string
    icon?: any
    categoryTags: string[] // Tags pour matcher avec les produits
    needsTags?: string[] // Besoins identifiés pour développement futur
  }[]
}

interface QuizResult {
  recommendedCategories: string[]
  needs: string[]
  score: Record<string, number>
}

export function ProductQuiz({ onClose }: { onClose?: () => void }) {
  const { t } = useTranslation()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([])

  const questions: Question[] = [
    {
      id: 'experience',
      question: 'Quel est votre niveau d\'expérience avec le CBD ?',
      type: 'single',
      options: [
        {
          id: 'beginner',
          label: 'Débutant - Je découvre le CBD',
          icon: faLeaf,
          categoryTags: ['huiles-cbd', 'gummies', 'débutant'],
          needsTags: ['guide-débutant', 'faible-dosage'],
        },
        {
          id: 'intermediate',
          label: 'Intermédiaire - J\'ai déjà utilisé du CBD',
          icon: faFlaskVial,
          categoryTags: ['huiles-cbd', 'résines', 'intermédiaire'],
          needsTags: ['dosage-moyen', 'variété-produits'],
        },
        {
          id: 'advanced',
          label: 'Expert - Je connais bien le CBD',
          icon: faBrain,
          categoryTags: ['résines', 'fleurs-cbd', 'concentrés'],
          needsTags: ['haute-concentration', 'produits-premium'],
        },
      ],
    },
    {
      id: 'goal',
      question: 'Quel est votre objectif principal avec le CBD ?',
      type: 'multiple',
      options: [
        {
          id: 'relaxation',
          label: 'Relaxation et bien-être',
          icon: faHeart,
          categoryTags: ['huiles-cbd', 'gummies', 'relaxation'],
          needsTags: ['produits-relaxants', 'arômes-apaisants'],
        },
        {
          id: 'sleep',
          label: 'Améliorer le sommeil',
          icon: faMoon,
          categoryTags: ['huiles-cbd', 'gummies', 'sommeil'],
          needsTags: ['formules-sommeil', 'cbn'],
        },
        {
          id: 'sport',
          label: 'Récupération sportive',
          icon: faDumbbell,
          categoryTags: ['crèmes', 'baumes', 'sport'],
          needsTags: ['topiques-sport', 'cbd-topique'],
        },
        {
          id: 'wellness',
          label: 'Bien-être général',
          icon: faSmile,
          categoryTags: ['huiles-cbd', 'gummies', 'bien-être'],
          needsTags: ['produits-quotidien', 'multivitamines-cbd'],
        },
      ],
    },
    {
      id: 'preference',
      question: 'Quelle forme de produit préférez-vous ?',
      type: 'multiple',
      options: [
        {
          id: 'oils',
          label: 'Huiles CBD',
          icon: faFlaskVial,
          categoryTags: ['huiles-cbd'],
          needsTags: ['nouvelles-concentrations', 'arômes-naturels'],
        },
        {
          id: 'flowers',
          label: 'Fleurs CBD',
          icon: faLeaf,
          categoryTags: ['fleurs-cbd'],
          needsTags: ['nouvelles-variétés', 'fleurs-premium'],
        },
        {
          id: 'resins',
          label: 'Résines CBD',
          icon: faFlaskVial,
          categoryTags: ['résines'],
          needsTags: ['résines-concentrées', 'hash-cbd'],
        },
        {
          id: 'topicals',
          label: 'Crèmes et baumes',
          icon: faHeart,
          categoryTags: ['crèmes', 'baumes'],
          needsTags: ['topiques-spécifiques', 'baumes-aromatiques'],
        },
        {
          id: 'edibles',
          label: 'Gummies et produits comestibles',
          icon: faSmile,
          categoryTags: ['gummies'],
          needsTags: ['nouveaux-goûts', 'gummies-vitamines'],
        },
      ],
    },
    {
      id: 'concentration',
      question: 'Quelle concentration de CBD recherchez-vous ?',
      type: 'single',
      options: [
        {
          id: 'low',
          label: 'Faible (5-10%) - Pour débuter',
          categoryTags: ['débutant', 'faible-dosage'],
          needsTags: ['starter-kits'],
        },
        {
          id: 'medium',
          label: 'Moyenne (15-20%) - Usage régulier',
          categoryTags: ['intermédiaire', 'dosage-moyen'],
          needsTags: ['formats-moyens'],
        },
        {
          id: 'high',
          label: 'Élevée (25%+) - Usage intensif',
          categoryTags: ['expert', 'haute-concentration'],
          needsTags: ['concentrés-premium'],
        },
        {
          id: 'flexible',
          label: 'Je veux tester différentes concentrations',
          categoryTags: ['débutant', 'intermédiaire'],
          needsTags: ['packs-découverte'],
        },
      ],
    },
    {
      id: 'budget',
      question: 'Quel est votre budget mensuel pour le CBD ?',
      type: 'single',
      options: [
        {
          id: 'budget-low',
          label: 'Moins de 30€',
          categoryTags: ['petit-budget', 'essentiels'],
          needsTags: ['produits-accessibles', 'promotions'],
        },
        {
          id: 'budget-medium',
          label: '30-60€',
          categoryTags: ['budget-moyen', 'qualité'],
          needsTags: ['packs-valeur'],
        },
        {
          id: 'budget-high',
          label: 'Plus de 60€',
          categoryTags: ['premium', 'qualité-supérieure'],
          needsTags: ['produits-luxe', 'collections-exclusives'],
        },
      ],
    },
    {
      id: 'new-products',
      question: 'Quels nouveaux produits aimeriez-vous voir dans notre catalogue ?',
      type: 'multiple',
      options: [
        {
          id: 'cbn-products',
          label: 'Produits avec CBN (pour le sommeil)',
          needsTags: ['cbn', 'sommeil'],
        },
        {
          id: 'cbg-products',
          label: 'Produits avec CBG (énergie et focus)',
          needsTags: ['cbg', 'énergie'],
        },
        {
          id: 'terpenes',
          label: 'Produits enrichis en terpènes',
          needsTags: ['terpènes', 'arômes'],
        },
        {
          id: 'vape',
          label: 'E-liquides et produits pour vapoteuse',
          needsTags: ['vape', 'e-liquides'],
        },
        {
          id: 'pets',
          label: 'Produits CBD pour animaux de compagnie',
          needsTags: ['animaux', 'pets'],
        },
        {
          id: 'cosmetics',
          label: 'Cosmétiques et soins de la peau au CBD',
          needsTags: ['cosmétiques', 'soins-peau'],
        },
        {
          id: 'beverages',
          label: 'Boissons infusées au CBD',
          needsTags: ['boissons', 'infusions'],
        },
        {
          id: 'isolates',
          label: 'Isolats et cristaux de CBD purs',
          needsTags: ['isolats', 'cristaux'],
        },
      ],
    },
  ]

  const handleAnswer = (questionId: string, optionId: string, isMultiple: boolean) => {
    setAnswers((prev) => {
      if (isMultiple) {
        const current = prev[questionId] || []
        if (current.includes(optionId)) {
          return { ...prev, [questionId]: current.filter((id) => id !== optionId) }
        } else {
          return { ...prev, [questionId]: [...current, optionId] }
        }
      } else {
        return { ...prev, [questionId]: [optionId] }
      }
    })
  }

  const calculateResults = (): QuizResult => {
    const categoryScores: Record<string, number> = {}
    const needs: string[] = []

    questions.forEach((question) => {
      const selectedOptions = answers[question.id] || []
      selectedOptions.forEach((optionId) => {
        const option = question.options.find((opt) => opt.id === optionId)
        if (option) {
          option.categoryTags.forEach((tag) => {
            categoryScores[tag] = (categoryScores[tag] || 0) + 1
          })
          if (option.needsTags) {
            needs.push(...option.needsTags)
          }
        }
      })
    })

    // Trier les catégories par score
    const sortedCategories = Object.entries(categoryScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category]) => category)

    return {
      recommendedCategories: sortedCategories,
      needs: [...new Set(needs)], // Supprimer les doublons
      score: categoryScores,
    }
  }

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const results = calculateResults()

      // Sauvegarder les réponses
      await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          results,
          timestamp: new Date().toISOString(),
        }),
      })

      // Récupérer les produits recommandés
      const categoryParams = results.recommendedCategories.join(',')
      const productsResponse = await fetch(
        `/api/products/all?categories=${categoryParams}&limit=6`
      )
      const productsData = await productsResponse.json()

      if (productsData.success) {
        setRecommendedProducts(productsData.products || [])
      }

      setShowResults(true)
    } catch (error) {
      console.error('Erreur lors de la soumission du quiz:', error)
      // Continuer même en cas d'erreur
      setShowResults(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentQuestion = questions[currentStep]
  const currentAnswers = answers[currentQuestion.id] || []
  const canProceed = currentAnswers.length > 0

  if (showResults) {
    const results = calculateResults()
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
        <div className="bg-brand-black border-2 border-brand-gold rounded-2xl p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-6xl text-brand-gold mb-4"
            />
            <h2 className="text-3xl font-bold text-white mb-2 gold-text-gradient">
              Votre Profil CBD
            </h2>
            <p className="text-gray-400">
              Voici nos recommandations personnalisées pour vous
            </p>
          </div>

          {recommendedProducts.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Produits Recommandés
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="card-bg rounded-lg p-4 hover:border-brand-gold transition-all"
                    onClick={onClose}
                  >
                    <div className="aspect-square bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faLeaf} className="text-4xl text-gray-600" />
                      )}
                    </div>
                    <h4 className="text-white font-semibold mb-1 line-clamp-2">
                      {product.title}
                    </h4>
                    <p className="text-brand-gold font-bold">
                      {(product.priceCents / 100).toFixed(2)} €
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Vos Besoins Identifiés
            </h3>
            <div className="flex flex-wrap gap-2">
              {results.needs.slice(0, 10).map((need) => (
                <span
                  key={need}
                  className="bg-brand-green/20 text-brand-green px-3 py-1 rounded-full text-sm"
                >
                  {need}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="btn-gold text-black font-semibold py-3 px-6 rounded-full flex-1 text-center"
              onClick={onClose}
            >
              <FontAwesomeIcon icon={faShoppingBag} className="mr-2" />
              Voir tous les produits
            </Link>
            <button
              onClick={onClose}
              className="bg-transparent border-2 border-brand-green text-brand-green font-semibold py-3 px-6 rounded-full hover:bg-brand-green hover:text-black transition-all"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-brand-black border-2 border-brand-gold rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Question {currentStep + 1} sur {questions.length}</span>
            <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-brand-gold h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = currentAnswers.includes(option.id)
              const Icon = option.icon

              return (
                <button
                  key={option.id}
                  onClick={() =>
                    handleAnswer(currentQuestion.id, option.id, currentQuestion.type === 'multiple')
                  }
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-brand-gold bg-brand-gold/10 text-white'
                      : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-brand-green hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <FontAwesomeIcon
                        icon={Icon}
                        className={`text-xl ${isSelected ? 'text-brand-gold' : 'text-gray-500'}`}
                      />
                    )}
                    <span className="font-medium">{option.label}</span>
                    {isSelected && (
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="ml-auto text-brand-gold"
                      />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-700 text-gray-400 hover:border-brand-green hover:text-brand-green transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Précédent
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed || isSubmitting}
            className="btn-gold text-black font-semibold py-3 px-6 rounded-full flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                Traitement...
              </>
            ) : currentStep === questions.length - 1 ? (
              <>
                Voir mes résultats
                <FontAwesomeIcon icon={faCheckCircle} />
              </>
            ) : (
              <>
                Suivant
                <FontAwesomeIcon icon={faArrowRight} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

