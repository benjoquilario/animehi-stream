import type { NextAuthConfig } from "next-auth"
import { env } from "./env.mjs"
import User from "./app/(site)/user/page"

export const authConfig = {
  session: {
    strategy: "jwt",
  },
  secret: env.AUTH_SECRET,
  callbacks: {
    jwt({ token, user }) {
      return { ...token, ...user }
    },
    session({ session, token, user }) {
      // @ts-expect-error
      rsession.user = token
      return session
    },
    authorized({ request, auth }) {
      return !!auth?.user
    },
  },
  providers: [],
} satisfies NextAuthConfig
