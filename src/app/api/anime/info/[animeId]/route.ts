import { NextResponse } from "next/server"
import { animeInfo, url } from "@/lib/consumet"
import { redis, rateLimiterRedis } from "@/lib/redis"
import { headers } from "next/headers"

export async function GET(
  req: Request,
  { params }: { params: { animeId: string } }
) {
  const animeId = params.animeId
  let cachedVal

  if (!animeId)
    return NextResponse.json("Missing animeId for /anime/info", { status: 422 })

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
    cachedVal = await redis.get(animeId)
  }

  if (cachedVal) {
    console.log("ANIME CACHE HIT")

    return new Response(cachedVal)
  }

  const response = await fetch(`${url}/info/${animeId}`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  })

  if (!response.ok) throw new Error("Failed to fetch anime information")

  const anime = await response.json()

  if (anime) {
    const stringifyResult = JSON.stringify(anime)
    await redis.setex(animeId, 3600, stringifyResult)
  }

  return NextResponse.json(anime)
}
