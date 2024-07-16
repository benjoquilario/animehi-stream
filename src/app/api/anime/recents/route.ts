import { NextRequest, NextResponse } from "next/server"
import { redis } from "@/lib/redis"
import { env } from "@/env.mjs"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const page = searchParams.get("page")

  const url = `${env.ANIME_API_URI_V2}/recent-eps?type=anime&page=${page}&perPage=20`
  const response = await fetch(url, { cache: "no-cache" })

  if (!response.ok) throw new Error("Failed to fetch")

  const episodes = await response.json()

  return NextResponse.json(episodes)
}
