import { NextResponse } from "next/server"
import { url } from "@/lib/consumet"
import { kv } from "@vercel/kv"
import { Ratelimit } from "@upstash/ratelimit"
import { headers } from "next/headers"

export async function GET(req: Request) {
  let cachedVal
  if (kv) {
    const ipAddress = headers().get("x-forwarded-for")
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.fixedWindow(50, "30 s"),
    })
    const { success } = await ratelimit.limit(ipAddress ?? "anonymous")

    if (!success) {
      return "You have reached your request limit please try again."
    }

    cachedVal = await kv.get("recents")
  }

  if (cachedVal) {
    console.log("recents anime hit")

    return NextResponse.json(cachedVal)
  }

  const response = await fetch(`${url}/recent-episodes`)

  if (!response.ok) throw new Error("Failed to fetch recent episodes.")

  const recents = await response.json()

  if (recents) {
    const stringifyResult = JSON.stringify(recents)
    await kv.setex("recents", 60 * 60 * 2, stringifyResult)
  }

  return NextResponse.json(recents)
}
