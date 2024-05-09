import db from "@/lib/db"
import { NextResponse } from "next/server"

export async function PUT(req: Request) {
  const body = await req.json()

  const data = await db.viewCounter.findFirst({
    where: {
      animeId: body,
    },
  })

  if (!data) return

  const view = data.view

  await db.viewCounter.update({
    where: {
      id: data.id,
      animeId: body,
    },
    data: {
      view: view + 1,
    },
  })

  return NextResponse.json("View + 1")
}

export async function POST(req: Request) {
  const body = await req.json()

  const { image, title, animeId, anilistId } = body

  try {
    const isAnimeIdExist = await db.viewCounter.findFirst({
      where: {
        animeId: animeId,
      },
    })

    if (!isAnimeIdExist) throw new Error("Anime Exist")

    const createMostView = await db.viewCounter.create({
      data: {
        image,
        title,
        animeId,
        view: 1,
        anilistId,
      },
    })

    return NextResponse.json(createMostView)
  } catch (error) {
    console.log("Error", error)
  }

  return NextResponse.json("View + 1")
}
