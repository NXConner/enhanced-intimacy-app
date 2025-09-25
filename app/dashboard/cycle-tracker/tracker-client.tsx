'use client'

import { useEffect, useMemo, useState } from 'react'
import { firestore } from '@/lib/firebase'
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

type Props = { userId: string; partnerId?: string | null }

type Cycle = { id: string; startDate: string; endDate?: string }

export default function CycleTrackerClient({ userId, partnerId }: Props) {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [share, setShare] = useState(false)

  useEffect(() => {
    const ref = collection(firestore, 'menstrual_cycles')
    const q = query(ref, where('userId', '==', userId), orderBy('startDate', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      const next: Cycle[] = []
      snap.forEach((d) => {
        const v = d.data() as any
        next.push({ id: d.id, startDate: v.startDate, endDate: v.endDate })
      })
      setCycles(next)
    })
    return () => unsub()
  }, [userId])

  useEffect(() => {
    const prefRef = doc(firestore, 'cycle_prefs', userId)
    const unsub = onSnapshot(prefRef, (snap) => {
      const v = snap.data() as any
      setShare(Boolean(v?.shareWithPartner))
    })
    return () => unsub()
  }, [userId])

  async function saveEntry() {
    if (!start) return
    await addDoc(collection(firestore, 'menstrual_cycles'), {
      userId,
      startDate: start,
      endDate: end || null,
      createdAt: serverTimestamp()
    })
    setStart('')
    setEnd('')
  }

  async function toggleShare(v: boolean) {
    setShare(v)
    await setDoc(doc(firestore, 'cycle_prefs', userId), { shareWithPartner: v, updatedAt: serverTimestamp() }, { merge: true })
  }

  const avgCycleLength = useMemo(() => {
    const completed = cycles.filter((c) => c.endDate)
    if (completed.length < 2) return 28
    let total = 0
    let count = 0
    for (let i = 0; i < completed.length - 1; i++) {
      const a = new Date(completed[i + 1].startDate)
      const b = new Date(completed[i].startDate)
      const diff = Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
      if (diff > 10 && diff < 60) {
        total += diff
        count += 1
      }
    }
    return count > 0 ? Math.round(total / count) : 28
  }, [cycles])

  const nextPeriodStart = useMemo(() => {
    const last = cycles[0]
    if (!last) return null
    const startDate = new Date(last.startDate)
    startDate.setDate(startDate.getDate() + avgCycleLength)
    return startDate
  }, [cycles, avgCycleLength])

  const fertileWindow = useMemo(() => {
    if (!nextPeriodStart) return null
    const ovulation = new Date(nextPeriodStart)
    ovulation.setDate(ovulation.getDate() - 14)
    const startFw = new Date(ovulation)
    startFw.setDate(startFw.getDate() - 3)
    const endFw = new Date(ovulation)
    endFw.setDate(endFw.getDate() + 1)
    return { start: startFw, end: endFw }
  }, [nextPeriodStart])

  return (
    <Card className="bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Cycle Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start">Period Start</Label>
            <Input id="start" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="end">Period End</Label>
            <Input id="end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
        </div>
        <Button onClick={() => void saveEntry()}>Save</Button>

        <div className="flex items-center gap-2 mt-2">
          <Switch id="share" checked={share} onCheckedChange={(v) => void toggleShare(v)} />
          <Label htmlFor="share">Share predictions with partner</Label>
        </div>

        <div className="text-sm text-muted-foreground">
          Average cycle length: <strong>{avgCycleLength}</strong> days
          {nextPeriodStart && (
            <div>Next expected period: <strong>{nextPeriodStart.toDateString()}</strong></div>
          )}
          {fertileWindow && (
            <div>Fertile window: <strong>{fertileWindow.start.toDateString()} - {fertileWindow.end.toDateString()}</strong></div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

