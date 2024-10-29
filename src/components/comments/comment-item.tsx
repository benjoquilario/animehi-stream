"use client"

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useTransition,
  memo,
} from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../ui/button"
import { BsReplyAllFill } from "react-icons/bs"
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi"
import Link from "next/link"
import { relativeDate } from "@/lib/utils"
import { BiDotsHorizontalRounded } from "react-icons/bi"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FiEdit } from "react-icons/fi"
import { MdOutlineDeleteOutline } from "react-icons/md"
import { IoWarningSharp } from "react-icons/io5"
import * as z from "zod"
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
import { FaSpinner } from "react-icons/fa"
import { ImSpinner8 } from "react-icons/im"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea"
import { AnimatePresence, motion } from "framer-motion"
import { useAuthStore } from "@/store"
import {
  type IComment,
  useCommentLikeMutation,
} from "@/hooks/useLikeUnlikeMutation"
import { useCommentDislikeMutation } from "@/hooks/useDislikeMutation"
import { useUpdateDeleteMutation } from "@/hooks/useUpdateDeleteMutation"
import Replies from "@/components/replies"
import { BsArrow90DegDown } from "react-icons/bs"
import { toast } from "sonner"

export interface CommentItemProps {
  comment: IComment
  animeId: string
  episodeNumber: string
  haveReplies: boolean
  isUserComment: boolean
  isAuthenticated: boolean
}

const editSchema = z.object({
  comment: z
    .string()
    .min(1, { message: "Comment must be at least 1 character" }),
})

