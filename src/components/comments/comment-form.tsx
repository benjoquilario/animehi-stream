"use client"

import React, { useRef, useState, useTransition } from "react"
import { usePathname } from "next/navigation"
import { addComment, AddComment } from "@/app/actions"
import * as z from "zod"
import { Textarea } from "../ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { ImSpinner8 } from "react-icons/im"
import { useSession } from "next-auth/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/queriesKeys"

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

export default function CommentForm({
  animeId,
  episodeNumber,
  anilistId,
}: CommentFormProps) {
  const { data: session, status } = useSession()
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: "",
    },
  })

  const { mutateAsync: createComment, isPending } = useMutation({
    mutationFn: (comment: AddComment) => addComment(comment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INFINITE_COMMENTS],
      })
    },
  })

  async function handleOnSubmit(data: Inputs) {
    await createComment({
      commentText: data.comment,
      animeId,
      episodeNumber,
      anilistId,
    })
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && event.shiftKey === false) {
      event.preventDefault()
      buttonRef?.current?.click()
      form.reset()
    }
  }

  return (
    <div className="mb-6 flex w-full gap-2">
      <div>
        <Avatar>
          <AvatarImage
            src={session?.user.image ?? "/placeholder.png"}
            alt={session?.user.name ?? ""}
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
          <p>You must be login to post a comment</p>
        )}
      </div>
    </div>
  )
}
