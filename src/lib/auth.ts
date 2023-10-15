import type { DefaultSession } from "@auth/core/types"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import db from "./db"
import type { NextAuthOptions } from "next-auth"
import { publicUrl } from "./consumet"
import { ApolloClient, InMemoryCache, gql } from "@apollo/client"

const defaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
}

const client = new ApolloClient({
  uri: "https://graphql.anilist.co",
  cache: new InMemoryCache(),
  // @ts-expect-error
  defaultOptions: defaultOptions,
})

export const providers = ["anilist"] as const

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    {
      id: "anilist",
      name: "Anilist",
      type: "oauth",
      authorization: {
        url: "https://anilist.co/api/v2/oauth/authorize",
        params: {
          scope: "",
          response_type: "code",
        },
      },
      token: "https://anilist.co/api/v2/oauth/token",
      userinfo: `${publicUrl}/api/anilist/userinfo`,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      profile(profile) {
        return {
          token: profile.token,
          id: profile.sub,
          name: profile?.name,
          image: profile.image,
          // lsist: profile?.list,
        }
      },
    },
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    //Sets the session to use JSON Web Token
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user }
    },
    async session({ session, token, user }) {
      // @ts-expect-error
      session.user = token
      return session
    },
  },
}
