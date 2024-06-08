import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"
import { CACHE_MAX_AGE } from "@/lib/constant"
import { env } from "@/env.mjs"

export async function GET(
  req: Request,
  { params }: { params: { animeId: string } }
) {
  const animeId = params.animeId

  if (!animeId)
    return NextResponse.json("Missing animeId for /anime/info", { status: 422 })

  // const cachedResponse = await get(redis, )

  const cachedResponse = await redis.get(`anime:${animeId}`)

  if (cachedResponse) {
    return NextResponse.json(cachedResponse)
  }

  let results

  try {
    const response = await fetch(
      `${env.ANIME_API_URI}/meta/anilist/data/${animeId}`
    )

    if (!response.ok) throw new Error("Error")

    results = await response.json()
  } catch (error) {
    const response = await fetch(
      `${env.ANIME_API_URI}/meta/anilist/info/${animeId}`
    )
    if (!response.ok) throw new Error("Error")

    results = await response.json()
  }

  const stringifyResult = JSON.stringify(results)
  await redis.setex(`anime:${animeId}`, 60 * 60 * 84 + 84, stringifyResult)

  return NextResponse.json(results)
}
