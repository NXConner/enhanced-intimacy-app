'use client'

import { useEffect, useMemo, useState } from 'react'
import { Calendar as RBCalendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { useSession } from 'next-auth/react'
import { collection, onSnapshot, query, where, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Heart } from 'lucide-react'

const locales: Record<string, any> = {
  'en-US': {
    format,
    parse,
    startOfWeek,
    getDay,
    locales: undefined,
  },
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

type CalendarEvent = {
  id: string
  title: string
  start: Date
  end: Date
  description?: string
  type?: 'default' | 'intimacy'
}

export default function SharedCalendar() {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<{ id?: string; title: string; start: string; end: string; description?: string; type: 'default' | 'intimacy' }>({
    title: '',
    start: '',
    end: '',
    description: '',
    type: 'default',
  })

  useEffect(() => {
    if (!userId) return
    const q = query(collection(firestore, 'calendars'), where('userIds', 'array-contains', userId))
    const unsub = onSnapshot(q, (snap) => {
      const loaded: CalendarEvent[] = snap.docs.map((d) => {
        const data = d.data() as any
        return {
          id: d.id,
          title: data.title,
          start: new Date(data.start),
          end: new Date(data.end),
          description: data.description,
          type: (data.type as any) || 'default',
        }
      })
      setEvents(loaded)
    })
    return () => unsub()
  }, [userId])

  const onSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setForm({ title: '', start: new Date(start).toISOString().slice(0, 16), end: new Date(end).toISOString().slice(0, 16), description: '', type: 'default' })
    setOpen(true)
  }

  const onSelectEvent = (event: CalendarEvent) => {
    setForm({ id: event.id, title: event.title, start: new Date(event.start).toISOString().slice(0, 16), end: new Date(event.end).toISOString().slice(0, 16), description: event.description, type: event.type || 'default' })
    setOpen(true)
  }

  const resetForm = () => setForm({ title: '', start: '', end: '', description: '', type: 'default' })

  const createOrUpdate = async () => {
    if (!userId) return
    const payload = {
      title: form.title,
      start: new Date(form.start).toISOString(),
      end: new Date(form.end).toISOString(),
      description: form.description || '',
      type: form.type,
      userIds: [userId],
      updatedAt: serverTimestamp(),
    }
    if (form.id) {
      await updateDoc(doc(firestore, 'calendars', form.id), payload)
    } else {
      await addDoc(collection(firestore, 'calendars'), { ...payload, createdAt: serverTimestamp() })
    }
    setOpen(false)
    resetForm()
  }

  const onDelete = async () => {
    if (!form.id) return
    await deleteDoc(doc(firestore, 'calendars', form.id))
    setOpen(false)
    resetForm()
  }

  const eventPropGetter = (event: CalendarEvent) => {
    if (event.type === 'intimacy') {
      return { className: 'bg-rose-100 border border-rose-300 text-rose-900' }
    }
    return { className: 'bg-indigo-100 border border-indigo-300 text-indigo-900' }
  }

  const components = useMemo(() => ({
    event: ({ event }: { event: CalendarEvent }) => (
      <div className="flex items-center gap-1">
        {event.type === 'intimacy' && <Heart className="h-3 w-3 text-rose-600" />}
        <span>{event.title}</span>
      </div>
    ),
  }), [])

  return (
    <div className="p-4">
      <div className="h-[75vh] bg-white rounded-md p-2">
        <RBCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={onSelectSlot as any}
          onSelectEvent={onSelectEvent as any}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          eventPropGetter={eventPropGetter as any}
          components={components as any}
        />
      </div>

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form.id ? 'Edit Event' : 'New Event'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            <div className="grid grid-cols-2 gap-2">
              <Input type="datetime-local" value={form.start} onChange={(e) => setForm((f) => ({ ...f, start: e.target.value }))} />
              <Input type="datetime-local" value={form.end} onChange={(e) => setForm((f) => ({ ...f, end: e.target.value }))} />
            </div>
            <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            <Select value={form.type} onValueChange={(v: any) => setForm((f) => ({ ...f, type: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="intimacy">Intimacy</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-2 pt-2">
              {form.id && (
                <Button variant="destructive" onClick={onDelete}>Delete</Button>
              )}
              <Button onClick={createOrUpdate}>{form.id ? 'Save' : 'Create'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

