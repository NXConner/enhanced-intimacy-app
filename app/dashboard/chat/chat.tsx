'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type Message = { id: string; senderId: string; receiverId: string; text: string; timestamp?: any }

export default function Chat() {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const [partnerId, setPartnerId] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!userId || !partnerId) return
    const q = query(
      collection(firestore, 'chats'),
      where('participants', 'in', [
        [userId, partnerId].sort(),
      ] as any),
      orderBy('timestamp', 'asc')
    )
    const unsub = onSnapshot(q, (snap) => {
      const loaded: Message[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
      setMessages(loaded)
    })
    return () => unsub()
  }, [userId, partnerId])

  // Simple local typing indicator
  const onUserTyping = () => {
    setIsTyping(true)
    if (typingTimeout.current) clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => setIsTyping(false), 1200)
  }

  const send = async () => {
    if (!userId || !partnerId || !text.trim()) return
    await addDoc(collection(firestore, 'chats'), {
      senderId: userId,
      receiverId: partnerId,
      text: text.trim(),
      participants: [userId, partnerId].sort(),
      timestamp: serverTimestamp(),
    })
    setText('')
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-3">
        <Input placeholder="Partner User ID" value={partnerId} onChange={(e) => setPartnerId(e.target.value)} />
      </div>
      <div className="border rounded-md h-[60vh] p-3 overflow-y-auto bg-white">
        {messages.map((m) => (
          <div key={m.id} className={`mb-2 flex ${m.senderId === userId ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] rounded-md px-3 py-2 ${m.senderId === userId ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>
              <div className="text-sm whitespace-pre-wrap">{m.text}</div>
            </div>
          </div>
        ))}
        {isTyping && <div className="text-xs text-gray-500">Typing…</div>}
      </div>
      <div className="mt-3 flex gap-2">
        <Input
          placeholder="Type a message"
          value={text}
          onChange={(e) => { setText(e.target.value); onUserTyping() }}
          onKeyDown={(e) => { if (e.key === 'Enter') send() }}
        />
        <Button onClick={send}>Send</Button>
      </div>
    </div>
  )
}

