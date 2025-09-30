export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const key = process.env.STRIPE_SECRET_KEY
  if (!secret || !key) {
    return NextResponse.json({ error: 'Missing Stripe env' }, { status: 500 })
  }

  const stripe = new Stripe(key, { apiVersion: '2024-06-20' as any })

  const rawBody = await req.text()
  const sig = req.headers.get('stripe-signature') as string

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret)
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = (session.metadata as any)?.userId
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { subscriptionTier: 'premium' }
          }).catch(() => {})
        }
        break
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const sub = event.data.object as Stripe.Subscription
        const userId = (sub.metadata as any)?.userId
        if (userId) {
          const isActive = sub.status === 'active' || sub.status === 'trialing'
          await prisma.user.update({
            where: { id: userId },
            data: { subscriptionTier: isActive ? 'premium' : 'free' }
          }).catch(() => {})
        }
        break
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const userId = (sub.metadata as any)?.userId
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { subscriptionTier: 'free' }
          }).catch(() => {})
        }
        break
      }
      default:
        break
    }
  } catch (e) {
    // swallow processing errors but ack the event to avoid retries storm; logs in platform
  }

  return NextResponse.json({ received: true })
}

