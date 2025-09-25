
'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/lib/theme'
import { Toaster } from './ui/toaster'
import { useEffect } from 'react'
import { getFirebaseMessaging } from '@/lib/firebase'
import { useSession } from 'next-auth/react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'

interface ProvidersProps {
  children: React.ReactNode
  session?: any
}

export default function Providers({ children, session }: ProvidersProps) {
  const { data } = useSession()
  useEffect(() => {
    async function registerFCM() {
      if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return
      const messaging = await getFirebaseMessaging()
      if (!messaging) return
      try {
        const { getToken } = await import('firebase/messaging')
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
        const token = await getToken(messaging, { serviceWorkerRegistration: registration, vapidKey })
        if (token && data?.user?.id) {
          await addDoc(collection(firestore, 'fcm_tokens'), {
            userId: data.user.id,
            token,
            createdAt: serverTimestamp()
          })
        }
      } catch {
        // ignore
      }
    }
    void registerFCM()
  }, [data?.user?.id])
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  )
}
