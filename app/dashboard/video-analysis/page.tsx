import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
// Temporarily disable heavy client to unblock build; render a placeholder instead

export default async function VideoAnalysisPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  if (session.user.subscriptionTier !== 'premium' && session.user.subscriptionTier !== 'professional') {
    redirect('/dashboard/subscription')
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto border rounded-md p-6 bg-white/70">
        <h1 className="text-xl font-semibold mb-2">AI Video Analysis</h1>
        <p className="text-sm text-muted-foreground">This feature is temporarily unavailable in this build. Please check back soon.</p>
      </div>
    </div>
  )
}
