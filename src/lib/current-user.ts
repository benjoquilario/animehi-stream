import db from "./db"
import { getSession } from "./session"

export async function getCurrentUser() {
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
}
