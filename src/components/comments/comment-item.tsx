"use client"

import React, { useState, useRef, useMemo, useCallback, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../ui/button"
import { BsReplyAllFill } from "react-icons/bs"
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi"
import type { Comment, User } from "@prisma/client"
import { CommentsT } from "types/types"
import Link from "next/link"
import { relativeDate } from "@/lib/utils"
import { BiDotsHorizontalRounded } from "react-icons/bi"
import { useSession } from "next-auth/react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FiEdit } from "react-icons/fi"
import { MdOutlineDeleteOutline } from "react-icons/md"
import { IoWarningSharp } from "react-icons/io5"
import { deleteComment, editComment } from "@/app/actions"
import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query"
import * as z from "zod"
import { QUERY_KEYS } from "@/lib/queriesKeys"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { ImSpinner8 } from "react-icons/im"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "../ui/textarea"
import { AnimatePresence, motion } from "framer-motion"

export type CommentItemProps = {
  comment: CommentsT<User>
  animeId: string
  episodeNumber: string
}

const editSchema = z.object({
  comment: z
    .string()
    .min(1, { message: "Comment must be at least 1 character" }),
})

type Inputs = z.infer<typeof editSchema>

export default function CommentItem({
  comment,
  animeId,
  episodeNumber,
}: CommentItemProps) {
  const { data: session } = useSession()
  const [isLiked, setIsLiked] = useState(false)
  const [isDisLiked, setIsDisLiked] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const queryClient = useQueryClient()
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const form = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      comment: comment.comment,
    },
  })

  const queryKey = useMemo(
    () => [
      QUERY_KEYS.GET_INFINITE_COMMENTS,
      `${animeId}-episode-${episodeNumber}`,
    ],
    [animeId, episodeNumber]
  )

  const { mutateAsync: mutateEditComment, isPending } = useMutation({
    mutationFn: ({ id, commentText }: { id: string; commentText: string }) =>
      editComment({ id, commentText }),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  const { mutateAsync: mutateDeleteComment } = useMutation({
    mutationFn: async ({ id }: { id: string }) => await deleteComment(id),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && event.shiftKey === false) {
      setIsEditing(false)
      event.preventDefault()
      buttonRef?.current?.click()
      form.reset()
    }
  }

  const handleEdit = useCallback(() => {
    setIsEditing(!isEditing)
    form.setFocus("comment")
  }, [isEditing, form])

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset()
    }
  }, [form])

  async function handleOnSubmit(data: Inputs) {
    await mutateEditComment({
      id: comment.id,
      commentText: data.comment,
    })
  }

  return (
    <>
      <div>
        <Avatar>
          <AvatarImage
            src={comment.user.image ?? ""}
            alt={comment.user.userName ?? ""}
          />
          <AvatarFallback>
            <div className="h-full w-full animate-pulse bg-secondary"></div>
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${comment.userId}`}>
            <h4 className="text-[15px] leading-6">{comment.user.userName}</h4>
          </Link>
          <span className="text-xs text-muted-foreground/60">
            {relativeDate(comment.createdAt)}
          </span>
        </div>
        {isEditing ? (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ease: "easeOut", duration: 0.5 }}
              exit={{ opacity: 0 }}
            >
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
                            className="rounded-xl bg-background ring-1 focus:ring-primary focus-visible:ring-1"
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
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="my-1">
            <div>
              <p className="break-words text-sm text-foreground/80">
                {comment.comment}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-base">
            <BsReplyAllFill className="h-5 w-5" />
            Reply
          </button>
          <button onClick={() => setIsLiked(!isLiked)} className="group">
            {isLiked ? (
              <BiLike className="h-5 w-5 group-active:scale-110" />
            ) : (
              <BiSolidLike className="h-5 w-5 group-active:scale-110" />
            )}
          </button>
          <button className="group">
            {isDisLiked ? (
              <BiDislike className="h-5 w-5 group-active:scale-110" />
            ) : (
              <BiSolidDislike className="h-5 w-5 group-active:scale-110" />
            )}
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="h-5 w-8 rounded p-1 ring-offset-1 hover:ring-1 hover:ring-foreground"
                variant="ghost"
              >
                <BiDotsHorizontalRounded className="h-5 w-8" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {session?.user.id === comment.userId && (
                <>
                  <DropdownMenuItem asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex w-full cursor-pointer gap-1 text-sm hover:bg-primary hover:text-white"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <FiEdit />
                      Edit
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          className="flex w-full cursor-pointer gap-1 text-sm text-destructive hover:bg-destructive/60"
                          variant="ghost"
                          size="sm"
                        >
                          <MdOutlineDeleteOutline />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your comment and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction asChild>
                            <Button
                              className="cursor-pointer"
                              size="sm"
                              onClick={() =>
                                mutateDeleteComment({ id: comment.id })
                              }
                            >
                              Delete
                            </Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem asChild>
                <Button
                  className="flex w-full cursor-pointer gap-1 text-sm"
                  variant="ghost"
                  size="sm"
                >
                  <IoWarningSharp />
                  Report
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  )
}
