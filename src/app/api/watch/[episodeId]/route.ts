import { url } from "@/lib/consumet"
import { redis, rateLimiterRedis } from "@/lib/redis"
import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { kv } from "@vercel/kv"
import { Ratelimit } from "@upstash/ratelimit"

export async function GET(
  req: Request,
  { params }: { params: { episodeId: string } }
) {
  const episodeId = params.episodeId

  const ipAddress = headers().get("x-forwarded-for")
  const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(20, "20 s"),
  })
  const { success } = await ratelimit.limit(ipAddress ?? "anonymous")

  if (success) {
    const response = await fetch(`${url}/watch/${episodeId}`)

    if (!response.ok) throw new Error("Failed to fetch anime informations")
    const watch = await response.json()

    // const watchReferer = watch.headers.Referer

    return NextResponse.json(watch)
  }
}
