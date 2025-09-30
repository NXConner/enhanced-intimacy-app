export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = session.user.id

  const [user, sessions, progress, prefs, media, analyses, consents] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, fullName: true, createdAt: true } }),
    prisma.coachingSession.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
    prisma.progressTracking.findMany({ where: { userId } }),
    prisma.coachingPreferences.findUnique({ where: { userId } }),
    prisma.mediaItem.findMany({ where: { userId }, select: { id: true, originalName: true, mimeType: true, fileSizeBytes: true, createdAt: true } }),
    prisma.analysisRecord.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
    prisma.consentLog.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
  ])

  const payload = { user, sessions, progress, preferences: prefs, media, analyses, consents }

  return NextResponse.json(payload)
}

