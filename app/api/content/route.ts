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
    const items = await prisma.educationalContent.findMany({ orderBy: { createdAt: 'desc' }, take: 50 })
    return NextResponse.json({ items })
  } catch (error) {
    console.error('Content GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { title, contentType = 'article', category = 'relationships', difficultyLevel = 'beginner', content, isPremium = false, tags } = await request.json().catch(() => ({}))
    if (!title || !content) return NextResponse.json({ error: 'title and content are required' }, { status: 400 })
    const rec = await prisma.educationalContent.create({ data: { title, contentType, category, difficultyLevel, content, isPremium, tags } })
    return NextResponse.json({ id: rec.id })
  } catch (error) {
    console.error('Content POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

