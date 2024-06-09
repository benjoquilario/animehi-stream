import "server-only"

import { cache } from "react"
import { auth } from "@/auth"
import db from "./db"
import { redis } from "./redis"

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
        },
      },
    },
  })

  return comments
})

const CACHE_MAX_AGE = 60 * 60 * 4
export async function cacheRedis(cacheKey: string, url: string) {
  try {
    const cachedResponse = await redis.get(cacheKey)

    if (cachedResponse) return cachedResponse

    const response = await fetch(url)

    if (!response.ok) throw new Error(`Server Error: ${response.statusText}`)

    const data = await response.json()

    if (data) {
      const stringifyResult = JSON.stringify(data)

      await redis.setex(cacheKey, CACHE_MAX_AGE, stringifyResult)
    }

    return data
  } catch (error) {
    throw error
  }
}
