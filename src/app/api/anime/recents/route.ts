import { NextResponse } from "next/server"
import { url } from "@/lib/consumet"
import { kv } from "@vercel/kv"
import { Ratelimit } from "@upstash/ratelimit"

import { redis, rateLimiterRedis } from "@/lib/redis"
import { headers } from "next/headers"

export async function GET(req: Request) {
  let cachedVal

  // const ipAddress = headers().get("x-forwarded-for")
  // const ratelimit = new Ratelimit({
  //   redis: kv,
  //   limiter: Ratelimit.slidingWindow(20, "20 s"),
  // })

  // const { success } = await ratelimit.limit(ipAddress ?? "anonymous")

  if (redis) {
    try {
      const ipAddress = headers().get("x-forwarded-for")
      await rateLimiterRedis.consume(ipAddress)
    } catch (error) {
      return NextResponse.json(`Too Many Requests, retry after`, {
        status: 429,
      })
    }
    cachedVal = await redis.get("recents")
  }

  if (cachedVal) {
    console.log("recents anime hit")

    return new Response(cachedVal)
  }

  const response = await fetch(`${url}/recent-episodes`)

  if (!response.ok) throw new Error("Failed to fetch recent episodes.")

  const recents = await response.json()

  if (recents) {
    const stringifyResult = JSON.stringify(recents)
    await redis.setex("recents", 60 * 60 * 3, stringifyResult)
  }

  return NextResponse.json(recents)
}
