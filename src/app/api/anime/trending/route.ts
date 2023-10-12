import { NextResponse } from "next/server"
import { url } from "@/lib/consumet"
import { redis, rateLimiterRedis } from "@/lib/redis"
import { headers } from "next/headers"
import { Ratelimit } from "@upstash/ratelimit"
import { kv } from "@vercel/kv"

export async function GET(req: Request) {
  const ipAddress = headers().get("x-forwarded-for")
  const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.fixedWindow(50, "30 s"),
  })
  const { success } = await ratelimit.limit(ipAddress ?? "anonymous")

  if (!success) {
    return "You have reached your request limit please try again."
  }

  const response = await fetch(`${url}/top-airing`, {
    next: { revalidate: 60 },
  })

  if (!response.ok) throw new Error("Failed to fetch recent episodes.")

  const trendings = await response.json()
  return NextResponse.json(trendings)
}
