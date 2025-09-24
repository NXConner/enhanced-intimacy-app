
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import './globals.css'
import Providers from '@/components/providers'
import { authOptions } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Intimacy Coach - Professional Relationship Enhancement',
  description: 'AI-powered intimacy coaching platform for couples seeking to enhance their relationship through personalized guidance, progress tracking, and educational resources.',
  keywords: 'intimacy coaching, relationship enhancement, couples therapy, AI coaching, relationship guidance',
  authors: [{ name: 'Intimacy Coach Team' }],
  robots: 'index, follow',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
