import db from "@/lib/db"
import { NextResponse } from "next/server"

export async function PUT(req: Request) {
  const body = await req.json()

  const { episodeId, episodeNumber, id, image, animeId, anilistId } = body

  if (!episodeId)
    return NextResponse.json("Episode is already there", { status: 200 })

  const user = await db.watchlist.updateMany({
    where: {
      episodeId,
      id,
    },
    data: {
      episodeId,
      episodeNumber,
      image,
      animeId,
      anilistId,
    },
  })

  return NextResponse.json(user)
}
