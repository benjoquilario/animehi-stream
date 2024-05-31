"use client"

import React from "react"

import NextImage from "@/components/ui/image"
import { Swiper, SwiperSlide } from "swiper/react"
// import required modules
import { FreeMode, Pagination, Scrollbar } from "swiper/modules"
import Link from "next/link"
import type { Comment, User } from "@prisma/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { relativeDate } from "@/lib/utils"

export type SwiperNewestCommentsProps = {
  newestComments: Array<
    Comment & {
      user: User
    }
  >
}

export default function SwiperNewestComments({
  newestComments,
}: SwiperNewestCommentsProps) {
  return (
    <>
      <div className="relative hidden h-[280px] w-[280px] shrink-0 md:block">
        <NextImage
          fill
          src="/anime-34.png"
          alt="anime"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="flex w-[calc(100%-300px)] grow flex-col">
        <ul className="flex flex-wrap gap-2">
          <li className="flex items-center justify-center rounded-full border border-primary px-2 py-1 text-sm">
            Newest Comments
          </li>
          <li className="flex items-center justify-center rounded-full border border-primary px-2 py-1 text-sm opacity-50">
            Popular Comments
          </li>
        </ul>
        <Swiper
          slidesPerView={4}
          spaceBetween={15}
          freeMode={true}
          modules={[FreeMode, Scrollbar]}
          scrollbar={true}
          breakpoints={{
            300: {
              slidesPerView: "auto",
              spaceBetween: 15,
            },
            940: {
              slidesPerView: 3,
              spaceBetween: 15,
            },
            1199: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1599: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
          }}
          className="mySwiper w-full"
        >
          {newestComments.map((newestComment) => (
            <SwiperSlide key={newestComment.id} className="py-8">
              <div className="relative h-full max-w-[320px] rounded-lg bg-secondary p-4 text-sm">
                <div className="flex h-full w-full flex-col gap-1">
                  <div className="flex w-full flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={newestComment.user.image ?? ""}
                          alt={newestComment.user.userName ?? ""}
                        />
                        <AvatarFallback>
                          <div className="h-full w-full animate-pulse bg-background"></div>
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-1">
                        <Link href={`/accounts/`}>
                          <h4 className="text-[15px] leading-6 text-primary transition hover:underline">
                            {newestComment.user.userName}
                          </h4>
                        </Link>
                        <span className="text-xs text-muted-foreground/60">
                          - {relativeDate(newestComment.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="line-clamp-3 italic text-foreground/90">
                      {/* eslint-disable-next-line react/no-unescaped-entities */}
                      "{newestComment.comment}"
                    </p>
                  </div>
                  <div className="mt-3 block overflow-hidden text-ellipsis">
                    <Link
                      href={`/watch/${newestComment.animeId}/${newestComment.anilistId}/${newestComment.episodeNumber}`}
                      className="line-clamp-1 text-primary hover:text-primary/90"
                    >
                      {newestComment.episodeId.split("-").join(" ")}
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  )
}
