import db from "@/lib/db"
import { auth } from "@/lib/metrics"
import { getSession } from "@/lib/session"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const session = await getSession()

  const watching = await db.watchlist.findMany({
    where: {
      userId: session?.user.id,
    },
    orderBy: {
      updatedAt: "asc",
    },
  })

  return Response.json(watching)
}

export async function POST(req: Request) {
  const body = await req.json()

  const { id } = body

  await db.watchlist.delete({
    where: {
      id: id,
    },
  })

  return NextResponse.json("Success")
}
