import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"

export async function GET(req: Request) {
  let cachedVal

  cachedVal = await redis.get("seasonal")

  if (cachedVal) {
    console.log("seasonal anime hit")

    return NextResponse.json(cachedVal)
  }

  const fields = [
    "id",
    "mappings",
    "coverImage",
    "title",
    "bannerImage",
    "currentEpisode",
  ]

  const response = await fetch(
    `https://api.anify.tv/seasonal/anime?fields=[id,%20mappings,%20title,%20coverImage,%20bannerImage,%20description,%20currentEpisode, %20totalEpisodes, %20format]`
  )

  if (!response.ok) throw new Error("Failed to fetch seasonal.")

  const seasonal = await response.json()

  if (seasonal) {
    console.log("seasonal miss")
    const stringifyResult = JSON.stringify(seasonal)
    await redis.setex("seasonal", 60 * 60 * 5, stringifyResult)
  }

  return NextResponse.json(seasonal)
}
