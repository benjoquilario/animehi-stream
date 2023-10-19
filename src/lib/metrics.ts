import "server-only"

import { cache } from "react"
import { getSession } from "./session"
import db from "./db"

async function auth() {
  const session = await getSession()

  if (!session) return

  return session
}

export const getContinueWatching = cache(async () => {
  const session = await auth()

  const data = await db.watchlist.findMany({
    where: {
      userId: session?.user.id,
    },
  })

  if (!data) return null

  return data
})
