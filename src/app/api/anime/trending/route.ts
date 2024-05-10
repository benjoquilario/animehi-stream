import { NextResponse } from "next/server"
import { animeApi } from "@/lib/consumet"
import { redis } from "@/lib/redis"
import { headers } from "next/headers"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
// import { kv } from "@vercel/kv"

export async function GET(req: Request) {
  let cachedVal

  cachedVal = await redis.get("trendings")

  if (cachedVal) {
    console.log("trending anime hit")

    return NextResponse.json(cachedVal)
  }

  const response = await fetch(`${animeApi}/anime/gogoanime/top-airing`)

  if (!response.ok) throw new Error("Failed to fetch recent episodes.")

  const trendings = await response.json()

  const stringifyResult = JSON.stringify(trendings)
  await redis.setex("trendings", 60 * 60 * 3, stringifyResult)

  return NextResponse.json(trendings)
}
