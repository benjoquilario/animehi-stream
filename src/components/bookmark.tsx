"use client"

import { useMemo } from "react"
import type { AnimeInfoResponse } from "types/types"
import { BsCheckCircleFill } from "react-icons/bs"

import type { Bookmark as BookmarkT } from "@prisma/client"

interface BookmarkProps {
  animeResult: AnimeInfoResponse | null
  bookMarks?: BookmarkT[]
  userId?: string
  children: React.ReactNode
}

const Bookmark: React.FC<BookmarkProps> = ({
  animeResult,
  bookMarks,
  userId,
  children,
}) => {
  const isAnimeExist = useMemo(
    () =>
      bookMarks?.some(
        (bookmark) =>
          bookmark.anilistId === animeResult?.id && bookmark.userId === userId
      ),
    [bookMarks, userId, animeResult]
  )

  console.log(isAnimeExist)

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

export default Bookmark
