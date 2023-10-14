import { NextResponse } from "next/server"
import { url } from "@/lib/consumet"
import { redis, rateLimiterRedis } from "@/lib/redis"
import { headers } from "next/headers"
// import { Ratelimit } from "@upstash/ratelimit"
// import { kv } from "@vercel/kv"

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
    cachedVal = await redis.get("trendings")
  }

  // cachedVal = await redis.get("trendings")

  if (cachedVal) {
    console.log("recents anime hit")

    return new Response(cachedVal)
  }

  const response = await fetch(`${url}/top-airing`)

  if (!response.ok) throw new Error("Failed to fetch recent episodes.")

  const trendings = await response.json()

  if (trendings) {
    console.log("trendings miss")
    const stringifyResult = JSON.stringify(trendings)
    await redis.setex("trendings", 60 * 60 * 3, stringifyResult)
  }

  return NextResponse.json(trendings)
}
