import { NextResponse } from "next/server"
import { url } from "@/lib/consumet"
import { kv } from "@vercel/kv"
import { Ratelimit } from "@upstash/ratelimit"
import { headers } from "next/headers"

export async function GET(req: Request) {
  let cachedVal

  const ipAddress = headers().get("x-forwarded-for")
  const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(20, "20 s"),
  })

  const { success } = await ratelimit.limit(ipAddress ?? "anonymous")

  if (success) {
    cachedVal = await kv.get("recents")

    if (cachedVal) {
      console.log("recents anime hit")

      return NextResponse.json(cachedVal)
    }

    const response = await fetch(`${url}/recent-episodes`)

    if (!response.ok) throw new Error("Failed to fetch recent episodes.")

    const recents = await response.json()

    if (recents) {
      const stringifyResult = JSON.stringify(recents)
      await kv.setex("recents", 60 * 60 * 3, stringifyResult)
    }

    return NextResponse.json(recents)
  }
}
