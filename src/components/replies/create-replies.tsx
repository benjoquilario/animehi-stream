"use client"

import React from "react"
import ReplyItem from "./replies-item"
import ReplyCommentForm from "./replies-form"
import { QUERY_KEYS } from "@/lib/queriesKeys"
import { useInfiniteQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import type { User } from "@prisma/client"
import { ImSpinner8 } from "react-icons/im"
import { Button } from "@/components/ui/button"

type CreateCommentProps = {
  commentId: string
}

const CreateReplyComment = (props: CreateCommentProps) => {
  const { commentId } = props

  const {
    data: comments,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_REPLIES, commentId],
    queryFn: ({ pageParam }) =>
      fetch(`/api/replies/${commentId}?limit=${3}&cursor=${pageParam}`).then(
        (res) => res.json()
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextSkip,
    refetchOnWindowFocus: false,
  })

  return isPending ? (
    <div className="flex w-full animate-spin items-center justify-center py-2">
      <ImSpinner8 className="h-4 w-4" />
    </div>
  ) : (
    <div>
      <ul>
        {comments?.pages.map((page) =>
          page?.replies.map((reply: IReplyComment<User>) => (
            <motion.li
              key={reply.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ReplyItem reply={reply} commentId={commentId} />
            </motion.li>
          ))
        )}
        {isFetchingNextPage && (
          <div className="flex items-center justify-center py-4">
            <ImSpinner8 className="animate-spin text-2xl text-foreground" />
          </div>
        )}
        {!isFetchingNextPage && hasNextPage && (
          <li className="ml-4">
            <Button
              variant="ghost"
              type="button"
              onClick={() => fetchNextPage()}
              className="underline-offset-1 hover:underline"
            >
              View more comments
            </Button>
          </li>
        )}
      </ul>
      <div className="px-3 pt-1 md:px-5">
        <ReplyCommentForm commentId={commentId} replyId="" />
      </div>
    </div>
  )
}

export default CreateReplyComment
