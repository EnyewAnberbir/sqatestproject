import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        try {
          const response = await fetch('http://localhost:8000/api/auth/token/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: credentials.email,
              password: credentials.password,
            }),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.detail || 'Authentication failed')
          }

          return {
            id: credentials.email,
            email: credentials.email,
            name: credentials.email,
            accessToken: data.access,
            refreshToken: data.refresh,
          }
        } catch (error) {
          console.error('Authentication error:', error)
          throw new Error('Authentication failed')
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Initial sign in
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          email: user.email,
        }
      }

      // On subsequent calls, return the token if it's still valid
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      session.user.accessToken = token.accessToken
      session.user.refreshToken = token.refreshToken
      session.user.email = token.email
      
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 