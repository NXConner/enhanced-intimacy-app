
'use client'

import React, { ReactNode } from 'react'
import { SessionProvider, useSession } from 'next-auth/react'
import { ThemeProvider } from '@/lib/theme'
import { Toaster } from './ui/toaster'


interface ProvidersProps {
  children: ReactNode
  session?: any
}

export default function Providers({ children, session }: ProvidersProps) {

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

export function RequireTier({ children, tier = 'premium' }: { children: React.ReactNode; tier?: 'premium' | 'professional' }) {
  const { data } = useSession()
  const userTier = (data?.user as any)?.subscriptionTier || 'free'
  const ok = tier === 'premium' ? (userTier === 'premium' || userTier === 'professional') : (userTier === 'professional')

  if (!ok) {
    return (
      <div className="max-w-xl mx-auto my-10 p-6 border rounded-md bg-yellow-50 text-yellow-900">
        <h2 className="font-semibold mb-2">Upgrade required</h2>
        <p className="mb-4">This section is available to {tier} subscribers.</p>
        <a className="inline-flex items-center px-4 py-2 rounded bg-black text-white" href="/dashboard/subscription">View plans</a>
      </div>
    )
  }

  return <>{children}</>
}
