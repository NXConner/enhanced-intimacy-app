'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Crown } from 'lucide-react'

export default function SubscriptionClient() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onUpgrade = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/create-checkout-session', { method: 'POST' })
      if (!res.ok) throw new Error('Failed to create checkout session')
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('Stripe returned no URL')
      }
    } catch (e: any) {
      setError(e.message || 'Upgrade failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-custom py-8">
      <Card className="max-w-2xl mx-auto bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Crown className="h-5 w-5 mr-2 text-yellow-600" />
            Upgrade to Premium
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Unlock image/video analysis and the full AI coaching experience.
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <div className="flex items-center gap-3">
              <Badge variant="secondary">$ / month</Badge>
            </div>
            <div className="pt-2">
              <Button onClick={onUpgrade} disabled={loading} className="min-w-[160px]">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Upgrade'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

