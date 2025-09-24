export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import bcryptjs from 'bcryptjs'

const UNLOCK_COOKIE_NAME = 'vault_unlocked'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { passcode } = await request.json()
    if (!passcode || typeof passcode !== 'string') {
      return NextResponse.json({ error: 'Invalid passcode' }, { status: 400 })
    }

    const vault = await prisma.mediaVault.findUnique({ where: { userId: session.user.id } })
    if (!vault?.passcodeHash) {
      return NextResponse.json({ error: 'Vault not set up' }, { status: 400 })
    }

    const valid = await bcryptjs.compare(passcode, vault.passcodeHash)
    if (!valid) {
      return NextResponse.json({ error: 'Incorrect passcode' }, { status: 403 })
    }

    const response = NextResponse.json({ success: true })
    // Set short-lived cookie marking unlocked; scoped to this app
    response.cookies.set(UNLOCK_COOKIE_NAME, '1', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 30, // 30 minutes
      path: '/'
    })
    return response
  } catch (error) {
    console.error('Vault unlock error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(UNLOCK_COOKIE_NAME, '', { maxAge: 0, path: '/' })
  return response
}
