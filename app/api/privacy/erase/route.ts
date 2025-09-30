export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = session.user.id

  // Soft-delete strategy: remove personal data and dependent records; keep minimal stub if desired
  await prisma.$transaction(async (tx) => {
    await tx.analysisRecord.deleteMany({ where: { userId } })
    await tx.feedbackEvent.deleteMany({ where: { coachingSession: { userId } } })
    await tx.coachingSession.deleteMany({ where: { userId } })
    await tx.progressTracking.deleteMany({ where: { userId } })
    await tx.coachingPreferences.deleteMany({ where: { userId } })
    await tx.educationalProgress.deleteMany({ where: { userId } })
    await tx.notification.deleteMany({ where: { userId } })
    await tx.feedbackSubmission.deleteMany({ where: { userId } })
    await tx.userPositionRecommendation.deleteMany({ where: { userId } })
    await tx.consentLog.deleteMany({ where: { userId } })
    await tx.passwordResetToken.deleteMany({ where: { userId } })
    await tx.emailVerificationToken.deleteMany({ where: { userId } })
    await tx.mediaItem.deleteMany({ where: { userId } })
    await tx.mediaVault.deleteMany({ where: { userId } })
    await tx.session.deleteMany({ where: { userId } })
    await tx.account.deleteMany({ where: { userId } })
    await tx.user.delete({ where: { id: userId } })
  })

  return NextResponse.json({ success: true })
}

