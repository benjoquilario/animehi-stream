"use client"

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/queriesKeys"
import { dislikeComment, unDislikeComment } from "@/server/comment"
import type { TPage } from "@/components/comments/comment-form"
import { useMemo } from "react"
import type { IComment } from "./useLikeUnlikeMutation"

export function useCommentDislikeMutation({
  commentId,
  animeId,
}: {
  commentId: string
  animeId: string
}) {
  const queryClient = useQueryClient()
  const queryKey = useMemo(
    () => [QUERY_KEYS.GET_INFINITE_COMMENTS, animeId],
    [animeId]
  )

  const dislikeMutation = useMutation({
    mutationFn: async () => {
      const response = await dislikeComment({ commentId })

      if (!response?.ok) {
        if (response?.status === 409) return
      }

      return true
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })

      const previousComment = queryClient.getQueryData(queryKey)

      queryClient.setQueryData<InfiniteData<TPage<IComment[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const newComment = {
            ...oldData,
            pages: oldData.pages.map((page) => {
              if (page) {
                return {
                  ...page,
                  comments: page.comments.map((comment) => {
                    if (comment.id === commentId) {
                      return {
                        ...comment,
                        _count: {
                          ...comment._count,
                          commentDislike: comment._count.commentDislike + 1,
                        },
                        isDisliked: true,
                      }
                    } else {
                      return comment
                    }
                  }),
                }
              }

              return page
            }),
          }

          return newComment
        }
      )

      return { previousComment }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousComment)
    },
  })

  const undislikeMutation = useMutation({
    mutationFn: async () => {
      const response = await unDislikeComment({ commentId })

      if (!response?.ok) {
        if (response?.status === 409) return
      }

      return true
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })

      const previousComment = queryClient.getQueryData(queryKey)

      queryClient.setQueryData<InfiniteData<TPage<IComment[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const newComment = {
            ...oldData,
            pages: oldData.pages.map((page) => {
              if (page) {
                return {
                  ...page,
                  comments: page.comments.map((comment) => {
                    if (comment.id === commentId) {
                      return {
                        ...comment,
                        _count: {
                          ...comment._count,
                          commentDislike: comment._count.commentDislike - 1,
                        },
                        isDisliked: false,
                      }
                    } else {
                      return comment
                    }
                  }),
                }
              }

              return page
            }),
          }

          return newComment
        }
      )

      return { previousComment }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousComment)
    },
  })

  return { dislikeMutation, undislikeMutation }
}
