export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { type, version, accepted, metadata } = await req.json().catch(() => ({}))
  if (!type || typeof accepted !== 'boolean') return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  const rec = await prisma.consentLog.create({ data: { userId: session.user.id, type, version, accepted, metadata } })
  return NextResponse.json({ success: true, id: rec.id })
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const logs = await prisma.consentLog.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ logs })
}

