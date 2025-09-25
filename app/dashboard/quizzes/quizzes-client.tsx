'use client'

import { useEffect, useMemo, useState } from 'react'
import { firestore } from '@/lib/firebase'
import { addDoc, collection, doc, getDoc, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

type Props = { userId: string }

const loveLanguageQuestions = [
  { id: 'q1', text: 'I feel loved when my partner gives me words of affirmation.' },
  { id: 'q2', text: 'I feel loved when my partner spends quality time with me.' },
  { id: 'q3', text: 'I feel loved when my partner gives me gifts.' },
  { id: 'q4', text: 'I feel loved when my partner helps with tasks (acts of service).' },
  { id: 'q5', text: 'I feel loved when my partner shows physical affection.' }
]

const loveLanguageMap = ['Words of Affirmation', 'Quality Time', 'Receiving Gifts', 'Acts of Service', 'Physical Touch']

export default function QuizzesClient({ userId }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [result, setResult] = useState<string | null>(null)
  const [previous, setPrevious] = useState<string | null>(null)

  useEffect(() => {
    const resultsRef = collection(firestore, 'quiz_results')
    const q = query(resultsRef, where('userId', '==', userId), where('quizId', '==', 'love_languages_v1'))
    const unsub = onSnapshot(q, (snap) => {
      let latest: any = null
      snap.forEach((d) => (latest = d.data()))
      setPrevious(latest?.result || null)
    })
    return () => unsub()
  }, [userId])

  const canSubmit = useMemo(() => loveLanguageQuestions.every((q) => typeof answers[q.id] === 'number'), [answers])

  function computeResult() {
    const scores = [0, 0, 0, 0, 0]
    loveLanguageQuestions.forEach((q, idx) => {
      scores[idx] = answers[q.id] ?? 0
    })
    const maxIdx = scores.indexOf(Math.max(...scores))
    return loveLanguageMap[maxIdx]
  }

  async function submit() {
    const res = computeResult()
    setResult(res)
    const resultsRef = collection(firestore, 'quiz_results')
    await addDoc(resultsRef, {
      userId,
      quizId: 'love_languages_v1',
      answers,
      result: res,
      createdAt: serverTimestamp()
    })
    // Update user's profile (in Prisma) is out of scope here; store in Firestore mirror for now
    const profileRef = doc(firestore, 'users', userId)
    await setDoc(profileRef, { loveLanguage: res, updatedAt: serverTimestamp() }, { merge: true })
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>The 5 Love Languages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {previous && (
          <div className="text-sm">Your previous result: <strong>{previous}</strong></div>
        )}
        {loveLanguageQuestions.map((q, idx) => (
          <div key={q.id} className="space-y-2">
            <div className="font-medium">{q.text}</div>
            <RadioGroup
              value={String(answers[q.id] ?? '')}
              onValueChange={(v) => setAnswers((a) => ({ ...a, [q.id]: Number(v) }))}
              className="flex gap-4"
            >
              {[0, 1, 2, 3, 4].map((val) => (
                <div key={val} className="flex items-center space-x-2">
                  <RadioGroupItem id={`${q.id}-${val}`} value={String(val)} />
                  <Label htmlFor={`${q.id}-${val}`}>{val}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
        <Button onClick={submit} disabled={!canSubmit}>Submit</Button>
        {result && <div className="text-sm">Your love language is: <strong>{result}</strong></div>}
      </CardContent>
    </Card>
  )
}