type Inputs = z.infer<typeof editSchema>

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  animeId,
  episodeNumber,
  haveReplies = false,
  isUserComment = false,
  isAuthenticated = false,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isRepliesOpen, setIsRepliesOpen] = useState(false)

  const likeParams = {
    commentId: comment.id,
    animeId: `${animeId}-episode-${episodeNumber}`,
  }

  const { likeMutation, unlikeMutation } = useCommentLikeMutation(likeParams)
  const { dislikeMutation, undislikeMutation } =
    useCommentDislikeMutation(likeParams)
  const { updateCommentMutation, deleteCommentMutation } =
    useUpdateDeleteMutation({ animeId: `${animeId}-episode-${episodeNumber}` })

  const form = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      comment: comment.comment,
    },
  })

  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && event.shiftKey === false) {
      setIsEditing(false)
      event.preventDefault()
      buttonRef?.current?.click()
      form.reset()
    }
  }

  const handleLike = React.useCallback(
    (isLiked: boolean) => {
      if (!isAuthenticated)
        return toast.warning("please login to like or dislike comments")

      return !isLiked ? likeMutation.mutate() : unlikeMutation.mutate()
    },
    [isAuthenticated, likeMutation, unlikeMutation]
  )

  const handleDislike = React.useCallback(
    (isDisliked: boolean) => {
      if (!isAuthenticated)
        return toast.warning("please login to like or dislike comments")

      return !isDisliked ? dislikeMutation.mutate() : undislikeMutation.mutate()
    },
    [dislikeMutation, isAuthenticated, undislikeMutation]
  )

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset()
    }
  }, [form])

  const handleOnSubmit = function (data: Inputs) {
    return updateCommentMutation.mutate({
      id: comment.id,
      commentText: data.comment,
    })
  }

  return (
    <div className="relative flex w-full gap-2">
      {isRepliesOpen || comment._count.replyComment > 0 ? (
        <div className="absolute left-[18px] top-[30px] h-[calc(100%_-_80px)] w-[2px] bg-input"></div>
      ) : null}
      <div>
        <Avatar className="h-8 w-8 md:h-10 md:w-10">
          <AvatarImage
            src={comment.user.image ?? ""}
            alt={comment.user.name ?? ""}
            className="h-8 w-8 md:h-10 md:w-10"
          />
          <AvatarFallback>
            <div className="h-full w-full animate-pulse bg-secondary"></div>
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <Link
              className="inline"
              href={`/user/${comment.user.name}/${comment.user.id}`}
            >
              <h4 className="inline-flex">
                <span
                  className="max-w-full text-sm font-medium text-foreground underline-offset-1 hover:underline"
                  style={{ wordBreak: "break-word" }}
                >
                  {comment.user.name}
                </span>
              </h4>
            </Link>
            {comment.isEdited && (
              <span className="text-sm text-muted-foreground/60">(edited)</span>
            )}
          </div>

          <span className="text-xs text-muted-foreground/60">
            {comment.isEdited
              ? relativeDate(comment.updatedAt)
              : relativeDate(comment.createdAt)}
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
                            disabled={updateCommentMutation.isPending}
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
          <button
            onClick={() => setIsRepliesOpen(true)}
            className="flex items-center gap-1 text-xs md:text-sm"
          >
            <BsReplyAllFill className="h-4 w-4 md:h-5 md:w-5" />
            Reply
          </button>
          <div className="inline-flex items-center">
            <button
              onClick={() => handleLike(comment.isLiked)}
              className="group"
            >
              {comment.isLiked ? (
                <BiSolidLike className="h-5 w-5 group-active:scale-110" />
              ) : (
                <BiLike className="h-5 w-5 group-active:scale-110" />
              )}
            </button>
            <div className="ml-1 text-foreground">
              {/* {comment._count.commentLike} */}
              {comment._count.commentLike}
            </div>
          </div>
          <div className="inline-flex items-center">
            <button
              onClick={() => handleDislike(comment.isDisliked)}
              className="group"
            >
              {comment.isDisliked ? (
                <BiSolidDislike className="h-5 w-5 group-active:scale-110" />
              ) : (
                <BiDislike className="h-5 w-5 group-active:scale-110" />
              )}
            </button>
            <div className="ml-1 text-foreground">
              {/* {comment._count.commentLike} */}
              {comment._count.commentDislike}
            </div>
          </div>

          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                className="h-5 w-8 rounded p-1 ring-offset-1 hover:ring-1 hover:ring-foreground"
                variant="ghost"
                onClick={() => setIsOpen((isOpen) => !isOpen)}
              >
                <BiDotsHorizontalRounded className="h-5 w-8" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {isUserComment && (
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
                    <Button
                      className="flex w-full cursor-pointer gap-1 text-sm text-destructive hover:bg-destructive/60"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsAlertOpen((isAlertOpen) => !isAlertOpen)
                        setIsOpen(false)
                      }}
                    >
                      <MdOutlineDeleteOutline />
                      Delete
                    </Button>
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
          {updateCommentMutation.isPending && (
            <div>
              <FaSpinner aria-hidden className="animate-spin" />
            </div>
          )}
          {isEditing ? (
            <button
              onClick={() => setIsEditing(false)}
              className="text-xs text-primary"
            >
              cancel
            </button>
          ) : null}
        </div>

        {haveReplies &&
          (!isRepliesOpen ? (
            <div className="ml-2 mt-1">
              <div className="absolute bottom-[12px] left-[18px] h-[42px] w-[38px] rounded-l border-b-2 border-l-2 border-l-input border-t-input md:w-[27px]"></div>
              <Button
                variant="ghost"
                onClick={() => setIsRepliesOpen(true)}
                aria-label="show replies"
                size="sm"
                className="flex items-center gap-1 text-xs font-semibold underline-offset-1 hover:underline"
              >
                <span>
                  <BsArrow90DegDown className="-rotate-90" />
                </span>
                <span>{comment._count.replyComment} replies</span>
              </Button>
            </div>
          ) : null)}

        {isRepliesOpen && <Replies commentId={comment.id} />}
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
                disabled={isPending}
                onClick={() =>
                  startTransition(() => {
                    deleteCommentMutation.mutateAsync({ id: comment.id })
                  })
                }
              >
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default memo(CommentItem)
