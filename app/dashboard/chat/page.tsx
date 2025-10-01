import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import ChatClient from './ChatClient'

export default async function ChatPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null
  // For demo, require a partnerId via query in a real app; here, render a simple chat requiring input
  return <ChatClient userId={session.user.id} partnerId={''} />
}

