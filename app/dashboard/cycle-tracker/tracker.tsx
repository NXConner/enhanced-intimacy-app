'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

type Cycle = { id: string; startDate: string; endDate?: string }

function avgCycleLength(days: number[]) {
  if (!days.length) return 28
  const sum = days.reduce((a, b) => a + b, 0)
  return Math.round(sum / days.length)
}

export default function CycleTracker() {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [shareWithPartner, setShareWithPartner] = useState(false)

  useEffect(() => {
    if (!userId) return
    const q = query(collection(firestore, 'menstrual_cycles'), where('userId', '==', userId), orderBy('startDate', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as any
      setCycles(rows)
    })
    return () => unsub()
  }, [userId])

  const predictions = useMemo(() => {
    if (cycles.length < 2) return { nextStart: null as Date | null, fertileStart: null as Date | null, fertileEnd: null as Date | null }
    const sorted = [...cycles].sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    const gaps: number[] = []
    for (let i = 1; i < sorted.length; i++) {
      const diff = (new Date(sorted[i].startDate).getTime() - new Date(sorted[i - 1].startDate).getTime()) / (1000 * 60 * 60 * 24)
      gaps.push(diff)
    }
    const avg = avgCycleLength(gaps)
    const lastStart = new Date(sorted[sorted.length - 1].startDate)
    const nextStart = new Date(lastStart)
    nextStart.setDate(nextStart.getDate() + avg)
    const fertileStart = new Date(nextStart)
    fertileStart.setDate(fertileStart.getDate() - 14)
    const fertileEnd = new Date(fertileStart)
    fertileEnd.setDate(fertileEnd.getDate() + 5)
    return { nextStart, fertileStart, fertileEnd }
  }, [cycles])

  const addCycle = async () => {
    if (!userId || !startDate) return
    await addDoc(collection(firestore, 'menstrual_cycles'), {
      userId,
      startDate,
      endDate: endDate || null,
      sharedWithPartner: shareWithPartner,
      createdAt: serverTimestamp(),
    })
    setStartDate('')
    setEndDate('')
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Cycle Tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm mb-1 block">Period start</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="text-sm mb-1 block">Period end (optional)</label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={shareWithPartner} onCheckedChange={setShareWithPartner} />
            <span className="text-sm">Share predictions with partner</span>
          </div>
          <Button onClick={addCycle} disabled={!userId || !startDate}>Save</Button>

          <div className="mt-4">
            <h3 className="font-medium mb-2">History</h3>
            <ul className="text-sm space-y-1">
              {cycles.map((c) => (
                <li key={c.id}>{c.startDate} {c.endDate ? `→ ${c.endDate}` : ''}</li>
              ))}
              {cycles.length === 0 && <li className="text-muted-foreground">No entries yet.</li>}
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="font-medium mb-2">Predictions</h3>
            <div className="text-sm">
              {predictions.nextStart ? (
                <>
                  <div>Next period: {predictions.nextStart?.toDateString()}</div>
                  <div>Fertile window: {predictions.fertileStart?.toDateString()} – {predictions.fertileEnd?.toDateString()}</div>
                </>
              ) : (
                <div className="text-muted-foreground">Add more cycles to improve predictions.</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

