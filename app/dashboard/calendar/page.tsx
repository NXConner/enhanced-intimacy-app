import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import SharedCalendarClient from './SharedCalendarClient'

export default async function CalendarPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return null
  }
  // Partner linkage is optional on this page; omit for now
  return <SharedCalendarClient userId={session.user.id} partnerId={null} />
}

