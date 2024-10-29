import "server-only"

import { cache } from "react"
import { auth } from "@/auth"
import db from "./db"

export const continueWatching = cache(async () => {
  const session = await auth()

  if (!session) return null

  const data = await db.watchlist.findMany({
    where: {
      userId: session?.user.id,
    },
    orderBy: {
      updatedAt: "asc",
    },
    take: 10,
  })

  if (!data) return null

  return data
})

export const animeWatchById = cache(async (animeId: string) => {
  const session = await auth()

  if (!session) return null

  const watch = await db.watchlist.findFirst({
    where: {
      animeId,
      userId: session.user.id,
    },
  })

  return watch
})
export const getCurrentUser = cache(async () => {
  const session = await auth()

  if (!session?.user.id) return null

  const currentUser = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      bookMarks: true,
    },
  })

  if (!currentUser) return null

  return currentUser
})

export const mostView = cache(async () => {
  const data = await db.viewCounter.findMany({
    take: 10,
    orderBy: {
      view: "desc",
    },
  })

  return data
})

export const getNewestComments = cache(async () => {
  const comments = await db.comment.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          userName: true,
          image: true,
          email: true,
          name: true,
        },
      },
    },
  })

  return comments
})

export const accessToken = async function () {
  const session = await auth()

  const userId = session?.user.id

  if (userId) {
    const account = await db.account.findFirst({
      where: {
        userId,
        token_type: "bearer",
      },
    })

    return account?.access_token
  }
}

export const getBookmark = async function (userId: string) {
  const bookMarks = await db.bookmark.findMany({
    where: {
      userId,
    },
  })

  return bookMarks
}

export const getContinueWatching = async function () {
  const session = await auth()

  if (!session) return

  const userId = session.user.id

  const watching = await db.watchlist.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: "asc",
    },
  })

  return watching
}

export const getAnimeViews = cache(async function (animeId: string) {
  const views = await db.viewCounter.findFirst({
    where: {
      anilistId: animeId,
    },
  })

  return views
})
