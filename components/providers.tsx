
'use client'

import { SessionProvider } from 'next-auth/react'
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
