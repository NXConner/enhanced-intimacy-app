
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AIStatusClient from './ai-status-client'

export default async function AIStatusPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  // Premium/Professional feature check
  if (session.user.subscriptionTier !== 'premium' && session.user.subscriptionTier !== 'professional') {
    redirect('/dashboard?upgrade=ai-status')
  }

  return <AIStatusClient />
}

