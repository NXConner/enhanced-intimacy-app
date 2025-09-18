
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    subscriptionTier?: string
    isActive?: boolean
    fullName?: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name?: string
      fullName?: string
      image?: string
      subscriptionTier?: string
      isActive?: boolean
    }
  }

  interface JWT {
    subscriptionTier?: string
    isActive?: boolean
    fullName?: string
  }
}
