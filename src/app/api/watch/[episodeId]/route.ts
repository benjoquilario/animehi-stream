import { url } from "@/lib/consumet"
import { redis, rateLimiterRedis } from "@/lib/redis"
import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { kv } from "@vercel/kv"
import { Ratelimit } from "@upstash/ratelimit"
import { ANIME } from "@consumet/extensions"

export async function GET(
  req: Request,
  { params }: { params: { episodeId: string } }
) {
  const gogo = new ANIME.Gogoanime()
  const episodeId = params.episodeId

  if (redis) {
    try {
      const ipAddress = headers().get("x-forwarded-for")
      await rateLimiterRedis.consume(ipAddress)
    } catch (error) {
      return NextResponse.json(`Too Many Requests, retry after`, {
        status: 429,
      })
    }
  }

  const watch = await gogo.fetchEpisodeSources(episodeId)

  // const watchReferer = watch.headers.Referer

  return NextResponse.json(watch)
}
