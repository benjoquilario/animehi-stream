import { NextRequest, NextResponse } from "next/server"
import { animeApi } from "@/config/site"
import { redis } from "@/lib/redis"
import { CACHE_MAX_AGE } from "@/lib/constant"
import { META } from "@consumet/extensions"

export async function GET(
  req: NextRequest,
  { params }: { params: { animeId: string } }
) {
  const animeId = params.animeId
  const searchParams = req.nextUrl.searchParams
  const provider = searchParams.get("provider")
  const dub = searchParams.get("dub")
  // const anilist = new META.Anilist()

  console.log("")

  return NextResponse.json("")
}
