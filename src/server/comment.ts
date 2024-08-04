"use server"
import db from "@/lib/db"
import { auth } from "@/auth"
import { headers } from "next/headers"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import type { AddComment } from "types/types"

export async function deleteComment(id: string) {
  const session = await auth()

  if (!session) return

  const deletedComment = await db.comment.delete({
    where: {
      id,
    },
    include: {
      commentLike: {
        where: {
          commentId: id,
        },
      },
      commentDislike: {
        where: {
          commentId: id,
        },
      },
    },
  })

  return {
    data: deletedComment,
    message: "Comment Deleted",
    ok: true,
  }
}

export async function editComment({
  id,
  commentText,
}: {
  id: string
  commentText: string
}) {
  const session = await auth()

  if (!session) return

  const updatedComment = await db.comment.update({
    where: {
      id,
    },
    data: {
      comment: commentText,
      isEdited: true,
      updatedAt: new Date(),
    },
  })

  return {
    data: updatedComment,
    message: "Comment Updated",
    ok: true,
  }
}

export async function likeComment({ commentId }: { commentId: string }) {
  const session = await auth()
  const userId = session?.user.id

  if (!session) return

  const isLiked = await db.commentLike.count({
    where: {
      userId: userId,
      commentId,
    },
  })

  if (isLiked)
    return {
      ok: false,
      status: 409,
    }

  await db.commentLike.create({
    data: {
      userId: userId!,
      commentId: commentId,
    },
    select: {
      userId: true,
    },
  })

  return
}

export async function unlikeComment({ commentId }: { commentId: string }) {
  const session = await auth()
  const userId = session?.user.id

  if (!session) return

  const isLiked = await db.commentLike.count({
    where: {
      userId: userId,
      commentId,
    },
  })

  const commentExist = await db.commentLike.findFirst({
    where: {
      userId,
      commentId,
    },
  })

  if (!isLiked && !commentExist)
    return {
      ok: false,
      status: 409,
    }

  await db.commentLike.delete({
    where: {
      id: commentExist?.id,
    },
  })

  return
}

export async function dislikeComment({ commentId }: { commentId: string }) {
  const session = await auth()
  const userId = session?.user.id

  if (!session) return

  const isLiked = await db.commentDislike.count({
    where: {
      userId: userId,
      commentId,
    },
  })

  if (isLiked)
    return {
      ok: false,
      status: 409,
    }

  await db.commentDislike.create({
    data: {
      userId: userId!,
      commentId: commentId,
    },
    select: {
      userId: true,
    },
  })

  return
}

export async function unDislikeComment({ commentId }: { commentId: string }) {
  const session = await auth()
  const userId = session?.user.id

  if (!session) return

  const isLiked = await db.commentDislike.count({
    where: {
      userId: userId,
      commentId,
    },
  })

  const commentExist = await db.commentDislike.findFirst({
    where: {
      userId,
      commentId,
    },
  })

  if (!isLiked && !commentExist)
    return {
      ok: false,
      status: 409,
    }

  await db.commentDislike.delete({
    where: {
      id: commentExist?.id,
    },
  })

  return
}

export async function addComment(comment: AddComment) {
  const ip = headers().get("x-forwarded-for")

  const { commentText, animeId, episodeNumber, anilistId, animeTitle } = comment

  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "60s"),
  })

  const { success, reset } = await ratelimit.limit(`${ip}`)

  if (!success) {
    console.log(`ratelimit hit for addComment , reset in `)
    const retryArferSeconds = Math.ceil((reset - Date.now()) / 100)
    return {
      ok: false,
      message: `You reached the limit, reset in ${retryArferSeconds}`,
    }
  }

  const session = await auth()

  if (!session) throw new Error("Not authenticated!")

  const createdComment = await db.comment.create({
    data: {
      animeId,
      episodeId: `${anilistId}-episode-${episodeNumber}`,
      comment: commentText,
      episodeNumber,
      anilistId,
      userId: session.user.id,
      title: animeTitle,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          userName: true,
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
        },
      },
    },
  })

  return {
    data: createdComment,
    message: "Comment Created",
    ok: true,
  }
}
