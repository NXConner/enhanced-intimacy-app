export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const items = await prisma.notification.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ items })
  } catch (error) {
    console.error('Notifications GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { type = 'system_update', title, message, priority = 'normal', actionUrl, scheduledFor } = await request.json().catch(() => ({}))
    if (!title || !message) return NextResponse.json({ error: 'title and message are required' }, { status: 400 })

    const rec = await prisma.notification.create({
      data: {
        userId: session.user.id,
        type,
        title,
        message,
        priority,
        actionUrl: actionUrl ?? null,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null
      }
    })

    return NextResponse.json({ id: rec.id })
  } catch (error) {
    console.error('Notifications POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, isRead } = await request.json().catch(() => ({}))
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const item = await prisma.notification.findUnique({ where: { id } })
    if (!item || item.userId !== session.user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const updated = await prisma.notification.update({ where: { id }, data: { isRead: Boolean(isRead) } })
    return NextResponse.json({ id: updated.id, isRead: updated.isRead })
  } catch (error) {
    console.error('Notifications PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

