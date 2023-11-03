import db from "@/lib/db"
import { type NextRequest } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: { episodeId: string } }
) {
  const episodeId = params.episodeId
  const searchParams = req.nextUrl.searchParams
  const limit = searchParams.get("limit")
  const skip = searchParams.get("cursor")

  const comments = await db.comment.findMany({
    where: {
      episodeId,
    },
    include: {
      user: {
        select: {
          id: true,
          userName: true,
          image: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: Number(limit) || 5,
    skip: Number(skip) || 0,
  })

  const nextId =
    comments.length < Number(limit) ? undefined : comments[Number(limit) - 1].id

  return Response.json({
    comments,
    hasNextPage: comments.length < (Number(limit) || 5) ? false : true,
    nextSkip:
      comments.length < (Number(limit) || 5)
        ? null
        : Number(skip) + (Number(limit) as number),
  })
}
