import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import QuizzesClient from './quizzes-client'

export default async function QuizzesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/auth/signin')
  return (
    <div className="container-custom py-8">
      <QuizzesClient userId={session.user.id} />
    </div>
  )
}

