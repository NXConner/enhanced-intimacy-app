export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

function generateToken(): string {
  return [...crypto.getRandomValues(new Uint8Array(32))].map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(req: NextRequest) {
  const { email } = await req.json().catch(() => ({}))
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })
  const user = await prisma.user.findUnique({ where: { email: String(email).toLowerCase().trim() } })
  if (!user) return NextResponse.json({ success: true })
  const token = generateToken()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24)
  await prisma.emailVerificationToken.create({ data: { userId: user.id, token, expiresAt } })
  // TODO: send email with verification link
  return NextResponse.json({ success: true })
}

export async function PUT(req: NextRequest) {
  const { token } = await req.json().catch(() => ({}))
  if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 })
  const rec = await prisma.emailVerificationToken.findUnique({ where: { token } })
  if (!rec || rec.usedAt || rec.expiresAt < new Date()) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
  await prisma.$transaction([
    prisma.user.update({ where: { id: rec.userId }, data: { emailVerified: new Date() } }),
    prisma.emailVerificationToken.update({ where: { token }, data: { usedAt: new Date() } })
  ])
  return NextResponse.json({ success: true })
}

