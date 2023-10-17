import { getCurrentUser } from "@/lib/current-user"
import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function POST(req: Request) {
  const body = await req.json()
  const currentUser = await getCurrentUser()

  const { image, animeId, title } = body

  if (!currentUser) return NextResponse.json("Unauthenticated", { status: 401 })

  const isAnimeExist = await db.bookmark.findFirst({
    where: {
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
      userId: currentUser.id,
    },
  })

  return NextResponse.json(bookMark)
}
