'use client'

import { useEffect, useState } from 'react'
import { firestore } from '@/lib/firebase'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, updateDoc, doc, where } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Props = { userId: string; partnerId?: string | null }

type Goal = {
  id: string
  goalText: string
  status: 'active' | 'completed'
  pairKey: string
}

export default function GoalsClient({ userId, partnerId }: Props) {
  const [items, setItems] = useState<Goal[]>([])
  const [text, setText] = useState('')

  const key = pairKey(userId, partnerId)

  useEffect(() => {
    if (!key) return
    const ref = collection(firestore, 'goals')
    const q = query(ref, where('pairKey', '==', key), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      const next: Goal[] = []
      snap.forEach((d) => {
        const v = d.data() as any
        next.push({ id: d.id, goalText: v.goalText, status: v.status, pairKey: v.pairKey })
      })
      setItems(next)
    })
    return () => unsub()
  }, [key])

  async function addGoal() {
    if (!key) return
    const trimmed = text.trim()
    if (!trimmed) return
    await addDoc(collection(firestore, 'goals'), {
      pairKey: key,
      goalText: trimmed,
      status: 'active',
      createdAt: serverTimestamp()
    })
    setText('')
  }

  async function updateStatus(id: string, status: 'active' | 'completed') {
    await updateDoc(doc(firestore, 'goals', id), { status, updatedAt: serverTimestamp() })
  }

  if (!key) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Shared Goals & Wishlist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Connect a partner to create shared goals.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Shared Goals & Wishlist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input value={text} placeholder="Add a new goal" onChange={(e) => setText(e.target.value)} />
          <Button onClick={() => void addGoal()}>Add</Button>
        </div>
        <div className="space-y-2">
          {items.map((g) => (
            <div key={g.id} className="flex items-center justify-between border rounded-md p-2 bg-white/70">
              <div className="text-sm">{g.goalText}</div>
              <Select value={g.status} onValueChange={(v) => void updateStatus(g.id, v as any)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
          {items.length === 0 && <div className="text-sm text-muted-foreground">No goals yet.</div>}
        </div>
      </CardContent>
    </Card>
  )
}

function pairKey(a?: string, b?: string | null) {
  if (!a || !b) return null
  return [a, b].sort().join('__')
}