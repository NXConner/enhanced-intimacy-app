import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { firestore } from '@/lib/firebase'
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore'

export const config = { api: { bodyParser: false } } as any

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' as any })

export async function POST(req: Request) {
  const sig = headers().get('stripe-signature') as string
  const text = await req.text()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(text, sig, process.env.STRIPE_WEBHOOK_SECRET as string)
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const custId = session.customer as string
    await setDoc(doc(firestore, 'stripe_customers', custId), { status: 'premium', updatedAt: serverTimestamp() }, { merge: true })
  }
  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    const custId = sub.customer as string
    await setDoc(doc(firestore, 'stripe_customers', custId), { status: 'free', updatedAt: serverTimestamp() }, { merge: true })
  }

  return NextResponse.json({ received: true })
}

