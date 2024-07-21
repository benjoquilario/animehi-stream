"use client"

import React, { useRef, useState, useTransition, useMemo } from "react"
import { usePathname } from "next/navigation"
import * as z from "zod"
import { Textarea } from "../ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { ImSpinner8 } from "react-icons/im"
import { useSession } from "next-auth/react"
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/queriesKeys"
import { useAuthStore } from "@/store"
import { Comment } from "@prisma/client"
import chunk from "lodash.chunk"
import type { AddComment } from "types/types"
import { addComment } from "@/server/comment"

const commentSchema = z.object({
  comment: z
    .string()
    .min(1, { message: "Comment must be at least 1 character" }),
})

type Inputs = z.infer<typeof commentSchema>

type CommentFormProps = {
  animeId: string
  episodeNumber: string
  anilistId: string
}

export type TPage<TData> = {
  comments: TData
  hasNextPage: boolean
  nextSkip: number
}

export default function CommentForm({
  animeId,
  episodeNumber,
  anilistId,
}: CommentFormProps) {
  const setIsAuthOpen = useAuthStore((store) => store.setIsAuthOpen)
  const { data: session, status } = useSession()
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const queryClient = useQueryClient()

  const queryKey = useMemo(
    () => [
      QUERY_KEYS.GET_INFINITE_COMMENTS,
      `${animeId}-episode-${episodeNumber}`,
    ],
    [animeId, episodeNumber]
  )

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: "",
    },
  })

  const { mutateAsync: createComment, isPending } = useMutation({
    mutationFn: async (comment: AddComment) => await addComment(comment),
    // mutationKey: ["createComment"],
    onSuccess: (newComment) => {
      queryClient.setQueryData<InfiniteData<TPage<Comment[]>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          const newComments = {
            ...oldData,
            pages: oldData.pages.map((page, index) => {
              if (index === 0) {
                return {
                  ...page,
                  comments: [
                    newComment.data,
                    ...(page.comments ? page.comments : new Array()),
                  ],
                }
              }

              return page
            }),
          }

          return newComments
        }
      )
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  async function handleOnSubmit(data: Inputs) {
    const response = await createComment({
      commentText: data.comment,
      animeId,
      episodeNumber,
      anilistId,
    })

    if (!response.ok) {
      toast.error(`${response.message}`)
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && event.shiftKey === false) {
      event.preventDefault()
      buttonRef?.current?.click()
      form.reset()
    }
  }

  return (
    <div className="mb-4 flex w-full gap-2">
      <div>
        <Avatar className="h-8 w-8 md:h-10 md:w-10">
          <AvatarImage
            src={session?.user.image ?? "/placeholder.png"}
            alt={session?.user.name ?? ""}
            className="h-8 w-8 md:h-10 md:w-10"
          />
          <AvatarFallback>
            <div className="h-full w-full animate-pulse bg-secondary"></div>
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-1 flex-col gap-3">
        {session?.user ? (
          <>
            <p>
              Comment as{" "}
              <span className="text-primary">{session.user.name}</span>
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleOnSubmit)}
                className="relative h-full space-y-1"
              >
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          className="rounded-xl bg-accent"
                          placeholder="Leave a comment"
                          onKeyDown={handleKeyPress}
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <button
                  aria-disabled={isPending}
                  disabled={isPending}
                  ref={buttonRef}
                  type="submit"
                  className="sr-only"
                />
                {isPending ? (
                  <ImSpinner8 className="absolute bottom-3 right-2 h-4 w-4 animate-spin" />
                ) : null}
              </form>
            </Form>
          </>
        ) : (
          <p>
            You must be{" "}
            <button
              className="text-primary"
              onClick={() => setIsAuthOpen(true)}
            >
              login
            </button>{" "}
            to post a comment
          </p>
        )}
      </div>
    </div>
  )
}
