// import type { DefaultSession } from "@auth/core/types"
// import { PrismaAdapter } from "@next-auth/prisma-adapter"
// import db from "./db"
// import bcrypt from "bcrypt"
// import type { NextAuthOptions } from "next-auth"
// import CredentialsProvider from "next-auth/providers/credentials"
// import { credentialsValidator } from "@/lib/validations/credentials"
// import { env } from "@/env.mjs"

// export const providers = ["anilist"] as const

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string
//     } & DefaultSession["user"]
//   }
// }

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(db),
//   providers: [
//     {
//       id: "anilist",
//       name: "Anilist",
//       type: "oauth",
//       authorization: {
//         url: "https://anilist.co/api/v2/oauth/authorize",
//         params: {
//           scope: "",
//           response_type: "code",
//         },
//       },
//       token: "https://anilist.co/api/v2/oauth/token",
//       userinfo: `${process.env.NEXT_PUBLIC_APP_URL}/api/anilist/userinfo`,
//       clientId: process.env.CLIENT_ID,
//       clientSecret: process.env.CLIENT_SECRET,
//       profile(profile) {
//         return {
//           token: profile.token,
//           id: profile.sub,
//           name: profile?.name,
//           image: profile.image,
//           // lsist: profile?.list,
//         }
//       },
//     },
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: { label: "email", type: "text" },
//         password: { label: "password", type: "password" },
//       },
//       async authorize(credentials) {
//         const cred = await credentialsValidator.parseAsync(credentials)

//         if (!cred.email || !cred?.password) {
//           throw new Error("Invalid Credentials")
//         }

//         const user = await db.user.findUnique({
//           where: {
//             email: cred.email,
//           },
//         })

//         if (!user || !user?.password) throw new Error("Invalid Credentials")

//         const isPasswordCorrect = await bcrypt.compare(
//           cred.password,
//           user.password
//         )

//         if (!isPasswordCorrect) throw new Error("Invalid credentials")

//         return {
//           id: user.id,
//           image: user.image,
//           email: user.email,
//           name: user.userName,
//         }
//       },
//     }),
//   ],
//   debug: process.env.NODE_ENV !== "development",
//   secret: env.NEXTAUTH_SECRET,
//   session: {
//     //Sets the session to use JSON Web Token
//     strategy: "jwt",
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       return { ...token, ...user }
//     },
//     async session({ session, token, user }) {
//       //@ts-ignore
//       session.user = token
//       return session
//     },
//   },
// }
const auth = ''
