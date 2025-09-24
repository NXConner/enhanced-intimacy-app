
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
// Temporarily disable the heavy client UI for static export

export default async function VideoAnalysisPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  // Check if user has premium access for video analysis
  if (session.user.subscriptionTier !== 'premium' && session.user.subscriptionTier !== 'professional') {
    redirect('/dashboard?upgrade=video-analysis')
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-2">AI Video Analysis</h1>
      <p className="text-sm text-muted-foreground">
        This feature is temporarily unavailable in offline export mode. Switch to online mode or enable network to use live/upload analysis.
      </p>
    </div>
  )
}
