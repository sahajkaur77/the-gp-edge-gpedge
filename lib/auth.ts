import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import db from './db'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("[NextAuth] Authorize callback triggered for email:", credentials?.email)
        if (!credentials?.email || !credentials?.password) {
          console.warn("[NextAuth] Missing email or password in credentials")
          return null
        }

        try {
          const user = await db.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user) {
            console.warn("[NextAuth] User not found for email:", credentials.email)
            return null
          }

          if (!user.password_hash) {
            console.warn("[NextAuth] User has no password hash set:", credentials.email)
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password_hash
          )

          if (!isPasswordValid) {
            console.warn("[NextAuth] Invalid password for email:", credentials.email)
            return null
          }

          console.log("[NextAuth] Authorization successful for user:", {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          })

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          }
        } catch (authError) {
          console.error("[NextAuth] Error in authorize callback:", authError)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    }
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
  }
}
