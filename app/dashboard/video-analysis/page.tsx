
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import VideoAnalysisClient from './video-analysis-client'

export default async function VideoAnalysisPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  // Check if user has premium access for video analysis
  if (session.user.subscriptionTier !== 'premium' && session.user.subscriptionTier !== 'professional') {
    redirect('/dashboard?upgrade=video-analysis')
  }

  return <VideoAnalysisClient />
}
