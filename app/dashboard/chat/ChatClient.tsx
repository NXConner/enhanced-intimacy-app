'use client'

import { useEffect, useRef, useState } from 'react'
import { firestore } from '@/lib/firebase'
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  setDoc,
  doc
} from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

type Props = {
  userId: string
  partnerId: string
}

type ChatMessage = {
  id: string
  senderId: string
  receiverId: string
  text: string
  timestamp?: any
}

export default function ChatClient({ userId, partnerId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState('')
  const [partnerTyping, setPartnerTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const msgsRef = collection(firestore, 'chats')
    const q = query(
      msgsRef,
      where('pairKey', '==', pairKey(userId, partnerId)),
      orderBy('timestamp', 'asc'),
      limit(200)
    )
    const unsub = onSnapshot(q, (snap) => {
      const next: ChatMessage[] = []
      snap.forEach((d) => {
        const v = d.data() as any
        next.push({ id: d.id, senderId: v.senderId, receiverId: v.receiverId, text: v.text, timestamp: v.timestamp })
      })
      setMessages(next)
      scrollToBottom()
    })
    return () => unsub()
  }, [userId, partnerId])

  useEffect(() => {
    // Typing indicator via a lightweight presence doc per pair
    const presenceDoc = doc(firestore, 'typing', `${pairKey(userId, partnerId)}__${partnerId}`)
    const unsub = onSnapshot(presenceDoc, (snap) => {
      const v = snap.data() as any
      setPartnerTyping(Boolean(v?.typing))
    })
    return () => unsub()
  }, [userId, partnerId])

  function scrollToBottom() {
    requestAnimationFrame(() => {
      const el = document.getElementById('chat-scroll-bottom')
      el?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  async function sendMessage() {
    const trimmed = text.trim()
    if (!trimmed) return
    const msgsRef = collection(firestore, 'chats')
    await addDoc(msgsRef, {
      pairKey: pairKey(userId, partnerId),
      senderId: userId,
      receiverId: partnerId,
      text: trimmed,
      timestamp: serverTimestamp()
    })
    setText('')
    inputRef.current?.focus()
    await setTyping(false)
  }

  async function setTyping(typing: boolean) {
    const myPresenceDoc = doc(firestore, 'typing', `${pairKey(userId, partnerId)}__${userId}`)
    await setDoc(myPresenceDoc, { typing, updatedAt: serverTimestamp() }, { merge: true })
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[70vh]">
          <ScrollArea className="flex-1 border rounded-md p-4 bg-white/70">
            <div className="space-y-2">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.senderId === userId ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${m.senderId === userId ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div id="chat-scroll-bottom" />
            </div>
          </ScrollArea>
          <div className="flex items-center gap-2 mt-3">
            <Input
              ref={inputRef}
              value={text}
              placeholder="Type a message..."
              onChange={(e) => {
                setText(e.target.value)
                void setTyping(true)
              }}
              onBlur={() => void setTyping(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  void sendMessage()
                }
              }}
            />
            <Button onClick={() => void sendMessage()}>Send</Button>
          </div>
          <div className="h-6 mt-1">
            {partnerTyping && <Badge variant="secondary">Partner is typing…</Badge>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function pairKey(a: string, b: string) {
  return [a, b].sort().join('__')
}

