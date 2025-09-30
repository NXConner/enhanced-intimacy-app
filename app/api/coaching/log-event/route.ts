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

    const { sessionId, eventType, message, aiConfidence, userReaction, effectiveness } = await request.json().catch(() => ({}))
    if (!sessionId || !eventType || !message) {
      return NextResponse.json({ error: 'sessionId, eventType, and message are required' }, { status: 400 })
    }

    // Ensure session belongs to user
    const coachingSession = await prisma.coachingSession.findUnique({ where: { id: sessionId } })
    if (!coachingSession || coachingSession.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const rec = await prisma.feedbackEvent.create({
      data: {
        coachingSessionId: sessionId,
        eventType,
        message,
        aiConfidence: typeof aiConfidence === 'number' ? aiConfidence : 0.9,
        userReaction: userReaction ?? null,
        effectiveness: typeof effectiveness === 'number' ? effectiveness : null
      }
    })

    return NextResponse.json({ id: rec.id })
  } catch (error) {
    console.error('Coaching log-event error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

