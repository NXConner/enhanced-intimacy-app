import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import GoalsClient from './goals-client'
import { getConnectedPartnerId } from '@/lib/partner'

export default async function GoalsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/auth/signin')
  const partnerId = await getConnectedPartnerId(session.user.id)
  return (
    <div className="container-custom py-8">
      <GoalsClient userId={session.user.id} partnerId={partnerId} />
    </div>
  )
}

