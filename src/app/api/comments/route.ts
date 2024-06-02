import { headers } from "next/headers"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { getSession } from "@/lib/session"
import db from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()

  const ip = headers().get("x-forwarded-for")

  const { commentText, animeId, episodeNumber, anilistId } = body

  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.fixedWindow(5, "60s"),
  })

  const { success, reset } = await ratelimit.limit(
    (ip ?? "anonymous") + "-addComment"
  )

  if (!success) {
    console.log(
      `ratelimit hit for addComment , reset in ${new Date(reset).toUTCString()}`
    )
    return
  }

  const session = await getSession()

  if (!session) throw new Error("Not authenticated!")

  const newComments = await db.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      comments: {
        create: [
          {
            animeId,
            episodeId: `${animeId}-episode-${episodeNumber}`,
            comment: commentText,
            episodeNumber,
            anilistId,
          },
        ],
      },
    },
  })

  return NextResponse.json({
    message: "Comment create",
    success: true,
    comments: newComments,
  })
}
