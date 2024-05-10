import { NextResponse } from "next/server"
import { animeApi } from "@/lib/consumet"
import { redis } from "@/lib/redis"

export async function GET(req: Request) {
  let cachedVal

  cachedVal = await redis.get("recents")

  if (cachedVal) {
    console.log("recents anime hit")

    return NextResponse.json(cachedVal)
  }

  const response = await fetch(`${animeApi}/meta/anilist/recent-episodes`)

  if (!response.ok) throw new Error("Failed to fetch recent episodes.")

  const recents = await response.json()
  // const recents = await gogo.fetchRecentEpisodes()

  const stringifyResult = JSON.stringify(recents)
  await redis.setex("recents", 60 * 60 * 3, stringifyResult)

  return NextResponse.json(recents)
}
