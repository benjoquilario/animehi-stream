import { NextRequest, NextResponse } from "next/server"
import { animeApi } from "@/config/site"
import { redis } from "@/lib/redis"
import { CACHE_MAX_AGE } from "@/lib/constant"

export async function GET(
  req: NextRequest,
  { params }: { params: { animeId: string } }
) {
  const animeId = params.animeId
  const searchParams = req.nextUrl.searchParams
  const provider = searchParams.get("provider")
  const dub = searchParams.get("dub")

  if (!animeId)
    return NextResponse.json("Missing animeId for /anime/info", { status: 422 })
  const cachedResponse = await redis.get(`episodes:${animeId}`)

  if (cachedResponse) {
    return NextResponse.json(cachedResponse)
  }

  const url = `${animeApi}/meta/anilist/episodes/${animeId}?provider=${provider}&dub=${dub}`
  const response = await fetch(url)

  if (!response.ok) throw new Error("Failed to fetch")

  const episodes = await response.json()

  const stringifyResult = JSON.stringify(episodes)
  await redis.setex(`episodes:${animeId}`, 60 * 60 * 84 + 84, stringifyResult)

  return NextResponse.json(episodes)
}
