'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

const questions = [
  { id: 'words', text: 'I feel loved when my partner gives me kind words.' },
  { id: 'time', text: 'I feel loved when we spend quality time together.' },
  { id: 'gifts', text: 'I feel loved when I receive thoughtful gifts.' },
  { id: 'service', text: 'I feel loved when my partner helps with tasks.' },
  { id: 'touch', text: 'I feel loved with physical affection.' },
]

export default function Quizzes() {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [result, setResult] = useState<string | null>(null)

  const submit = async () => {
    if (!userId) return
    const entries = Object.entries(answers)
    if (entries.length < questions.length) return
    const scores: Record<string, number> = { words: 0, time: 0, gifts: 0, service: 0, touch: 0 }
    entries.forEach(([k, v]) => { scores[k] += v })
    const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]
    const map: Record<string, string> = {
      words: 'Words of Affirmation',
      time: 'Quality Time',
      gifts: 'Receiving Gifts',
      service: 'Acts of Service',
      touch: 'Physical Touch',
    }
    const loveLanguage = map[top]
    setResult(loveLanguage)
    await addDoc(collection(firestore, 'quiz_results'), {
      userId,
      quizKey: 'love_languages',
      answers,
      loveLanguage,
      createdAt: serverTimestamp(),
    })
    // Optionally mirror to a users collection field if present in Firestore rules
    await setDoc(doc(firestore, 'users', userId), { loveLanguage }, { merge: true })
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>The 5 Love Languages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {questions.map((q) => (
            <div key={q.id}>
              <p className="mb-2 font-medium">{q.text}</p>
              <RadioGroup
                value={String(answers[q.id] || '')}
                onValueChange={(v) => setAnswers((a) => ({ ...a, [q.id]: Number(v) }))}
                className="flex gap-4"
              >
                {[1,2,3,4,5].map((n) => (
                  <div key={n} className="flex items-center space-x-2">
                    <RadioGroupItem value={String(n)} id={`${q.id}-${n}`} />
                    <Label htmlFor={`${q.id}-${n}`}>{n}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
          <Button onClick={submit} disabled={!userId}>Submit</Button>
          {result && (
            <div className="mt-4 text-green-700 font-semibold">Your Love Language: {result}</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

