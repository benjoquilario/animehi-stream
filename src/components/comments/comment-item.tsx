"use client"

import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../ui/button"
import { BsReplyAllFill } from "react-icons/bs"
import { BiLike, BiDislike } from "react-icons/bi"
import type { Comment, User } from "@prisma/client"
import { CommentsT } from "types/types"
import Link from "next/link"

export type CommentItemProps = {
  comment: CommentsT<User>
}

export default function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="mb-2 flex w-full gap-2">
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
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <Link href={`/accounts/${comment.userId}`}>
            <h4 className="text-[15px] leading-6">{comment.user.userName}</h4>
          </Link>
          <span className="text-xs text-muted-foreground/60">
            2 minutes ago
          </span>
        </div>
        <div className="my-1">
          <div>
            <p className="break-words text-sm text-foreground/80">
              {comment.comment}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-1 text-sm">
            <BsReplyAllFill />
            Reply
          </button>
          <button>
            <BiLike />
          </button>
          <button>
            <BiDislike />
          </button>
        </div>
      </div>
    </div>
  )
}
