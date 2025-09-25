'use client'

import { useEffect, useMemo, useState } from 'react'
import { firestore } from '@/lib/firebase'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore'
import { Calendar as RBCalendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Heart } from 'lucide-react'
import { collection as fsCollection, query as fsQuery } from 'firebase/firestore'
import { addDays } from 'date-fns'

type Props = {
  userId: string
  partnerId?: string | null
}

type CalendarEvent = {
  id: string
  title: string
  start: Date
  end: Date
  description?: string
  type?: 'default' | 'intimacy' | 'prediction' | 'fertile'
  userIds: string[]
}

const locales = {
  'en-US': enUS
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales
})

export default function SharedCalendarClient({ userId, partnerId }: Props) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [predictions, setPredictions] = useState<CalendarEvent[]>([])
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    start: new Date(),
    end: new Date(),
    intimacy: false
  })

  const calendarRef = collection(firestore, 'calendars')

  const userIdSet = useMemo(() => {
    return [userId, partnerId].filter(Boolean) as string[]
  }, [userId, partnerId])

  useEffect(() => {
    if (userIdSet.length === 0) return
    const q = query(
      calendarRef,
      where('userIds', 'array-contains-any', userIdSet),
      orderBy('start', 'asc')
    )
    const unsub = onSnapshot(q, (snap) => {
      const next: CalendarEvent[] = []
      snap.forEach((docSnap) => {
        const d = docSnap.data() as any
        // Only include if both users are included when partnerId provided
        const shouldInclude = partnerId
          ? Array.isArray(d.userIds) && d.userIds.includes(userId) && d.userIds.includes(partnerId)
          : Array.isArray(d.userIds) && d.userIds.includes(userId)
        if (!shouldInclude) return
        next.push({
          id: docSnap.id,
          title: d.title,
          start: new Date(d.start),
          end: new Date(d.end),
          description: d.description,
          type: d.type === 'intimacy' ? 'intimacy' : 'default',
          userIds: d.userIds || []
        })
      })
      setEvents(next)
    })
    return () => unsub()
  }, [calendarRef, userIdSet, partnerId, userId])

  // Load menstrual predictions for owner or shared partner when allowed
  useEffect(() => {
    async function sub() {
      // Owner predictions always visible to owner
      const ownPrefRef = doc(collection(firestore, 'cycle_prefs'), userId)
      const ownCyclesRef = collection(firestore, 'menstrual_cycles')
      const ownQ = query(ownCyclesRef, where('userId', '==', userId), orderBy('startDate', 'desc'))

      let unsubOwner: any = null
      let unsubPartner: any = null

      unsubOwner = onSnapshot(ownQ, (snap) => {
        const arr: any[] = []
        snap.forEach((d) => arr.push(d.data()))
        const evs = buildPredictionEvents(arr)
        setPredictions((prev) => {
          const others = prev.filter((e) => !(e.id.startsWith('pred-own-')))
          return [...others, ...evs.map((e, i) => ({ ...e, id: `pred-own-${i}` }))]
        })
      })

      // If partner exists and shares, show their predictions
      if (partnerId) {
        const partnerPrefRef = doc(collection(firestore, 'cycle_prefs'), partnerId)
        const partnerCyclesRef = collection(firestore, 'menstrual_cycles')
        const partnerQ = query(partnerCyclesRef, where('userId', '==', partnerId), orderBy('startDate', 'desc'))
        unsubPartner = onSnapshot(partnerPrefRef, (prefSnap) => {
          const canSee = Boolean((prefSnap.data() as any)?.shareWithPartner)
          if (!canSee) {
            setPredictions((prev) => prev.filter((e) => !(e.id.startsWith('pred-partner-'))))
            return
          }
          // subscribe to partner cycles
          onSnapshot(partnerQ, (snap) => {
            const arr: any[] = []
            snap.forEach((d) => arr.push(d.data()))
            const evs = buildPredictionEvents(arr)
            setPredictions((prev) => {
              const others = prev.filter((e) => !(e.id.startsWith('pred-partner-')))
              return [...others, ...evs.map((e, i) => ({ ...e, id: `pred-partner-${i}` }))]
            })
          })
        })
      }

      return () => {
        unsubOwner?.()
        unsubPartner?.()
      }
    }
    const cleanup = sub()
    return () => {
      // ignore async cleanup race
      if (typeof (cleanup as any) === 'function') (cleanup as any)()
    }
  }, [userId, partnerId])

  function openCreate(slotInfo?: { start: Date; end: Date }) {
    setEditingId(null)
    setForm({
      title: '',
      description: '',
      start: slotInfo?.start || new Date(),
      end: slotInfo?.end || new Date(),
      intimacy: false
    })
    setOpen(true)
  }

  function openEdit(ev: CalendarEvent) {
    setEditingId(ev.id)
    setForm({
      title: ev.title,
      description: ev.description || '',
      start: ev.start,
      end: ev.end,
      intimacy: ev.type === 'intimacy'
    })
    setOpen(true)
  }

  async function saveEvent() {
    const payload = {
      title: form.title || (form.intimacy ? 'Intimacy' : 'Untitled'),
      description: form.description || '',
      start: form.start.getTime(),
      end: form.end.getTime(),
      type: form.intimacy ? 'intimacy' : 'default',
      userIds: userIdSet,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }
    if (editingId) {
      await updateDoc(doc(calendarRef, editingId), payload)
    } else {
      await addDoc(calendarRef, payload)
    }
    setOpen(false)
  }

  async function deleteEvent(id: string) {
    await deleteDoc(doc(calendarRef, id))
    setOpen(false)
  }

  function buildPredictionEvents(cycles: any[]): CalendarEvent[] {
    if (cycles.length === 0) return []
    const sorted = [...cycles].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    const avg = (() => {
      const completed = sorted.filter((c) => c.endDate)
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
    })()
    const lastStart = new Date(sorted[0].startDate)
    const nextStart = addDays(lastStart, avg)
    const periodEvent: CalendarEvent = {
      id: 'pred-next-period',
      title: 'Expected Period',
      start: nextStart,
      end: addDays(nextStart, 5),
      type: 'prediction',
      userIds: []
    }
    const ovulation = addDays(nextStart, -14)
    const fertileStart = addDays(ovulation, -3)
    const fertileEnd = addDays(ovulation, 1)
    const fertileEvent: CalendarEvent = {
      id: 'pred-fertile',
      title: 'Fertile Window',
      start: fertileStart,
      end: fertileEnd,
      type: 'fertile',
      userIds: []
    }
    return [periodEvent, fertileEvent]
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Shared Calendar {partnerId ? '' : '(solo)'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3 flex gap-2">
            <Button onClick={() => openCreate()}>Create Event</Button>
          </div>
          <RBCalendar
            localizer={localizer}
            events={[...events, ...predictions]}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 650 }}
            selectable
            onSelectSlot={(slotInfo: { start: Date; end: Date }) => openCreate({ start: slotInfo.start, end: slotInfo.end })}
            onSelectEvent={(ev: CalendarEvent) => openEdit(ev)}
            eventPropGetter={(event: CalendarEvent) => {
              const isIntimacy = (event as any).type === 'intimacy'
              const isPrediction = (event as any).type === 'prediction' || (event as any).type === 'fertile'
              const style = {
                backgroundColor: isPrediction
                  ? 'rgba(34,197,94,0.18)'
                  : isIntimacy
                    ? 'rgba(236, 72, 153, 0.25)'
                    : 'rgba(99, 102, 241, 0.2)',
                borderColor: isPrediction ? '#22c55e' : isIntimacy ? '#ec4899' : '#6366f1',
                color: '#1f2937'
              }
              return { style }
            }}
            components={{
              event: ({ event }: any) => (
                <div className="flex items-center gap-1">
                  {event.type === 'intimacy' && <Heart className="w-3 h-3 text-pink-600" />}
                  <span>{event.title}</span>
                </div>
              )
            }}
            views={[Views.MONTH, Views.WEEK, Views.DAY]}
            popup
          />
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Event' : 'Create Event'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start">Start</Label>
              <Input
                id="start"
                type="datetime-local"
                value={format(form.start, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => setForm((f) => ({ ...f, start: new Date(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">End</Label>
              <Input
                id="end"
                type="datetime-local"
                value={format(form.end, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => setForm((f) => ({ ...f, end: new Date(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch id="intimacy" checked={form.intimacy} onCheckedChange={(v) => setForm((f) => ({ ...f, intimacy: v }))} />
              <Label htmlFor="intimacy" className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-600" /> Intimacy
              </Label>
            </div>
          </div>
          <DialogFooter>
            {editingId && (
              <Button variant="destructive" onClick={() => deleteEvent(editingId!)}>
                Delete
              </Button>
            )}
            <Button onClick={saveEvent}>{editingId ? 'Save' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

