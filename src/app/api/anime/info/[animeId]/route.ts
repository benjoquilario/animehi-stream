import { NextResponse } from "next/server"
import { animeApi } from "@/lib/consumet"
import { redis } from "@/lib/redis"

export async function GET(
  req: Request,
  { params }: { params: { animeId: string } }
) {
  const animeId = params.animeId

  let cachedVal

  if (!animeId)
    return NextResponse.json("Missing animeId for /anime/info", { status: 422 })

  cachedVal = await redis.get(`anime:${animeId}`)

  if (cachedVal) {
    console.log("anime info hits")
    return NextResponse.json(cachedVal)
  }

  const consumetResponse = await fetch(
    `${animeApi}/anime/gogoanime/info/${animeId}`
  )

  const consumetInfo = await consumetResponse.json()

  if (!consumetResponse.ok) throw new Error("Failed to fetch anime information")

  const stringifyResult = JSON.stringify(consumetInfo)
  await redis.setex(`anime:${animeId}`, 60 * 60 * 3, stringifyResult)

  return NextResponse.json(consumetInfo)
}
