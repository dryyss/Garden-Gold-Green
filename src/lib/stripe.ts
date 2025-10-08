import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export const formatAmountForStripe = (amount: number, currency: string): number => {
  // Convertir les euros en centimes pour Stripe
  return Math.round(amount * 100)
}

export const formatAmountFromStripe = (amount: number, currency: string): number => {
  // Convertir les centimes en euros depuis Stripe
  return amount / 100
}