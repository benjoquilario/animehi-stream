"use client"

import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"

// import required modules
import { Pagination } from "swiper/modules"
import type { Watchlist } from "@prisma/client"
import Image from "./ui/image"
import Link from "next/link"
import { BsPlayFill } from "react-icons/bs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AiOutlineLeft, AiOutlineRight, AiOutlineClose } from "react-icons/ai"

type SwiperContinueWatchingProps = {
  results: Watchlist[]
}

const SwiperContinueWatching = (props: SwiperContinueWatchingProps) => {
  const { results } = props
  return (
    <Swiper
      slidesPerView={3}
      // pagination={{
      //   clickable: true,
      // }}

      breakpoints={{
        320: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        480: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      }}
      modules={[Pagination]}
      className="mySwiper"
    >
      {results
        .map((result) => (
          <SwiperSlide key={result.id}>
            <div className="group/item relative flex shrink-0 cursor-pointer flex-col gap-2">
              <div className="invisible absolute right-1 top-4 z-40 flex scale-90 flex-col gap-1 opacity-0 transition-all duration-200 ease-out group-hover/item:visible group-hover/item:scale-100 group-hover/item:opacity-100">
                <div className="relative inline-block text-left">
                  <div className="flex flex-col gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="rounded-full bg-background p-1 text-foreground">
                            <AiOutlineClose className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p>Remove History</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={`/watch/${result.animeId}/${result.nextEpisode}`}
                            className="rounded-full bg-background p-1 text-foreground"
                          >
                            <AiOutlineRight className="h-4 w-4" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p>Next Episode</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {Number(result.prevEpisode) !== 1 ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={`/watch/${result.animeId}/${result.prevEpisode}`}
                              className="rounded-full bg-background p-1 text-foreground"
                            >
                              <AiOutlineLeft className="h-4 w-4" />
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p>Previous Episode</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : null}
                  </div>
                </div>
              </div>
              <Link
                className="group relative aspect-video w-full overflow-hidden rounded-md md:w-[320px]"
                href="/"
              >
                <div className="absolute z-30 h-full w-full bg-gradient-to-t from-background/70 from-20% to-transparent transition-all duration-300 ease-out group-hover:to-background/40"></div>
                <span className="absolute bottom-0 left-0 z-30 h-[2px] bg-red-600"></span>
                <Image
                  fill
                  src={result.image}
                  alt={result.title}
                  style={{ objectFit: "cover" }}
                />
                <div className="absolute bottom-3 left-0 z-30 mx-2 flex w-[80%] items-center gap-2">
                  <BsPlayFill />
                  <h2>Watch Episode {result.episodeNumber}</h2>
                </div>
              </Link>

              <p className="flex w-[320px] items-center gap-1 text-sm text-muted-foreground/80">
                <span
                  className="inline-block max-w-[220px] overflow-hidden text-ellipsis text-foreground"
                  title={result.title}
                  style={{ whiteSpace: "nowrap" }}
                >
                  {result.title}
                </span>
                | Episode {result.episodeNumber}
              </p>
            </div>
          </SwiperSlide>
        ))
        .reverse()}
    </Swiper>
  )
}

export default SwiperContinueWatching
