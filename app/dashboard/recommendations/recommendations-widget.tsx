'use client'

import { useEffect, useState } from 'react'
import { firestore } from '@/lib/firebase'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Props = { userId: string; partnerId?: string | null }

type Recommendation = { id: string; text: string; createdAt?: any }

export default function RecommendationsWidget({ userId, partnerId }: Props) {
  const [items, setItems] = useState<Recommendation[]>([])
  useEffect(() => {
    if (!partnerId) return
    const key = [userId, partnerId].sort().join('__')
    const ref = collection(firestore, 'recommendations')
    const q = query(ref, where('pairKey', '==', key), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      const next: Recommendation[] = []
      snap.forEach((d) => {
        const v = d.data() as any
        next.push({ id: d.id, text: v.text, createdAt: v.createdAt })
      })
      setItems(next)
    })
    return () => unsub()
  }, [userId, partnerId])

  if (!partnerId) return null

  const latest = items[0]
  if (!latest) return null

  return (
    <Card className="bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Personalized Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm whitespace-pre-wrap">{latest.text}</div>
      </CardContent>
    </Card>
  )
}

