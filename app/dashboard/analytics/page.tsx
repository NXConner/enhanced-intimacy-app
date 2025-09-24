
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AnalyticsClient from './analytics-client'

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  // Premium feature check
  if (session.user.subscriptionTier !== 'premium' && session.user.subscriptionTier !== 'professional') {
    redirect('/dashboard?upgrade=analytics')
  }

  return <AnalyticsClient />
}

