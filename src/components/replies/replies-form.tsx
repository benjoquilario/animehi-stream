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
import { createReplyComment } from "@/server/reply"
import type { User } from "@prisma/client"
import { useAuthStore } from "@/store"

const repliesSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Comment must be at least 1 character" }),
})

type Inputs = z.infer<typeof repliesSchema>

type RepliesFormProps = {
  commentId: string
  replyId: string
}

export default function RepliesForm({ commentId, replyId }: RepliesFormProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const setIsAuthOpen = useAuthStore((store) => store.setIsAuthOpen)

  const queryKey = useMemo(
    () => [QUERY_KEYS.GET_INFINITE_REPLIES, commentId],
    [commentId]
  )

  const form = useForm<z.infer<typeof repliesSchema>>({
    resolver: zodResolver(repliesSchema),
    defaultValues: {
      content: "",
    },
  })

  const { mutateAsync: createReplies, isPending } = useMutation({
    mutationFn: async (replies: { content: string; commentId: string }) =>
      await createReplyComment(replies),
    onSuccess: (newComment) => {
      queryClient.setQueryData<
        InfiniteData<IRepliesPage<IReplyComment<User>[]>>
      >(queryKey, (oldData) => {
        if (!oldData) return

        const newComments = {
          ...oldData,
          pages: oldData.pages.map((page, index) => {
            if (index === 0) {
              return {
                ...page,
                replies: [
                  newComment.data,
                  ...(page.replies ? page.replies : new Array()),
                ],
              }
            }

            return page
          }),
        }

        return newComments
      })
    },
  })

  async function handleOnSubmit(data: Inputs) {
    const response = await createReplies({
      commentId,
      content: data.content,
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
    <div className="relative mb-6 flex w-full gap-2">
      <div className="absolute bottom-[12px] left-[-34px] top-[3px] h-[32px] w-[57px] rounded-l border-b-2 border-l-2 border-l-input border-t-input md:left-[-50px]"></div>
      <div className="mt-3">
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
      <div className="mt-1 flex flex-1 flex-col gap-3">
        {session?.user ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className="relative h-full space-y-1"
            >
              <FormField
                control={form.control}
                name="content"
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
