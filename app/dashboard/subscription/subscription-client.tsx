'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SubscriptionClient() {
  const [loading, setLoading] = useState(false)

  const upgrade = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/stripe/create-checkout-session', { method: 'POST' })
      const { url } = await res.json()
      if (url) window.location.href = url
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Premium Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>Unlock premium features like AI Video Analysis and advanced analytics.</p>
          <Button onClick={upgrade} disabled={loading}>{loading ? 'Redirecting…' : 'Upgrade to Premium'}</Button>
        </CardContent>
      </Card>
    </div>
  )
}

