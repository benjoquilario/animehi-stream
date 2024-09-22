"use server"
import db from "@/lib/db"
import { auth } from "@/auth"

export const likeReplyComment = async ({ replyId }: { replyId: string }) => {
  const session = await auth()
  const userId = session?.user.id

  console.log(session)

  if (!session) return

  const isLiked = await db.likeReplyComment.count({
    where: {
      userId,
      replyId,
    },
  })

  if (isLiked) {
    return {
      ok: false,
      status: 409,
    }
  }

  await db.likeReplyComment.create({
    data: {
      userId: userId!,
      replyId,
    },
    select: {
      userId: true,
      reply: {
        select: {
          userId: true,
        },
      },
    },
  })

  return
}

export const unlikeReplyComment = async ({ replyId }: { replyId: string }) => {
  const session = await auth()
  const userId = session?.user.id

  if (!session) return

  console.log(session)

  const isLiked = await db.likeReplyComment.count({
    where: {
      userId,
      replyId,
    },
  })

  const likeExist = await db.likeReplyComment.findFirst({
    where: {
      userId,
      replyId,
    },
  })

  if (!isLiked && !likeExist) {
    return {
      ok: false,
      status: 409,
    }
  }

  await db.likeReplyComment.delete({
    where: {
      id: likeExist?.id,
    },
  })

  return
}
