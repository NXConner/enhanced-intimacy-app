import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import SharedCalendarClient from './SharedCalendarClient'
import { getConnectedPartnerId } from '@/lib/partner'

export default async function CalendarPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/auth/signin')

  const partnerId = await getConnectedPartnerId(session.user.id)

  return (
    <div className="container-custom py-8">
      <SharedCalendarClient userId={session.user.id} partnerId={partnerId} />
    </div>
  )
}

