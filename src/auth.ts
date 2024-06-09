import NextAuth, { DefaultSession } from "next-auth"
import { authConfig } from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import db from "@/lib/db"
import bcrypt from "bcrypt"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { credentialsValidator } from "@/lib/validations/credentials"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = credentialsValidator.safeParse(credentials)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data

          if (!email || !password) return null

          const user = await db.user.findUnique({
            where: {
              email: email,
            },
          })

          if (!user || !user?.password) return null

          const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
          )

          if (!isPasswordCorrect) return null

          return {
            id: user.id,
            image: user.image,
            email: user.email,
            name: user.userName,
          }
        }

        return null
      },
    }),
  ],
})
