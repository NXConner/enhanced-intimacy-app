export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { action, payload } = await request.json().catch(() => ({}))
    if (!action) return NextResponse.json({ error: 'action required' }, { status: 400 })

    switch (action) {
      case 'enroll':
        // Stub: client should handle biometric enrollment natively and send public key handle
        return NextResponse.json({ enrolled: true })
      case 'challenge':
        // Stub: return a mock challenge to be signed by platform authenticator
        return NextResponse.json({ challenge: Math.random().toString(36).slice(2) })
      case 'verify':
        // Stub: verify signature server-side in real impl; accept any for now
        return NextResponse.json({ verified: true })
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Biometric stub error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

