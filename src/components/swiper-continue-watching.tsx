"use client"

import React, { useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"

// import required modules
import { Pagination } from "swiper/modules"
import type { Watchlist } from "@prisma/client"
import NextImage from "./ui/image"
import Link from "next/link"
import { BsPlayFill } from "react-icons/bs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { FaRegTrashCan } from "react-icons/fa6"
import { Button } from "./ui/button"
import { deleteWatchlist } from "@/server/anime"

type SwiperContinueWatchingProps = {
  results: Watchlist[]
}

const SwiperContinueWatching = (props: SwiperContinueWatchingProps) => {
  const { results } = props
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteWatchlist({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watching"] })
      toast.success(`Remove history`)

      return toast.dismiss()
    },
  })

  return (
    <Swiper
      slidesPerView={3}
      // pagination={{
      //   clickable: true,
      // }}

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
                          <Button
                            onClick={() => mutate.mutate({ id: result.id })}
                            className="rounded-md bg-foreground p-3 text-muted-foreground hover:bg-destructive hover:text-white"
                          >
                            <FaRegTrashCan className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p>Remove History</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {/* <TooltipProvider>
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
                    </TooltipProvider> */}
                    {/* {Number(result.prevEpisode) !== 1 ? (
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
                    ) : null} */}
                  </div>
                </div>
              </div>
              <Link
                className="group relative aspect-video w-full overflow-hidden rounded-md md:w-[320px]"
                href={`/watch?id=${result.anilistId}&slug=${result.animeId}&ep=${result.episodeNumber}`}
              >
                <div className="absolute z-30 h-full w-full bg-gradient-to-t from-background/70 from-20% to-transparent transition-all duration-300 ease-out group-hover:to-background/40"></div>
                {/* <span className="absolute bottom-0 left-0 z-30 h-[2px] bg-red-600"></span> */}
                <NextImage
                  fill
                  src={result.image}
                  alt={result.title}
                  style={{ objectFit: "cover" }}
                  className="transition-all group-hover:scale-105"
                />
                <div className="absolute bottom-3 left-0 z-30 mx-2 flex w-full items-center justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <div className="text-sm text-muted-foreground">
                      Watching Episode {result.episodeNumber}
                    </div>
                    <h3>{result.title}</h3>
                  </div>
                  <div className="mr-3 rounded-full p-2 text-foreground transition-all group-hover:bg-muted-foreground/90">
                    <BsPlayFill className="h-6 w-6" />
                  </div>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))
        .reverse()}
    </Swiper>
  )
}

export default SwiperContinueWatching
