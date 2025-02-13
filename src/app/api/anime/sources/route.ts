import { NextRequest, NextResponse } from "next/server"
import { animeApi } from "@/config/site"
import { redis } from "@/lib/redis"
import { CACHE_MAX_AGE } from "@/lib/constant"
import { META, ANIME } from "@consumet/extensions"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const provider = searchParams.get("provider") || "gogoanime"
  const episodeId = searchParams.get("episodeId") || ""
  const dub = searchParams.get("dub") || false
  const gogoanime = new ANIME.Gogoanime()

  try {
    if (provider === "zoro") {
      const epId = episodeId
        .replace("$episode$", "?ep=")
        .replace(/\$auto|\$dub/gi, "")

      const res = await fetch(
        `https://aniwatch-indol.vercel.app/api/v2/hianime/episode/sources?animeEpisodeId=${epId}&category=${dub ? "dub" : "sub"}`
      )

      const data = await res.json()

      return NextResponse.json(data)
    }

    if (provider === "gogoanime") {
      const data = await gogoanime.fetchEpisodeSources(episodeId)

      return NextResponse.json(data)
    }
  } catch (error) {
    return NextResponse.json("Something went Wrong", { status: 500 })
  }
}
