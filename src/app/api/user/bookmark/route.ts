import { getCurrentUser } from "@/lib/current-user"
import { NextResponse } from "next/server"
import db from "@/lib/db"
import { getSession } from "next-auth/react"

export async function POST(req: Request) {
  const body = await req.json()
  const session = await getSession()

  const { image, animeId, title, anilistId } = body

  if (!session) return NextResponse.json("Unauthenticated", { status: 401 })

  const isAnimeExist = await db.bookmark.findFirstOrThrow({
    where: {
      userId: session.user.id,
      animeId,
    },
  })

  if (isAnimeExist)
    return NextResponse.json("Anime Bookmarked", { status: 200 })

  const bookMark = await db.bookmark.create({
    data: {
      animeId,
      image,
      title,
      userId: session.user.id,
      anilistId,
    },
  })

  return NextResponse.json(bookMark)
}
