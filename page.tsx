
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import HomeLanding from '@/components/home/home-landing'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  if (session?.user) {
    redirect('/dashboard')
  }

  return <HomeLanding />
}
