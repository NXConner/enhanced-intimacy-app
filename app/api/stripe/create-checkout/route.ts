import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' as any })

export async function POST() {
  const priceId = process.env.STRIPE_PREMIUM_PRICE_ID as string
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?status=success`,
    cancel_url: `${baseUrl}/dashboard/subscription?status=cancelled`,
  })
  return NextResponse.json({ url: session.url })
}

