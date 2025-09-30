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

    const { sessionType = 'relationship_coaching' } = await request.json().catch(() => ({ }))

    const created = await prisma.coachingSession.create({
      data: {
        userId: session.user.id,
        sessionType,
        status: 'active'
      },
      select: { id: true, sessionType: true, status: true, startTime: true }
    })

    return NextResponse.json({ sessionId: created.id, sessionType: created.sessionType, status: created.status, startedAt: created.startTime })
  } catch (error) {
    console.error('Start coaching session error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

