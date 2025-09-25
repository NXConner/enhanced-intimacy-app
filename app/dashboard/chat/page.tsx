import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ChatClient from './ChatClient'
import { getConnectedPartnerId } from '@/lib/partner'

export default async function ChatPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/auth/signin')
  const partnerId = await getConnectedPartnerId(session.user.id)
  if (!partnerId) {
    return (
      <div className="container-custom py-8">
        <p className="text-sm text-muted-foreground">No connected partner yet. Connect a partner in settings.</p>
      </div>
    )
  }
  return (
    <div className="container-custom py-8">
      <ChatClient userId={session.user.id} partnerId={partnerId} />
    </div>
  )
}

