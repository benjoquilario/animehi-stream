import type { AnimeInfoResponse } from "types/types"
import { BsCheckCircleFill } from "react-icons/bs"

import type { Bookmark as BookmarkT } from "@prisma/client"
import { getCurrentUser } from "@/lib/current-user"

type BookmarkProps = {
  animeResult: AnimeInfoResponse | null
  bookmarks?: BookmarkT[]
  children: React.ReactNode
}

export default async function Bookmark({
  animeResult,
  children,
}: BookmarkProps) {
  const currentUser = await getCurrentUser()

  const isAnimeExist = currentUser?.bookMarks.some(
    (bookmark) => bookmark.animeId === animeResult?.id
  )

  return (
    <>
      {currentUser ? (
        isAnimeExist ? (
          <div className="flex h-3 items-center gap-1 bg-background px-2 text-sm text-primary hover:bg-background">
            <BsCheckCircleFill className="h-5 w-5" /> Bookmarked
          </div>
        ) : (
          <>{children}</>
        )
      ) : (
        <>{children}</>
      )}
    </>
  )
}
