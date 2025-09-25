import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const preferredRegion = 'auto'
export const maxDuration = 60

export async function POST(req: Request) {
  const payload = await req.text()
  const sig = req.headers.get('stripe-signature') as string
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new NextResponse('Missing Stripe env', { status: 500 })
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET as string)
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  const mapPriceToTier = (priceId?: string | null): 'free' | 'premium' | 'professional' => {
    const premiumIds = [process.env.STRIPE_PRICE_ID].filter(Boolean)
    const proIds = [process.env.STRIPE_PRICE_ID_PRO].filter(Boolean)
    if (priceId && proIds.includes(priceId)) return 'professional'
    if (priceId && premiumIds.includes(priceId)) return 'premium'
    return 'premium' // default to premium when using single plan
  }

  const setUserTier = async (userId: string | undefined | null, tier: 'free' | 'premium' | 'professional') => {
    if (!userId) return
    await prisma.user.update({ where: { id: userId }, data: { subscriptionTier: tier } })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const sessionObj = event.data.object as Stripe.Checkout.Session
      const userId = (sessionObj.metadata as any)?.userId || undefined
      let priceId: string | undefined
      try {
        const subscriptionId = sessionObj.subscription as string | undefined
        if (subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId, { expand: ['items.data.price'] })
          priceId = sub.items.data[0]?.price?.id
        }
      } catch {}
      const tier = mapPriceToTier(priceId)
      await setUserTier(userId, tier)
      break
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const userId = (sub.metadata as any)?.userId || undefined
      const status = sub.status
      const priceId = sub.items.data[0]?.price?.id
      if (status === 'active' || status === 'trialing') {
        await setUserTier(userId, mapPriceToTier(priceId))
      } else if (status === 'past_due' || status === 'unpaid' || status === 'incomplete' || status === 'incomplete_expired') {
        // keep tier but could restrict features; no-op for now
      }
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const userId = (sub.metadata as any)?.userId || undefined
      await setUserTier(userId, 'free')
      break
    }
    default: {
      // ignore other events
    }
  }

  return NextResponse.json({ received: true })
}


