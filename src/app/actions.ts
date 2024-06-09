"use server"
import db from "@/lib/db"
import {
  Credentials,
  credentialsValidator,
  registerValidator,
  type Register,
} from "@/lib/validations/credentials"
import bcrypt from "bcrypt"
import { auth, signIn } from "@/auth"
import { headers } from "next/headers"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { AuthError } from "next-auth"

export async function login(values: Credentials) {
  const validatedFields = credentialsValidator.safeParse(values)

  if (!validatedFields.success) {
    return {
      error: "Invalid Fields",
    }
  }

  const { email, password } = validatedFields.data

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    return {
      ok: true,
      message: "Signed in successfully",
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Invalid Credentials",
          }
        default:
          return {
            error: "Something went wrong",
          }
      }
    }

    throw error
  }
}

export async function register(values: Register) {
  const validatedFields = registerValidator.safeParse(values)

  if (!validatedFields.success) {
    return {
      error: "Invalid Fields",
    }
  }

  const { userName, email, password, confirmPassword } = validatedFields.data

  const isEmailExist = await db.user.findFirst({
    where: { email },
  })

  if (isEmailExist) {
    return {
      error: "User already exist",
    }
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const randomNumber = Math.floor(Math.random() * 6) + 1

  if (password !== confirmPassword) {
    return {
      error: "The passwords did not match",
    }
  }

  await db.user.create({
    data: {
      email,
      password: hashedPassword,
      userName,
      image: `/avatar-${randomNumber}.png`,
    },
  })

  return {
    ok: true,
    message: "Success",
  }
}

export async function increment(animeId: string, latestEpisodeNumber: number) {
  const data = await db.viewCounter.findFirst({
    where: {
      animeId,
    },
  })

  if (!data) return

  const view = data.view

  await db.viewCounter.update({
    where: {
      id: data.id,
    },
    data: {
      view: view + 1,
      latestEpisodeNumber,
    },
  })

  return
}

type CreateWatchList = {
  animeId: string
  image: string
  title: string
  episodeNumber: string
  anilistId: string
}

export async function createWatchlist({
  animeId,
  image,
  title,
  episodeNumber,
  anilistId,
}: CreateWatchList) {
  const session = await auth()

  if (!session) return

  const checkEpisode = await db.watchlist.findFirst({
    where: {
      animeId,
      userId: session.user.id,
    },
  })

  if (checkEpisode) {
    return
  } else
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        watchlists: {
          create: [
            {
              episodeId: `${animeId}-episode-${episodeNumber}`,
              episodeNumber: Number(episodeNumber),
              image,
              title,
              animeId,
              anilistId,
            },
          ],
        },
      },
    })

  return
}

export async function createViewCounter({
  animeId,
  image,
  title,
  latestEpisodeNumber,
  anilistId,
}: {
  animeId: string
  image: string
  title: string
  latestEpisodeNumber: number
  anilistId: string
}) {
  const isAnimeIdExist = await db.viewCounter.findFirst({
    where: {
      animeId: animeId,
    },
  })

  if (isAnimeIdExist) return

  await db.viewCounter.create({
    data: {
      image,
      title,
      animeId,
      view: 1,
      latestEpisodeNumber,
      anilistId,
    },
  })

  return
}

type UpdateWatchlist = {
  episodeId: string
  episodeNumber: string
  animeId: string
}

export async function updateWatchlist({
  episodeId,
  episodeNumber,
  animeId,
}: UpdateWatchlist) {
  const session = await auth()

  if (!session) return

  const checkAnime = await db.watchlist.findFirst({
    where: {
      animeId,
      userId: session.user.id,
    },
  })

  if (checkAnime)
    await db.watchlist.update({
      where: {
        id: checkAnime.id,
        userId: session.user.id,
      },
      data: {
        episodeId,
        episodeNumber: +episodeNumber,
        updatedAt: new Date(),
      },
    })

  return
}

export async function deleteWatchlist(id: string) {
  const session = await auth()

  if (!session) return

  await db.watchlist.delete({
    where: {
      id,
    },
  })

  return {
    message: "Success",
  }
}

export async function deleteBookmark({
  animeId,
  id,
}: {
  animeId: string
  id: string
}) {
  const session = await auth()

  if (!session) return

  const checkAnime = await db.bookmark.findFirst({
    where: {
      userId: session.user.id,
      animeId,
    },
  })

  if (checkAnime) {
    await db.bookmark.delete({
      where: {
        id,
        animeId,
      },
    })
  }

  return
}

export async function createBookmark({
  animeId,
  image,
  title,
  anilistId,
}: {
  animeId: string
  image: string
  title: string
  anilistId: string
}) {
  const session = await auth()

  if (!session) return

  const checkAnime = await db.bookmark.findFirst({
    where: {
      userId: session.user.id,
      animeId,
    },
  })

  if (checkAnime) return

  await db.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      bookMarks: {
        create: [
          {
            animeId,
            image,
            title,
            anilistId,
          },
        ],
      },
    },
  })

  return
}

export type AddComment = {
  commentText: string
  animeId: string
  episodeNumber: string
  anilistId: string
}

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

  const { commentText, animeId, episodeNumber, anilistId } = comment

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
      episodeId: `${animeId}-episode-${episodeNumber}`,
      comment: commentText,
      episodeNumber,
      anilistId,
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
