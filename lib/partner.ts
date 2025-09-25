import { prisma } from './db'

export async function getConnectedPartnerId(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return null
  try {
    const settings = (user.privacySettings ?? {}) as any
    const partnerId = settings?.connectedPartnerId
    if (typeof partnerId === 'string' && partnerId.length > 0) return partnerId
    return null
  } catch {
    return null
  }
}

