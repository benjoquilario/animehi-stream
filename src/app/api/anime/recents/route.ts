import { NextResponse } from "next/server"
import { url } from "@/lib/consumet"
import { redis, rateLimiterRedis } from "@/lib/redis"
import { headers } from "next/headers"

export async function GET(req: Request) {
  // let cachedVal

  // if (redis) {
  //   try {
  //     const ipAddress = headers().get("x-forwarded-for")
  //     await rateLimiterRedis.consume(ipAddress)
  //   } catch (error) {
  //     return NextResponse.json(
  //       {
  //         error: `Too Many Requests, retry after`,
  //       },
  //       { status: 429 }
  //     )
  //   }
  //   cachedVal = await redis.get("recents")
  // }

  // if (cachedVal) {
  //   console.log("ANIME RECENTS HIT")
  //   return new Response(cachedVal)
  // }

  const response = await fetch(`${url}/recent-episodes`, {
    next: { revalidate: 60 },
  })

  if (!response.ok) throw new Error("Failed to fetch recent episodes.")

  const recents = await response.json()

  // const stringifyResult = JSON.stringify(recents)
  // await redis.setex("recents", 3600, stringifyResult)
  return NextResponse.json(recents)
}
