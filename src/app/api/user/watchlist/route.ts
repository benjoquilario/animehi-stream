import db from "@/lib/db"
import { NextResponse } from "next/server"

export async function PUT(req: Request) {
  const body = await req.json()

  const { episodeId, episodeNumber, id, image, animeId } = body

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
    },
  })

  return NextResponse.json(user)
}
