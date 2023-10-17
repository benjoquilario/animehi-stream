import { NextResponse } from "next/server"
import { url } from "@/lib/consumet"
import { redis, rateLimiterRedis } from "@/lib/redis"
import { headers } from "next/headers"
import { ANIME } from "@consumet/extensions"

export async function GET(
  req: Request,
  { params }: { params: { animeId: string } }
) {
  const gogo = new ANIME.Gogoanime()
  const animeId = params.animeId
  let cachedVal

  if (!animeId)
    return NextResponse.json("Missing animeId for /anime/info", { status: 422 })

  if (redis) {
    try {
      const ipAddress = headers().get("x-forwarded-for")
      await rateLimiterRedis.consume(ipAddress)
    } catch (error) {
      return NextResponse.json(`Too Many Requests, retry after`, {
        status: 429,
      })
    }
    cachedVal = await redis.get(animeId)
  }

  cachedVal = await redis.get(animeId)

  if (cachedVal) {
    return new Response(cachedVal)
  }

  // const response = await fetch(`${url}/info/${animeId}`)

  // if (!response.ok) throw new Error("Failed to fetch anime information")

  const anime = await gogo.fetchAnimeInfo(animeId)

  if (anime) {
    const stringifyResult = JSON.stringify(anime)
    await redis.setex(animeId, 60 * 60 * 3, stringifyResult)
  }

  return NextResponse.json(anime)
}
