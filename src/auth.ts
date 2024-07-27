import NextAuth, { DefaultSession } from "next-auth"
import { authConfig } from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import db from "@/lib/db"
import bcrypt from "bcrypt"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { credentialsValidator } from "@/lib/validations/credentials"
import { env } from "./env.mjs"

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
    {
      id: "anilist",
      name: "AniList",
      type: "oauth",
      authorization: {
        url: "https://anilist.co/api/v2/oauth/authorize",
        params: { scope: "", response_type: "code" },
      },
      token: "https://anilist.co/api/v2/oauth/token",
      userinfo: `${env.NEXT_PUBLIC_APP_URL}/api/anilist/userinfo`,
      clientId: env.CLIENT_ID,
      clientSecret: env.CLIENT_SECRET,
      profile(profile) {
        return {
          token: profile.token,
          id: profile.sub,
          name: profile?.name,
          image: profile.image,
          email: profile.email,
        }
      },
    },
  ],
})
