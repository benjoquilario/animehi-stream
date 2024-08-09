"use client"

import React from "react"

import Link from "next/link"
import type { Comment, User } from "@prisma/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { relativeDate } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

export type SwiperNewestCommentsProps = {
  newestComments: Array<
    Comment & {
      user: User
    }
  >
}

const SwiperNewestComments = ({
  newestComments,
}: SwiperNewestCommentsProps) => {
  return (
    <>
      <div className="flex w-[calc(100%-300px)] grow flex-col">
        <ul className="flex flex-wrap gap-2">
          <li className="flex items-center justify-center rounded-full border border-primary px-2 py-1 text-sm">
            Newest Comments
          </li>
          <li className="flex items-center justify-center rounded-full border border-primary px-2 py-1 text-sm opacity-50">
            Popular Comments
          </li>
        </ul>

        <Carousel
          opts={{
            align: "start",
          }}
          className="relative w-full"
        >
          <CarouselContent className="relative">
            {newestComments.map((newestComment) => (
              <CarouselItem
                key={newestComment.id}
                className="basis-[280px] py-4"
              >
                <div className="relative h-full max-w-[320px] rounded-lg bg-secondary p-4 text-sm">
                  <div className="flex h-full w-full flex-col gap-1">
                    <div className="flex w-full flex-col items-start gap-1">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={newestComment.user.image ?? ""}
                            alt={newestComment.user.name ?? ""}
                          />
                          <AvatarFallback>
                            <div className="h-full w-full animate-pulse bg-background"></div>
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-1">
                          <Link
                            href={`/user/${newestComment.user.name}/${newestComment.user.id}`}
                          >
                            <div className="text-[15px] leading-6 text-primary transition hover:underline">
                              {newestComment.user.name}
                            </div>
                          </Link>
                          <span className="text-xs text-muted-foreground/60">
                            - {relativeDate(newestComment.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p
                        title={newestComment.comment}
                        className="line-clamp-3 italic text-foreground/80"
                      >
                        {/* eslint-disable-next-line react/no-unescaped-entities */}
                        {newestComment.comment}
                      </p>
                    </div>
                    <div className="mt-3 line-clamp-1 flex items-center overflow-hidden text-ellipsis">
                      <Link
                        title={newestComment.animeId}
                        href={`/watch/${newestComment.anilistId}?ep=${newestComment.episodeNumber}`}
                        className="line-clamp-1 text-primary hover:text-primary/90"
                      >
                        {newestComment.title}
                      </Link>
                      <span className="ml-1 text-xs">
                        ep {newestComment.episodeNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </>
  )
}

export default React.memo(SwiperNewestComments)
