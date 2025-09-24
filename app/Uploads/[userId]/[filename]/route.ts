export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import path from 'path'
import { createReadStream } from 'fs'
import { promises as fs } from 'fs'

const UNLOCK_COOKIE_NAME = 'vault_unlocked'

export async function GET(request: NextRequest, context: { params: { userId: string; filename: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isUnlocked = request.cookies.get(UNLOCK_COOKIE_NAME)?.value === '1'
    if (!isUnlocked) {
      return NextResponse.json({ error: 'Vault locked' }, { status: 423 })
    }

    const { userId, filename } = context.params
    if (session.user.id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const item = await prisma.mediaItem.findFirst({
      where: { userId, storedFilename: filename }
    })
    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const filePath = path.join(process.cwd(), 'Uploads', userId, filename)
    const stat = await fs.stat(filePath)
    const fileSize = stat.size
    const range = request.headers.get('range')

    const headers: Record<string, string> = {
      'Accept-Ranges': 'bytes',
      'Content-Type': item.mimeType || 'application/octet-stream',
      'Cache-Control': 'private, no-store'
    }

    if (range) {
      const match = /bytes=(\d+)-(\d*)/.exec(range)
      if (!match) {
        return NextResponse.json({ error: 'Invalid range' }, { status: 416 })
      }
      const start = Number(match[1])
      const end = match[2] ? Number(match[2]) : fileSize - 1
      if (start >= fileSize || end >= fileSize) {
        return new NextResponse(null, {
          status: 416,
          headers: {
            'Content-Range': `bytes */${fileSize}`
          }
        })
      }
      const chunkSize = end - start + 1
      const stream = createReadStream(filePath, { start, end })
      return new NextResponse(stream as any, {
        status: 206,
        headers: {
          ...headers,
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Content-Length': String(chunkSize)
        }
      })
    }

    const stream = createReadStream(filePath)
    return new NextResponse(stream as any, {
      status: 200,
      headers: {
        ...headers,
        'Content-Length': String(fileSize)
      }
    })
  } catch (error) {
    console.error('File serve error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

