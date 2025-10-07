import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { formatAmountForStripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { items, customerEmail } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      )
    }

    // Calculate total amount
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
    const tax = subtotal * 0.08 // 8% tax
    const shipping = subtotal > 50 ? 0 : 9.99
    const total = subtotal + tax + shipping

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.image],
          metadata: {
            productId: item.id,
          },
        },
        unit_amount: formatAmountForStripe(item.price, 'usd'),
      },
      quantity: item.quantity,
    }))

    // Add tax as a line item
    if (tax > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Tax',
          },
          unit_amount: formatAmountForStripe(tax, 'usd'),
        },
        quantity: 1,
      })
    }

    // Add shipping as a line item if applicable
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
          },
          unit_amount: formatAmountForStripe(shipping, 'usd'),
        },
        quantity: 1,
      })
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(total, 'usd'),
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        items: JSON.stringify(items),
        customerEmail: customerEmail || '',
      },
      receipt_email: customerEmail,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
import { stripe } from '@/lib/stripe'
import { formatAmountForStripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { items, customerEmail } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      )
    }

    // Calculate total amount
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
    const tax = subtotal * 0.08 // 8% tax
    const shipping = subtotal > 50 ? 0 : 9.99
    const total = subtotal + tax + shipping

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.image],
          metadata: {
            productId: item.id,
          },
        },
        unit_amount: formatAmountForStripe(item.price, 'usd'),
      },
      quantity: item.quantity,
    }))

    // Add tax as a line item
    if (tax > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Tax',
          },
          unit_amount: formatAmountForStripe(tax, 'usd'),
        },
        quantity: 1,
      })
    }

    // Add shipping as a line item if applicable
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
          },
          unit_amount: formatAmountForStripe(shipping, 'usd'),
        },
        quantity: 1,
      })
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(total, 'usd'),
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        items: JSON.stringify(items),
        customerEmail: customerEmail || '',
      },
      receipt_email: customerEmail,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
