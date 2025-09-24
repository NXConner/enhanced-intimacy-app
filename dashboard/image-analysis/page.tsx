import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ImageAnalysisClient from './image-analysis-client'

export default async function ImageAnalysisPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  if (session.user.subscriptionTier !== 'premium' && session.user.subscriptionTier !== 'professional') {
    redirect('/dashboard?upgrade=image-analysis')
  }

  return <ImageAnalysisClient />
}

