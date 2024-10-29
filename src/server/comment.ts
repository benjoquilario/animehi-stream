"use server"
import db from "@/lib/db"
import { auth } from "@/auth"
import { headers } from "next/headers"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import type { AddComment } from "types/types"

export const deleteComment = async (id: string) => {
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

export const editComment = async ({
  id,
  commentText,
}: {
  id: string
  commentText: string
}) => {
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

export const likeComment = async ({ commentId }: { commentId: string }) => {
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

export const unlikeComment = async ({ commentId }: { commentId: string }) => {
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

export const dislikeComment = async ({ commentId }: { commentId: string }) => {
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

export const unDislikeComment = async ({
  commentId,
}: {
  commentId: string
}) => {
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

export const addComment = async (comment: AddComment) => {
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

export const getComments = async (episodeId: string, limit = 5, skip = 0) => {
  const session = await auth()

  let userId

  if (session) {
    userId = session.user.id
  }

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
          userId,
        },
      },
      commentDislike: {
        select: {
          id: true,
        },
        where: {
          userId,
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
    return {
      comments: [],
      hasNextPage: false,
      nextSkip: null,
    }
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

  return {
    comments: transformedComments,
    hasNextPage: comments.length < (Number(limit) || 5) ? false : true,
    nextSkip:
      comments.length < (Number(limit) || 5)
        ? null
        : Number(skip) + (Number(limit) as number),
  }
}
