export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId, satisfactionScore, sessionData } = await request.json().catch(() => ({}))
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
    }

    const existing = await prisma.coachingSession.findUnique({ where: { id: sessionId } })
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const endTime = new Date()
    const durationMinutes = Math.max(0, Math.round(((endTime.getTime() - new Date(existing.startTime).getTime()) / 1000) / 60))

    const updated = await prisma.coachingSession.update({
      where: { id: sessionId },
      data: {
        status: 'completed',
        endTime,
        durationMinutes,
        satisfactionScore: typeof satisfactionScore === 'number' ? satisfactionScore : existing.satisfactionScore ?? null,
        sessionData: sessionData ?? existing.sessionData ?? null
      },
      select: { id: true, status: true, startTime: true, endTime: true, durationMinutes: true, satisfactionScore: true }
    })

    return NextResponse.json({ session: updated })
  } catch (error) {
    console.error('End coaching session error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

