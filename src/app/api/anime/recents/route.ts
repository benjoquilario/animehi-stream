import { NextRequest, NextResponse } from "next/server"
import { redis } from "@/lib/redis"
import { env } from "@/env.mjs"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const page = searchParams.get("page")

  const cachedResponse = await redis.get(`recent-episodes`)

  if (cachedResponse) {
    return NextResponse.json(cachedResponse)
  }

  const url = `${env.NEXT_PUBLIC_ANIME_API_URL}/meta/anilist/recent-episodes?page=${page}&perPage=20`
  const response = await fetch(url)

  if (!response.ok) throw new Error("Failed to fetch")

  const episodes = await response.json()

  const stringifyResult = JSON.stringify(episodes)
  await redis.setex(`recent-episodes`, 60 * 60 * 4, stringifyResult)

  return NextResponse.json(episodes)
}
