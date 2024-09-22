"use client"

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/queriesKeys"
import { likeReplyComment, unlikeReplyComment } from "@/server/like"
import type { User } from "@prisma/client"
import { useMemo } from "react"

export function useLikeReplyCommentMutation({
  replyId,
  commentId,
  content,
}: {
  commentId: string
  replyId: string
  content: string
}) {
  const queryClient = useQueryClient()
  const queryKey = useMemo(
    () => [QUERY_KEYS.GET_INFINITE_REPLIES, commentId],
    [commentId]
  )

  const likeReplyCommentMutation = useMutation({
    mutationFn: async () => {
      const response = await likeReplyComment({ replyId })

      if (!response?.ok) {
        if (response?.status === 409) return
      }

      return true
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })

      const previousComment = queryClient.getQueryData(queryKey)

      queryClient.setQueryData<
        InfiniteData<IRepliesPage<IReplyComment<User>[]>>
      >(queryKey, (oldData) => {
        if (!oldData) return

        const newReplies = {
          ...oldData,
          pages: oldData.pages.map((page) => {
            if (page) {
              return {
                ...page,
                replies: page.replies.map((reply) => {
                  if (reply.id === replyId) {
                    return {
                      ...reply,
                      _count: {
                        ...reply._count,
                        replyLike: reply._count.replyLike + 1,
                      },
                      isLiked: true,
                    }
                  } else {
                    return reply
                  }
                }),
              }
            }

            return page
          }),
        }

        return newReplies
      })

      return { previousComment }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousComment)
    },
  })

  const unlikeReplyCommentMutation = useMutation({
    mutationFn: async () => {
      const response = await unlikeReplyComment({ replyId })

      if (!response?.ok) {
        if (response?.status === 409) return
      }

      return true
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })

      const previousComment = queryClient.getQueryData(queryKey)

      queryClient.setQueryData<
        InfiniteData<IRepliesPage<IReplyComment<User>[]>>
      >(queryKey, (oldData) => {
        if (!oldData) return

        const newReplies = {
          ...oldData,
          pages: oldData.pages.map((page) => {
            if (page) {
              return {
                ...page,
                replies: page.replies.map((reply) => {
                  if (reply.id === replyId) {
                    return {
                      ...reply,
                      _count: {
                        ...reply._count,
                        replyLike: reply._count.replyLike - 1,
                      },
                      isLiked: false,
                    }
                  } else {
                    return reply
                  }
                }),
              }
            }

            return page
          }),
        }

        return newReplies
      })

      return { previousComment }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  return { likeReplyCommentMutation, unlikeReplyCommentMutation }
}
