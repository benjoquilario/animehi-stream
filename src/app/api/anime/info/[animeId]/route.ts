import { NextResponse } from "next/server"
import { url } from "@/lib/consumet"
import { headers } from "next/headers"
import { kv } from "@vercel/kv"
import { Ratelimit } from "@upstash/ratelimit"

export async function GET(
  req: Request,
  { params }: { params: { animeId: string } }
) {
  const animeId = params.animeId
  let cachedVal

  if (!animeId)
    return NextResponse.json("Missing animeId for /anime/info", { status: 422 })

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

    cachedVal = await kv.get(animeId)
  }

  if (cachedVal) {
    return NextResponse.json(cachedVal)
  }

  const response = await fetch(`${url}/info/${animeId}`)

  if (!response.ok) throw new Error("Failed to fetch anime information")

  const anime = await response.json()

  if (anime) {
    const stringifyResult = JSON.stringify(anime)
    await kv.setex(animeId, 60 * 60 * 2, stringifyResult)
  }

  return NextResponse.json(anime)
}
