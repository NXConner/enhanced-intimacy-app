
'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/lib/theme'
import { Toaster } from './ui/toaster'
import { useEffect, type ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { getToken, isSupported } from 'firebase/messaging'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { firestore, getMessagingIfSupported } from '@/lib/firebase'

interface ProvidersProps {
  children: ReactNode
  session?: any
}

export default function Providers({ children, session }: ProvidersProps) {
  const { data: sess } = useSession()

  useEffect(() => {
    const registerFcm = async () => {
      try {
        if (!sess?.user?.id) return
        if (!(await isSupported())) return
        if (!('Notification' in window)) return
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') return
        const messaging = await getMessagingIfSupported()
        if (!messaging) return
        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
        if (!vapidKey) return
        const token = await getToken(messaging, { vapidKey })
        if (!token) return
        const tokenRef = doc(firestore, `users/${sess.user.id}/deviceTokens/${token}`)
        await setDoc(tokenRef, { createdAt: serverTimestamp(), platform: 'web' }, { merge: true })
      } catch (err) {
        // swallow errors; FCM is optional
        console.warn('FCM registration failed', err)
      }
    }
    registerFcm()
  }, [sess?.user?.id])
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
