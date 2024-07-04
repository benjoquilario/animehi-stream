"use client"

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { QUERY_KEYS } from "@/lib/queriesKeys"
import { likeComment, unlikeComment } from "@/server/comment"
import type { TPage } from "@/components/comments/comment-form"
import type { Comment, User } from "@prisma/client"
import { useMemo } from "react"

export interface IComment extends Comment {
  _count: {
    commentLike: number
    commentDislike: number
    replyComment: number
  }
  isLiked: boolean
  isDisliked: boolean
  user: User
}

export function useCommentLikeMutation({
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

  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await likeComment({ commentId })

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
                          commentLike: comment._count.commentLike + 1,
                        },
                        isLiked: true,
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

  const unlikeMutation = useMutation({
    mutationFn: async () => {
      const response = await unlikeComment({ commentId })

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
                          commentLike: comment._count.commentLike - 1,
                        },
                        isLiked: false,
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

  return { likeMutation, unlikeMutation }
}
