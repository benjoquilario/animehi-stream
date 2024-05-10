"use client"

import { useMemo, useState } from "react"
import type { AnimeInfoResponse } from "types/types"
import { BsCheckCircleFill } from "react-icons/bs"

import type { Bookmark as BookmarkT } from "@prisma/client"

type BookmarkProps = {
  animeResult: AnimeInfoResponse | null
  bookMarks?: BookmarkT[]
  userId?: string
  children: React.ReactNode
}

export default function Bookmark({
  animeResult,
  bookMarks,
  userId,
  children,
}: BookmarkProps) {
  const [bookmarks] = useState(bookMarks)

  const isAnimeExist = useMemo(
    () =>
      bookmarks?.some(
        (bookmark) =>
          bookmark.animeId === animeResult?.id && bookmark.userId === userId
      ),
    [bookmarks]
  )

  return (
    <>
      {bookMarks ? (
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
