
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardClient from './dashboard-client'
import { prisma } from '@/lib/db'
import { getConnectedPartnerId } from '@/lib/partner'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  // Fetch user data and recent activity
  const [user, recentSessions, progressData, preferences, partnerId] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id }
    }),
    prisma.coachingSession.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        arousalData: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      }
    }),
    prisma.progressTracking.findMany({
      where: { userId: session.user.id },
      orderBy: { measurementDate: 'desc' },
      take: 10
    }),
    prisma.coachingPreferences.findUnique({
      where: { userId: session.user.id }
    }),
    getConnectedPartnerId(session.user.id)
  ])

  return (
    <DashboardClient
      user={user}
      recentSessions={recentSessions}
      progressData={progressData}
      preferences={preferences}
      partnerId={partnerId}
    />
  )
}
