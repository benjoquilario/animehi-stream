import type { NextAuthConfig } from "next-auth"
import { env } from "./env.mjs"

export const authConfig = {
  session: {
    strategy: "jwt",
  },
  secret: env.AUTH_SECRET,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      // @ts-expect-error
      session.user.id = token.id
      return session
    },
    authorized({ request, auth }) {
      return !!auth?.user
    },
  },
  providers: [],
} satisfies NextAuthConfig
