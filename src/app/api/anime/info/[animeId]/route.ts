import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"
import { CACHE_MAX_AGE } from "@/lib/constant"

export async function GET(
  req: Request,
  { params }: { params: { animeId: string } }
) {
  const animeId = params.animeId

  if (!animeId)
    return NextResponse.json("Missing animeId for /anime/info", { status: 422 })

  const url = `https://consumet-api-production-2bba.up.railway.app/meta/anilist/data/${animeId}`

  const cachedResponse = await redis.get(`anime:${animeId}`)

  if (cachedResponse) {
    return NextResponse.json(cachedResponse)
  }

  const response = await fetch(url)

  const info = await response.json()

  const stringifyResult = JSON.stringify(info)
  await redis.setex(`anime:${animeId}`, CACHE_MAX_AGE, stringifyResult)

  return NextResponse.json(info)
}
