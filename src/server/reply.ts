"use server"

import { auth } from "@/auth"
import db from "@/lib/db"

export async function createReplyComment(replies: {
  content: string
  commentId: string
}) {
  const { content, commentId } = replies

  const session = await auth()

  if (!session) throw new Error("Not authenticated!")

  const createdReply = await db.replyComment.create({
    data: {
      content,
      commentId,
      userId: session.user.id,
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
  })

  return {
    data: createdReply,
    message: "Comment Created",
    ok: true,
  }
}

export async function updateReplyComment({
  content,
  replyId,
}: {
  content: string
  replyId: string
}) {
  const session = await auth()

  if (!session) return

  const updatedReplyComment = await db.replyComment.update({
    where: {
      id: replyId,
    },
    data: {
      content,
      isEdited: true,
    },
  })

  return {
    ok: true,
    data: updatedReplyComment,
    message: "Comment Updated",
  }
}

export const deleteReplyComment = async ({ replyId }: { replyId: string }) => {
  const session = await auth()

  if (!session)
    return {
      ok: false,
      message: "Unathenticated",
    }

  const replyComment = await db.replyComment.findUnique({
    where: {
      id: replyId,
    },
  })

  if (replyComment) {
    await db.replyComment.delete({
      where: {
        id: replyComment.id,
      },
    })
  }
}
