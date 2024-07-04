import db from "@/lib/db"
import { auth } from "@/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const commentId = params.commentId

  const searchParams = req.nextUrl.searchParams
  const limit = searchParams.get("limit")
  const skip = searchParams.get("cursor")
  const session = await auth()

  const comments = await db.replyComment.findMany({
    where: {
      commentId,
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
      replyLike: {
        select: {
          id: true,
        },
        where: {
          userId: session?.user.id,
        },
      },
      _count: {
        select: {
          replyLike: true,
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
      replies: [],
      hasNextPage: false,
      nextSkip: null,
    })
  }

  const transformedReplies = comments.map((post) => {
    const { _count, replyLike, ...rest } = post
    return {
      ...rest,
      _count,
      replyLike,
      isLiked: session ? replyLike.length > 0 : false,
    }
  })

  return NextResponse.json({
    replies: transformedReplies,
    hasNextPage: comments.length < (Number(limit) || 5) ? false : true,
    nextSkip:
      comments.length < (Number(limit) || 5)
        ? null
        : Number(skip) + (Number(limit) as number),
  })
}
