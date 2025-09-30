export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

const UNLOCK_COOKIE_NAME = 'vault_unlocked'
const UPLOADS_DIR = path.join(process.cwd(), 'Uploads')

async function ensureUnlocked(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  const isUnlocked = request.cookies.get(UNLOCK_COOKIE_NAME)?.value === '1'
  if (!isUnlocked) {
    return { error: NextResponse.json({ error: 'Vault locked' }, { status: 423 }) }
  }
  return { session }
}

export async function GET(request: NextRequest) {
  const result = await ensureUnlocked(request)
  if ('error' in result) return result.error
  const { session } = result

  const items = await prisma.mediaItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json({ items })
}

export async function POST(request: NextRequest) {
  const result = await ensureUnlocked(request)
  if ('error' in result) return result.error
  const { session } = result

  try {
    const contentType = request.headers.get('content-type') || ''
    if (!contentType.startsWith('multipart/form-data')) {
      return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 })
    }

    await fs.mkdir(UPLOADS_DIR, { recursive: true })
    const userDir = path.join(UPLOADS_DIR, session.user.id)
    await fs.mkdir(userDir, { recursive: true })

    const arrayBuffer = await file.arrayBuffer()
    let buffer = Buffer.from(arrayBuffer)

    // Optional at-rest encryption using AES-256-GCM
    const encKey = process.env.VAULT_ENCRYPTION_KEY || process.env.MEDIA_ENCRYPTION_KEY
    if (encKey) {
      try {
        const key = parseEncryptionKey(encKey)
        const iv = crypto.randomBytes(12) // GCM recommended IV size
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
        const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()])
        const authTag = cipher.getAuthTag()
        const header = Buffer.from('VAULTv1')
        buffer = Buffer.concat([header, iv, authTag, encrypted])
      } catch (e) {
        console.error('Encryption failed, storing plaintext:', e)
      }
    }

    const storedFilename = `${Date.now()}_${Math.random().toString(36).slice(2)}_${file.name}`
    const filePath = path.join(userDir, storedFilename)
    await fs.writeFile(filePath, buffer)

    const stats = await fs.stat(filePath)
    const mimeType = file.type || 'application/octet-stream'

    const vault = await prisma.mediaVault.upsert({
      where: { userId: session.user.id },
      update: {},
      create: { userId: session.user.id }
    })

    const item = await prisma.mediaItem.create({
      data: {
        userId: session.user.id,
        vaultId: vault.id,
        originalName: file.name,
        storedFilename,
        mimeType,
        fileSizeBytes: Number(stats.size),
        storagePath: `/Uploads/${session.user.id}/${storedFilename}`
      }
    })

    return NextResponse.json({ item })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const result = await ensureUnlocked(request)
  if ('error' in result) return result.error
  const { session } = result

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const item = await prisma.mediaItem.findUnique({ where: { id } })
    if (!item || item.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const filePath = path.join(process.cwd(), item.storagePath)
    await prisma.mediaItem.delete({ where: { id } })
    await fs.unlink(filePath).catch(() => {})

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}

function parseEncryptionKey(value: string): Buffer {
  const trimmed = String(value).trim()
  // Support base64 (preferred) or hex
  if (/^[A-Fa-f0-9]{64}$/.test(trimmed)) {
    return Buffer.from(trimmed, 'hex')
  }
  const b64 = trimmed.replace(/^base64:/, '')
  const buf = Buffer.from(b64, 'base64')
  if (buf.length !== 32) {
    throw new Error('VAULT_ENCRYPTION_KEY must be 32 bytes (base64 or 64-char hex)')
  }
  return buf
}
