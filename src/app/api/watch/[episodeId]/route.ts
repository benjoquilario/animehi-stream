import { url } from "@/lib/consumet"
import { redis, rateLimiterRedis } from "@/lib/redis"
import { NextResponse } from "next/server"
import { headers } from "next/headers"

export async function GET(
  req: Request,
  { params }: { params: { episodeId: string } }
) {
  const headersList = headers()
  const referer = headersList.get("referer")
  const episodeId = params.episodeId

  let cachedVal

  if (redis) {
    try {
      const ipAddress = headers().get("x-forwarded-for")
      await rateLimiterRedis.consume(ipAddress)
    } catch (error) {
      return NextResponse.json(
        {
          error: `Too Many Requests, retry after`,
        },
        { status: 429 }
      )
    }
    cachedVal = await redis.get(episodeId)
  }

  if (cachedVal) {
    console.log("Watch Cached Hit")
    return new Response(cachedVal)
  }

  const response = await fetch(`${url}/watch/${episodeId}`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  })

  if (!response.ok) throw new Error("Failed to fetch anime informations")
  const watch = await response.json()

  const watchReferer = watch.headers.Referer

  const stringifyResult = JSON.stringify(watch)

  await redis.setex(episodeId, 3600, stringifyResult)

  return NextResponse.json(watch)
}
