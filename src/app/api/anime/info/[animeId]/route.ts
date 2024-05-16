import { NextResponse } from "next/server"
import { animeApi } from "@/lib/consumet"
import { redis } from "@/lib/redis"

export async function GET(
  req: Request,
  { params }: { params: { animeId: string } }
) {
  const animeId = params.animeId
  const splitId = animeId.split(",")

  let cachedVal

  if (!animeId)
    return NextResponse.json("Missing animeId for /anime/info", { status: 422 })

  cachedVal = await redis.get(`anime:${animeId}`)

  if (cachedVal) {
    console.log("anime info hits")
    return NextResponse.json(cachedVal)
  }

  const consumetResponse = await fetch(
    `${animeApi}/anime/gogoanime/info/${splitId[0]}`
  )
  const anifyResponse = await fetch(
    `https://api.anify.tv/info/${splitId[1]}?fields=[id,coverImage,bannerImage]`
  )

  const contentMetadata = await fetch(
    `https://api.anify.tv/content-metadata/${splitId[1]}`
  )

  const data = await contentMetadata.json()
  const consumetInfo = await consumetResponse.json()
  const anifyInfo = await anifyResponse.json()
  const content = data[0]

  if (!consumetResponse.ok && !anifyResponse.ok)
    throw new Error("Failed to fetch anime information")

  const transformedResponse = {
    ...consumetInfo,
    ...anifyInfo,
    contentMetadata: content ?? [],
  }

  const stringifyResult = JSON.stringify(transformedResponse)
  await redis.setex(`anime:${animeId}`, 60 * 60 * 3, stringifyResult)

  return NextResponse.json(transformedResponse)
}
