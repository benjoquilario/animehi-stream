import { NextResponse } from "next/server"
import { animeApi } from "@/config/site"
import { cacheRedis } from "@/lib/metrics"
import { redis } from "@/lib/redis"
import { CACHE_MAX_AGE } from "@/lib/constant"

export async function GET(
  req: Request,
  { params }: { params: { animeId: string } }
) {
  const animeId = params.animeId

  if (!animeId)
    return NextResponse.json("Missing animeId for /anime/info", { status: 422 })
  const cachedResponse = await redis.get(`episodes:${animeId}`)

  if (cachedResponse) {
    return NextResponse.json(cachedResponse)
  }

  const url = `${animeApi}/meta/anilist/episodes/${animeId}?provider=gogoanime&dub=false`
  const response = await fetch(url)

  if (!response.ok) throw new Error("Failed to fetch")

  const episodes = await response.json()

  const stringifyResult = JSON.stringify(episodes)
  await redis.setex(`episodes:${animeId}`, CACHE_MAX_AGE, stringifyResult)

  return NextResponse.json(episodes)
}
