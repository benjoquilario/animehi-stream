import "server-only"

import { cache } from "react"
import { getSession } from "./session"
import db from "./db"

async function auth() {
  const session = await getSession()

  if (!session) return

  return session
}

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
  const session = await getSession()

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
