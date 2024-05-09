import { NextResponse } from "next/server"
import { animeApi } from "@/lib/consumet"
import { redis } from "@/lib/redis"

export async function GET(
  req: Request,
  { params }: { params: { animeId: string } }
) {
  const animeId = params.animeId
  let cachedVal

  if (!animeId)
    return NextResponse.json("Missing animeId for /anime/info", { status: 422 })

  cachedVal = await redis.get(animeId)

  if (cachedVal) {
    console.log("anime info hits")
    return NextResponse.json(cachedVal)
  }

  const response = await fetch(`${animeApi}/anime/gogoanime/info/${animeId}`)

  if (!response.ok) throw new Error("Failed to fetch anime information")

  const anime = await response.json()

  const stringifyResult = JSON.stringify(anime)
  await redis.setex(animeId, 60 * 60 * 3, stringifyResult)

  return NextResponse.json(anime)
}
