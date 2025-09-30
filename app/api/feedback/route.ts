export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const items = await prisma.feedbackSubmission.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ items })
  } catch (error) {
    console.error('Feedback GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { feedbackType = 'general', subject, message, priority = 'normal', attachmentUrl } = await request.json().catch(() => ({}))
    if (!subject || !message) {
      return NextResponse.json({ error: 'subject and message are required' }, { status: 400 })
    }

    const rec = await prisma.feedbackSubmission.create({
      data: {
        userId: session.user.id,
        feedbackType,
        subject,
        message,
        priority,
        attachmentUrl: attachmentUrl ?? null
      }
    })

    return NextResponse.json({ id: rec.id })
  } catch (error) {
    console.error('Feedback POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

