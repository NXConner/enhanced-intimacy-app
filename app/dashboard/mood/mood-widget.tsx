'use client'

import { useEffect, useMemo, useState } from 'react'
import { firestore } from '@/lib/firebase'
import { addDoc, collection, onSnapshot, query, serverTimestamp, where } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Props = { userId: string }

const MOODS = ['Happy', 'Stressed', 'Calm', 'Anxious', 'Excited']

export default function MoodWidget({ userId }: Props) {
  const [today, setToday] = useState<string | null>(null)

  useEffect(() => {
    const logsRef = collection(firestore, 'mood_logs')
    const todayStr = new Date().toISOString().slice(0, 10)
    const q = query(logsRef, where('userId', '==', userId), where('date', '==', todayStr))
    const unsub = onSnapshot(q, (snap) => {
      let mood: string | null = null
      snap.forEach((d) => (mood = (d.data() as any)?.mood || null))
      setToday(mood)
    })
    return () => unsub()
  }, [userId])

  async function setMood(mood: string) {
    const logsRef = collection(firestore, 'mood_logs')
    await addDoc(logsRef, {
      userId,
      mood,
      date: new Date().toISOString().slice(0, 10),
      createdAt: serverTimestamp()
    })
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Today's Mood</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <Button key={m} variant={today === m ? 'default' : 'secondary'} onClick={() => void setMood(m)}>
              {m}
            </Button>
          ))}
        </div>
        {today && <div className="text-sm mt-2">Logged: {today}</div>}
      </CardContent>
    </Card>
  )
}

