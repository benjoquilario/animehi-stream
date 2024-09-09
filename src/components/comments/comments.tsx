"use client"

import React from "react"
import CommentForm from "./comment-form"
import CommentItem from "./comment-item"
import { QUERY_KEYS } from "@/lib/queriesKeys"
import { useInfiniteQuery } from "@tanstack/react-query"
import { BsCaretDownFill } from "react-icons/bs"
import { ImSpinner8 } from "react-icons/im"
import { Badge } from "../ui/badge"
import { LuMessageSquare } from "react-icons/lu"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "../ui/button"
import type { IComment } from "@/hooks/useLikeUnlikeMutation"

type CommentsProps = {
  episodeNumber: string
  anilistId: string
  animeTitle: string
}

export default function Comments({
  episodeNumber,
  anilistId,
  animeTitle,
}: CommentsProps) {
  const {
    data: comments,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      QUERY_KEYS.GET_INFINITE_COMMENTS,
      `${anilistId}-episode-${episodeNumber}`,
    ],
    queryFn: ({ pageParam }) =>
      fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/comments/${anilistId}-episode-${episodeNumber}?limit=${5}&cursor=${pageParam}`
      ).then((res) => res.json()),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextSkip,
    refetchOnWindowFocus: false,
  })

  console.log(comments)

  return (
    <div className="mt-2 rounded-lg px-[2%] lg:px-0">
      {isPending ? (
        <div className="relative flex items-center justify-center">
          <div className="loader"></div>
        </div>
      ) : (
        <div>
          <CommentForm
            animeTitle={animeTitle}
            episodeNumber={episodeNumber}
            anilistId={anilistId}
          />

          <AnimatePresence>
            {comments?.pages.map((page) =>
              page?.comments.length !== 0 ? (
                page?.comments.map((comment: IComment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ y: 300, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    className="mb-2 flex w-full gap-3 hover:bg-background/90"
                  >
                    <CommentItem
                      comment={comment}
                      animeId={anilistId}
                      episodeNumber={episodeNumber}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-sm">
                  No comments yet. Be the first to comment!
                </div>
              )
            )}
          </AnimatePresence>

          {hasNextPage && (
            <div>
              {isFetchingNextPage ? (
                <div>
                  <ImSpinner8 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <Button
                  className="flex items-center gap-1 text-[15px] leading-6 text-primary hover:text-primary/90 active:scale-105"
                  onClick={() => fetchNextPage()}
                  size="sm"
                  variant="ghost"
                >
                  <BsCaretDownFill className="h-4 w-4" />
                  View More
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
