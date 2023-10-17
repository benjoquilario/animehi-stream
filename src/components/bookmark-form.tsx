"use client"

import { useSession } from "next-auth/react"
import React, { useState } from "react"
import { Button } from "./ui/button"
import { BsFillBookmarkPlusFill, BsCheckCircleFill } from "react-icons/bs"
import { toast } from "sonner"
import type { AnimeInfoResponse } from "types/types"
import { publicUrl } from "@/lib/consumet"

type BookmarkFormProps = {
  animeResult: AnimeInfoResponse | null
}

const BookmarkForm = ({ animeResult }: BookmarkFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()

  async function handleOnBookmark() {
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

        if (!response.ok) {
          toast.error("Something went wrong.")
        }

        setIsLoading(false)
        return toast.success(
          `${animeResult?.title ?? animeResult?.otherName} bookmarked`
        )
      } catch (error) {
        setIsLoading(false)
        console.log("Something went wrong")
      }
    }

    return toast.dismiss()
  }

  return (
    <Button
      onClick={handleOnBookmark}
      className="flex h-3 items-center gap-1 bg-background px-2 text-sm hover:bg-background"
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <BsFillBookmarkPlusFill className="h-5 w-5" /> Bookmark
        </>
      )}
    </Button>
  )
}

export default BookmarkForm
