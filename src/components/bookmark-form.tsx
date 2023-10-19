"use client"

import { useSession } from "next-auth/react"
import React, { useCallback, useState, useMemo } from "react"
import { Button } from "./ui/button"
import { BsFillBookmarkPlusFill, BsCheckCircleFill } from "react-icons/bs"
import { toast } from "sonner"
import type { AnimeInfoResponse } from "types/types"
import { publicUrl } from "@/lib/consumet"
import type { Bookmark as BookmarkT } from "@prisma/client"
import { ImSpinner8 } from "react-icons/im"

type BookmarkFormProps = {
  animeResult: AnimeInfoResponse | null
  bookmarks?: BookmarkT[]
  userId?: string
}

const BookmarkForm = ({
  animeResult,
  bookmarks,
  userId,
}: BookmarkFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const [bookMarks] = useState(bookmarks)
  const [isBookmark, setIsBookMark] = useState(false)

  const isBookmarkExist = useMemo(
    () =>
      bookMarks?.some(
        (bookmark) =>
          bookmark.animeId === animeResult?.id && bookmark.userId === userId
      ),
    [bookMarks, isBookmark]
  )

  const handleOnBookmark = async () => {
    if (!session) {
      toast.error("Please login to use this feature.")
    } else {
      try {
        setIsLoading(true)

        const response = await fetch(`${publicUrl}/api/user/bookmark`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            animeId: animeResult?.id,
            image: animeResult?.image,
            title: animeResult?.title ?? animeResult?.otherName,
          }),
        })

        setIsBookMark(true)
        if (!response.ok) {
          toast.error("Something went wrong.")
        }

        setIsLoading(false)

        return toast.success(
          `${animeResult?.title ?? animeResult?.otherName} bookmarked`
        )
      } catch (error) {
        setIsLoading(false)
        setIsBookMark(false)
        console.log("Something went wrong")
      }
    }

    return toast.dismiss()
  }

  if (!session && !isBookmark) {
    return (
      <Button
        onClick={handleOnBookmark}
        className="flex h-3 items-center gap-1 bg-background px-2 text-sm hover:bg-background"
      >
        <BsFillBookmarkPlusFill className="h-5 w-5" /> Bookmark
      </Button>
    )
  }

  return (
    <>
      {!isBookmarkExist && !isBookmark ? (
        <Button
          onClick={handleOnBookmark}
          className="flex h-3 items-center gap-1 bg-background px-2 text-sm hover:bg-background"
        >
          {isLoading ? (
            <div className="flex h-3 items-center gap-1 bg-background px-2 text-sm hover:bg-background">
              <ImSpinner8 className="h-3 w-3 animate-spin" />
              Loading...
            </div>
          ) : (
            <>
              <BsFillBookmarkPlusFill className="h-5 w-5" /> Bookmark
            </>
          )}
        </Button>
      ) : (
        <Button
          onClick={handleOnBookmark}
          className="flex h-3 items-center gap-1 bg-background px-2 text-sm text-primary hover:bg-background"
        >
          <BsCheckCircleFill className="h-5 w-5" /> Bookmarked
        </Button>
      )}
    </>
  )
}

export default BookmarkForm
