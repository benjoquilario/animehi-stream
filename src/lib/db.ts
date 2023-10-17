import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"

declare global {
  var prisma: PrismaClient | undefined
}

const client =
  globalThis.prisma?.$extends(withAccelerate()) ||
  new PrismaClient().$extends(withAccelerate())
if (process.env.NODE_ENV !== "production")
  globalThis.prisma?.$extends(withAccelerate())
export default client
