'use client'

import { loadStripe } from '@stripe/stripe-js'
import { Elements, useStripe, useElements } from '@stripe/react-stripe-js'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

export default function SubscriptionClient({ userId }: { userId: string }) {
  return (
    <Elements stripe={stripePromise}>
      <UpgradeButton userId={userId} />
    </Elements>
  )
}

function UpgradeButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)
  async function upgrade() {
    try {
      setLoading(true)
      const res = await fetch('/api/stripe/create-checkout', { method: 'POST' })
      const { url } = await res.json()
      window.location.href = url
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="max-w-md">
      <div className="text-sm mb-4">Upgrade to Premium for weekly recommendations and advanced features.</div>
      <Button onClick={() => void upgrade()} disabled={loading}>{loading ? 'Redirecting…' : 'Upgrade to Premium'}</Button>
    </div>
  )
}

