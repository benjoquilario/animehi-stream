"use client"

import React, { useEffect, useState } from "react"
import CommentForm from "./comment-form"
import CommentItem from "./comment-item"
import { User } from "@prisma/client"
import { CommentsT } from "types/types"
import { QUERY_KEYS } from "@/lib/queriesKeys"
import { useInfiniteQuery } from "@tanstack/react-query"
import { publicUrl } from "@/lib/consumet"
import { BsCaretDownFill } from "react-icons/bs"
import { ImSpinner8 } from "react-icons/im"
import { Badge } from "../ui/badge"
import { LuMessageSquare } from "react-icons/lu"

type CommentsProps = {
  animeId: string
  episodeNumber: string
  anilistId: string
}

export default function Comments({
  animeId,
  episodeNumber,
  anilistId,
}: CommentsProps) {
  const {
    data: comments,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_COMMENTS],
    queryFn: ({ pageParam }) =>
      fetch(
        `${publicUrl}/api/comments/${animeId}-episode-${episodeNumber}?limit=${5}&cursor=${pageParam}`
      ).then((res) => res.json()),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextSkip,
    refetchOnWindowFocus: false,
  })

  return (
    <div className="mt-4">
      <h3 className="flex w-full items-center pt-2.5 text-left text-2xl font-semibold">
        <div className="mr-2 h-8 w-2 rounded-md bg-primary"></div>
        Comments
        <Badge className="ml-2">Beta</Badge>
      </h3>
      <div className="mt-2 w-full rounded-sm bg-destructive px-2 py-5 text-center sm:text-sm">
        Respect others. Be nice. No spam. No hate speech.
      </div>

      <div className="my-4 flex items-center gap-2">
        <LuMessageSquare />

        <span>Comments EP {episodeNumber}</span>
      </div>
      <div className="mt-2 rounded-lg">
        {isLoading ? (
          <div className="relative flex items-center justify-center">
            <div className="loader"></div>
          </div>
        ) : (
          <div>
            <CommentForm
              animeId={animeId}
              episodeNumber={episodeNumber}
              anilistId={anilistId}
            />

            {comments?.pages.map(
              (page) =>
                page?.comments.map((comment: CommentsT<User>) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment as CommentsT<User>}
                  />
                ))
            )}

            {hasNextPage && (
              <div>
                {isFetchingNextPage ? (
                  <div>
                    <ImSpinner8 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  <button
                    className="flex items-center gap-1 text-[15px] leading-6 text-primary hover:text-primary/90"
                    onClick={() => fetchNextPage()}
                  >
                    <BsCaretDownFill className="h-4 w-4" />
                    View More
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
