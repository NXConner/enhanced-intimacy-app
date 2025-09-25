import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const requiredEnv = {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_PRICE_ID: process.env.STRIPE_PRICE_ID,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  }
  const missing = Object.entries(requiredEnv)
    .filter(([, v]) => !v)
    .map(([k]) => k)
  if (missing.length) {
    return NextResponse.json({ error: `Missing env: ${missing.join(', ')}` }, { status: 500 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

  const checkout = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: process.env.STRIPE_PRICE_ID as string, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription`,
    metadata: { userId: session.user.id },
    customer_email: (session.user as any)?.email || undefined,
    subscription_data: {
      metadata: { userId: session.user.id },
    },
    allow_promotion_codes: true,
  })

  return NextResponse.json({ url: checkout.url })
}

