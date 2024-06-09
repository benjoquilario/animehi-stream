"use client"

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/queriesKeys"
import { editComment, deleteComment } from "@/app/actions"
import type { TPage } from "@/components/comments/comment-form"
import { useMemo } from "react"
import type { IComment } from "./useLikeUnlikeMutation"

export function useUpdateDeleteMutation({ animeId }: { animeId: string }) {
  const queryClient = useQueryClient()

  const queryKey = useMemo(
    () => [QUERY_KEYS.GET_INFINITE_COMMENTS, animeId],
    [animeId]
  )

  const updateCommentMutation = useMutation({
    mutationFn: ({ id, commentText }: { id: string; commentText: string }) =>
      editComment({ id, commentText }),
    onMutate: async (updatedComment) => {
      queryClient.setQueryData<InfiniteData<TPage<IComment[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const updatedComments = {
            ...oldData,
            pages: oldData.pages.map((page) => {
              const index = page.comments?.findIndex(
                (oldComment) => oldComment.id === updatedComment.id
              )

              const newComments = [...page.comments]

              newComments[index] = {
                ...page.comments[index],
                isEdited: true,
                updatedAt: new Date(),
                id: updatedComment.id,
                comment: updatedComment.commentText,
              }

              return {
                ...page,
                comments: newComments,
              }
            }),
          }

          return updatedComments
        }
      )
    },
  })

  const deleteCommentMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteComment(id),
    // onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onMutate: async (deletedComment) => {
      await queryClient.cancelQueries({ queryKey })

      const previousComment = queryClient.getQueryData(queryKey)

      queryClient.setQueryData<InfiniteData<TPage<IComment[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const newComments = {
            ...oldData,
            pages: oldData.pages.map((page, i) => {
              const deletedComments = page.comments.filter(
                (comment) => comment.id !== deletedComment.id
              )

              return {
                ...page,
                comments: deletedComments,
              }
            }),
          }

          return newComments
        }
      )

      return { previousComment }
    },
  })

  return { updateCommentMutation, deleteCommentMutation }
}
