import { NextResponse } from "next/server"
import { animeApi, recent } from "@/lib/consumet"
import { redis } from "@/lib/redis"
// import { META } from "@consumet/extensions"

export async function GET(req: Request) {
  // const anilist = new META.Anilist()

  let cachedVal

  cachedVal = await redis.get("recents")

  if (cachedVal) {
    console.log("recents anime hit")

    return NextResponse.json(cachedVal)
  }

  const response = await fetch(`${animeApi}/meta/anilist/recent-episodes`)

  // console.log(response)

  if (!response.ok) throw new Error("Failed to fetch recent episodes.")

  const recents = await response.json()
  // const recents = await anilist.fetchRecentEpisodes()

  if (recents) {
    console.log("recents miss")
    const stringifyResult = JSON.stringify(recents)
    await redis.setex("recents", 60 * 60 * 3, stringifyResult)
  }

  return NextResponse.json(recents)
}
