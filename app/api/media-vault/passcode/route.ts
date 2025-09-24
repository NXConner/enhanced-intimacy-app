export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import bcryptjs from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { passcode } = await request.json()
    if (!passcode || typeof passcode !== 'string' || passcode.length < 4) {
      return NextResponse.json({ error: 'Passcode must be at least 4 characters' }, { status: 400 })
    }

    const passcodeHash = await bcryptjs.hash(passcode, 10)

    // Upsert the user's vault
    await prisma.mediaVault.upsert({
      where: { userId: session.user.id },
      update: { passcodeHash },
      create: {
        userId: session.user.id,
        passcodeHash
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Vault passcode error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
