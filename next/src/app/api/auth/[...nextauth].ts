import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null
        }

        // 1. Find the user in your database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          return null // User not found
        }

        // 2. Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null // Password does not match
        }

        // 3. If everything is correct, return the user object
        return {
          id: user.id.toString(),
          email: user.email,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/login",
  },
})

export const GET = handlers.GET
export const POST = handlers.POST