import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"
import { CACHE_MAX_AGE } from "@/lib/constant"
import { animeApi } from "@/config/site"

export async function GET(
  req: Request,
  { params }: { params: { animeId: string } }
) {
  const animeId = params.animeId

  if (!animeId)
    return NextResponse.json("Missing animeId for /anime/info", { status: 422 })

  const cachedResponse = await redis.get(`anime:${animeId}`)

  if (cachedResponse) {
    return NextResponse.json(cachedResponse)
  }

  let results

  try {
    const response = await fetch(`${animeApi}/meta/anilist/data/${animeId}`)

    if (!response.ok) throw new Error("Error")

    results = await response.json()
  } catch (error) {
    const response = await fetch(`${animeApi}/meta/anilist/info/${animeId}`)
    if (!response.ok) throw new Error("Error")

    results = await response.json()
  }

  const stringifyResult = JSON.stringify(results)
  await redis.setex(`anime:${animeId}`, CACHE_MAX_AGE, stringifyResult)

  return NextResponse.json(results)
}
