"use client"

import { useSession } from "next-auth/react"
import React, { useState } from "react"
import { Button } from "./ui/button"
import { BsFillBookmarkPlusFill, BsCheckCircleFill } from "react-icons/bs"
import { toast } from "sonner"
import type { IAnilistInfo } from "types/types"
import { ImSpinner8 } from "react-icons/im"
import { createBookmark } from "@/server/anime"

interface BookmarkFormProps {
  animeResult?: IAnilistInfo
  checkBookmarkExist?: boolean
  anilistId: string
  animeId: string
}

const BookmarkForm: React.FC<BookmarkFormProps> = ({
  animeResult,
  animeId,
  checkBookmarkExist,
  anilistId,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const [isBookmark, setIsBookMark] = useState(false)

  const handleOnBookmark = async () => {
    if (!session) {
      toast.error("Please login to use this feature.")
    } else {
      try {
        setIsLoading(true)

        if (!animeResult) return

        await createBookmark({
          animeId,
          image: animeResult.image,
          title: animeResult.title.english ?? animeResult.title.romaji,
          anilistId,
        })

        setIsBookMark(true)
        setIsLoading(false)
        toast.success(
          `${animeResult.title.english ?? animeResult.title.romaji} bookmarked`
        )
      } catch (error) {
        setIsLoading(false)
        setIsBookMark(false)
        toast.error("Something went wrong.")
      } finally {
        setIsLoading(false)
      }
    }

    return toast.dismiss()
  }

  if (!session && !isBookmark) {
    return (
      <Button
        onClick={handleOnBookmark}
        className="flex h-3 items-center gap-1 bg-background px-2 text-sm text-foreground hover:bg-background"
      >
        <BsFillBookmarkPlusFill className="h-4 w-4" />{" "}
        <span className="hidden md:block">Bookmark</span>
      </Button>
    )
  }

  return (
    <>
      {!checkBookmarkExist && !isBookmark ? (
        <Button
          onClick={handleOnBookmark}
          className="flex h-3 items-center gap-1 bg-background px-2 text-sm text-foreground hover:bg-background"
        >
          {isLoading ? (
            <div className="flex h-3 items-center gap-1 bg-background px-2 text-sm hover:bg-background">
              <ImSpinner8 className="h-3 w-3 animate-spin" />
              Loading...
            </div>
          ) : (
            <>
              <BsFillBookmarkPlusFill className="h-4 w-4" />{" "}
              <span className="hidden md:block">Bookmark</span>
            </>
          )}
        </Button>
      ) : (
        <Button
          onClick={handleOnBookmark}
          className="flex h-3 items-center gap-1 bg-background px-2 text-sm text-primary hover:bg-background"
        >
          <BsCheckCircleFill className="h-4 w-4" />{" "}
          <span className="hidden md:block">Bookmarked</span>
        </Button>
      )}
    </>
  )
}

export default BookmarkForm
