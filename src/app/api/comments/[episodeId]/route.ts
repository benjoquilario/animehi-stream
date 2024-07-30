import db from "@/lib/db"
import { auth } from "@/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: { episodeId: string } }
) {
  const episodeId = params.episodeId
  const searchParams = req.nextUrl.searchParams
  const limit = searchParams.get("limit")
  const skip = searchParams.get("cursor")
  const session = await auth()

  const comments = await db.comment.findMany({
    where: {
      episodeId: episodeId,
    },
    include: {
      user: {
        select: {
          id: true,
          userName: true,
          name: true,
          image: true,
          email: true,
        },
      },
      commentLike: {
        select: {
          id: true,
        },
        where: {
          userId: session?.user.id,
        },
      },
      commentDislike: {
        select: {
          id: true,
        },
        where: {
          userId: session?.user.id,
        },
      },
      _count: {
        select: {
          commentLike: true,
          commentDislike: true,
          replyComment: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: Number(limit) || 5,
    skip: Number(skip) || 0,
  })

  const nextId =
    comments.length < Number(limit) ? undefined : comments[Number(limit) - 1].id

  if (comments.length === 0) {
    return NextResponse.json({
      comments: [],
      hasNextPage: false,
      nextSkip: null,
    })
  }

  const transformedComments = comments.map((comment) => {
    const { _count, ...rest } = comment
    return {
      ...rest,
      _count,
      isLiked: session ? _count.commentLike > 0 : false,
      isDisliked: session ? _count.commentDislike > 0 : false,
    }
  })

  return NextResponse.json({
    comments: transformedComments,
    hasNextPage: comments.length < (Number(limit) || 5) ? false : true,
    nextSkip:
      comments.length < (Number(limit) || 5)
        ? null
        : Number(skip) + (Number(limit) as number),
  })
}
