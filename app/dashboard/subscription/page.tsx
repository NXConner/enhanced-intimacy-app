import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import SubscriptionClient from './subscription-client'

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/auth/signin')

}

