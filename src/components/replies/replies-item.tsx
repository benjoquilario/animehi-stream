"use client"

import React, { useState, useRef, useEffect, memo } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { BiDotsHorizontalRounded } from "react-icons/bi"
import { BsArrow90DegDown } from "react-icons/bs"
import { AiFillLike } from "react-icons/ai"
import type { User } from "@prisma/client"
import dayjs from "@/lib/time"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  FormLabel,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import useReplyCommentStore from "@/store/reply"
import { useUpdateDeleteRepliesMutation } from "@/hooks/mutation/useUpdateDeleteReplies"
import { useLikeReplyCommentMutation } from "@/hooks/mutation/useLikeReply"
import { Textarea } from "@/components/ui/textarea"
import { BiLike, BiSolidLike } from "react-icons/bi"
import { useAuthStore } from "@/store"

interface ReplyItemProps {
  reply: IReplyComment<User>
  commentId: string
}

const editSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Comment must be at least 1 character" }),
})

const RepliesItem: React.FC<ReplyItemProps> = ({ reply, commentId }) => {
  const { data: session } = useSession()
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const setIsAuthOpen = useAuthStore((store) => store.setIsAuthOpen)
  const { deleteReplyMutation, updateReplyMutation } =
    useUpdateDeleteRepliesMutation({ commentId })

  const { likeReplyCommentMutation, unlikeReplyCommentMutation } =
    useLikeReplyCommentMutation({
      commentId,
      replyId: reply.id,
      content: reply.content,
    })

  const setSelectedReply = useReplyCommentStore(
    (store) => store.setSelectedReply
  )
  const selectedReply = useReplyCommentStore((store) => store.selectedReply)
  const replyId = useReplyCommentStore((store) => store.replyId)
  const setReplyId = useReplyCommentStore((store) => store.setReplyId)
  const clearSelectedReply = useReplyCommentStore(
    (store) => store.clearSelectedReply
  )
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const form = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
  })

  const handleSelectComment = async function () {
    setSelectedReply({
      content: reply.content,
      replyId: reply.id,
    })
    setReplyId(reply.id)

    setIsEditing(true)
    form.setFocus("content")
  }

  useEffect(() => {
    form.setFocus("content")
  }, [form, form.setFocus])

  const handleReset = async function () {
    clearSelectedReply()
    setIsEditing(false)
  }

  useEffect(() => {
    if (replyId && selectedReply) {
      form.setValue("content", selectedReply.content)
    }
  }, [replyId, form.setValue, selectedReply, form])

  const handleOnSubmit = async function (data: z.infer<typeof editSchema>) {
    // updateCommentMutation.mutate({
    //   commentId: comment.id,
    //   comment: data.comment,
    // })

    updateReplyMutation.mutate({
      replyId: reply.id,
      content: data.content,
    })

    handleReset()
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && event.shiftKey === false) {
      event.preventDefault()
      buttonRef?.current?.click()
      form.reset()

      handleReset()
    }
  }

  const handleLikeReply = (isLiked: boolean) => {
    if (!session) return setIsAuthOpen(true)

    return !isLiked
      ? likeReplyCommentMutation.mutate()
      : unlikeReplyCommentMutation.mutate()
  }

  return (
    <>
      <div className="relative flex pl-4 pt-1">
        <div className="relative mr-2 mt-1 block rounded-full">
          {/* {isReplyOpen || comment._count.reply > 0 ? (
            <div className="absolute left-[18px] top-[30px] h-[calc(100%_-_61px)] w-[2px] bg-gray-300"></div>
          ) : null} */}
          <div className="absolute left-[-38px] top-[15px] h-[2px] w-[45px] bg-input md:left-[-45px]"></div>
          <span className="inline">
            <Link
              href={`/user/${reply.user.name}/${reply.user.id}`}
              className="relative inline-block w-full shrink basis-auto items-stretch"
              // aria-label={comment.user?.name}
            >
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={reply.user.image ?? "/default-image.png"}
                  alt={`${reply.user.name}`}
                  className="h-6 w-6"
                />
                <AvatarFallback>
                  <div className="h-full w-full animate-pulse bg-primary/10"></div>
                </AvatarFallback>
              </Avatar>
              <div className="pointer-events-none absolute inset-0 rounded-full"></div>
            </Link>
          </span>
        </div>

        <div className="mr-10 grow basis-0 overflow-hidden pr-2 md:pr-4">
          <div>
            <div
              className="max-w-[calc(100%_-_26px] inline-block w-full break-words"
              style={{ wordBreak: "break-word" }}
            >
              {isEditing ? (
                <div className="grow overflow-hidden">
                  <div>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(handleOnSubmit)}
                        className="relative flex w-full flex-wrap justify-end"
                      >
                        <div className="relative w-full">
                          <div className="flex flex-wrap justify-end">
                            <div className="shrink grow basis-auto overflow-hidden pb-2">
                              <div className="relative p-1">
                                <FormField
                                  control={form.control}
                                  name="content"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="sr-only">
                                        Comment
                                      </FormLabel>
                                      <FormControl>
                                        <Textarea
                                          {...field}
                                          placeholder="Write a comment..."
                                          // eslint-disable-next-line tailwindcss/no-contradicting-classname
                                          className={cn(
                                            "relative mt-0 w-full rounded bg-secondary py-2 pl-3 pr-9 text-sm text-foreground/90 transition",
                                            "hover:ring-secondary-70 hover:text-foreground",
                                            "focus-visible:outline-offset-1 focus-visible:outline-primary focus-visible:ring-foreground/60 active:text-foreground/70",
                                            "focus:outline-none focus:outline-offset-1 focus:outline-primary focus-visible:outline-offset-1 focus-visible:outline-primary"
                                          )}
                                          onKeyDown={handleKeyPress}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              {replyId && (
                                <div className="flex gap-1 text-xs text-muted-foreground/80">
                                  <span>Press Esc to</span>
                                  <button
                                    onClick={() => handleReset()}
                                    type="button"
                                    className="text-primary"
                                  >
                                    cancel
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            ref={buttonRef}
                            type="submit"
                            className="absolute bottom-6 right-4 text-xl text-primary"
                          ></button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </div>
              ) : (
                <>
                  <span>
                    <span className="inline">
                      <Link
                        className="inline"
                        href={`/user/${reply.user.name}/${reply.user.id}`}
                      >
                        <span className="inline-flex">
                          <span
                            className="max-w-full text-sm font-medium text-foreground underline-offset-1 hover:underline"
                            style={{ wordBreak: "break-word" }}
                          >
                            {reply.user.name}
                          </span>
                        </span>
                      </Link>
                    </span>
                  </span>

                  <div className="relative inline-flex w-full align-middle">
                    <div className="base-[auto] w-full min-w-0 shrink grow">
                      <div
                        className="relative m-1 inline-block max-w-full whitespace-normal break-words rounded text-foreground"
                        style={{ wordBreak: "break-word" }}
                      >
                        <div className="py-2 pr-7">
                          <div className="block py-[4px]">
                            <span
                              className="break-words"
                              style={{ wordBreak: "break-word" }}
                            >
                              <div
                                className="text-sm"
                                style={{ wordBreak: "break-word" }}
                              >
                                <div
                                  dir="auto"
                                  className="text-foreground/80s text-start font-sans"
                                >
                                  {reply.content}
                                </div>
                              </div>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="ml-1 mt-1 flex items-center gap-2 text-xs font-semibold">
                <span className="text-xs text-muted-foreground/60">
                  {dayjs(reply.createdAt).fromNow(true)}
                </span>
                <div className="inline-flex items-center ">
                  <button
                    onClick={() => handleLikeReply(reply.isLiked)}
                    className="group"
                  >
                    {reply.isLiked ? (
                      <BiSolidLike className="h-5 w-5 group-active:scale-110" />
                    ) : (
                      <BiLike className="h-5 w-5 group-active:scale-110" />
                    )}
                  </button>
                  <div className="ml-1 text-foreground">
                    {/* {comment._count.commentLike} */}
                    {reply._count.replyLike}
                  </div>
                </div>
                {reply.isEdited ? (
                  <span className="text-xs font-light text-muted-foreground/60">
                    Edited
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-0 w-1/2">
          {/* {isModalOpen && (
            <div className="absolute right-3 top-12 z-30 h-auto rounded border border-solid border-zinc-200 bg-zinc-100 shadow-xl md:right-[60px] md:top-[21px]">
              <ModalComment
                handleEdit={handleUpdateComment}
                handleDelete={handleDeleteComment}
              />
            </div>
          )} */}
          {session?.user?.id === reply.userId && (
            <div className="absolute right-5 top-3 self-end">
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    // type="button"
                    // onClick={handleModalOpen}
                    onClick={() => setIsOpen((isOpen) => !isOpen)}
                    className="rounded-full p-1 px-2 text-foreground/80 transition hover:bg-secondary/90"
                    aria-label="show post modal"
                  >
                    <BiDotsHorizontalRounded aria-hidden="true" size={22} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Button
                      onClick={handleSelectComment}
                      variant="ghost"
                      className="w-full cursor-pointer"
                    >
                      Edit
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsAlertOpen((isAlertOpen) => !isAlertOpen)
                        setIsOpen(false)
                      }}
                      className="w-full cursor-pointer"
                    >
                      Delete
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              comment and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                className="cursor-pointer"
                size="sm"
                disabled={deleteReplyMutation.isPending}
                onClick={() =>
                  deleteReplyMutation.mutateAsync({ replyId: reply.id })
                }
              >
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default memo(RepliesItem)
