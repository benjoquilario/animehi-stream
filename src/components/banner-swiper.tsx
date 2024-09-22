"use client"

/* eslint-disable @next/next/no-img-element */

import styles from "./banner.module.css"
import { buttonVariants } from "./ui/button"
import { BsFillPlayFill } from "react-icons/bs"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { stripHtml, transformedTitle } from "@/lib/utils"
import { IAdvancedInfo } from "types/types"
import React from "react"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

type BannerSwiperProps = {
  trendingAnime: IAdvancedInfo[]
}

const BannerSwiper = ({ trendingAnime }: BannerSwiperProps) => {
  const plugin = React.useRef(
    Autoplay({ delay: 2500, stopOnInteraction: true })
  )

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {trendingAnime?.map((trending, index) => (
          <CarouselItem key={index} className="basis-full">
            <div className="relative pb-[350px] md:pb-[500px]">
              <div className="absolute inset-0 h-full w-full ">
                <div className="absolute inset-0 overflow-hidden">
                  <div
                    className={cn(
                      "h-full w-full bg-cover bg-center bg-no-repeat",
                      styles.overlay
                    )}
                    style={{
                      backgroundImage: `url("${trending.cover ?? trending.image}")`,
                    }}
                  ></div>

                  <div className="absolute bottom-[50px] top-auto z-[100] w-full max-w-[800px] pl-[2%] md:bottom-[109px]">
                    <div className="mb-3 text-base font-bold text-primary md:text-2xl">
                      #{index + 1} on Trend
                    </div>
                    <h2
                      title={trending.title.english || trending.title.romaji}
                      className="mx-0 mb-2 line-clamp-2 w-full max-w-xl text-lg font-bold sm:text-2xl md:text-5xl"
                    >
                      {trending.title.english || trending.title.romaji}
                    </h2>
                    {/* <div className="flex items-center gap-3 text-xs md:text-base">
                      <div className="flex items-center gap-1">
                        <BsFillPlayFill />
                        {trending.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <FaFire />
                        {trending.rating}%
                      </div>
                      <div className="font-bold uppercase text-primary">
                        {trending.status}
                      </div>
                      <div className="flex items-center gap-1">
                        <FaCalendar />
                        {trending.releaseDate}
                      </div>
                    </div> */}
                    <p
                      title={trending.description}
                      className="mx-0 my-3 line-clamp-3 w-full max-w-lg pr-6 text-left text-sm text-foreground/90 md:line-clamp-3"
                    >
                      {stripHtml(trending.description)}
                    </p>
                    <div className="flex gap-2">
                      <Link
                        href={`/anime/${transformedTitle(trending.title.romaji)}/${trending.id}`}
                        className={buttonVariants({ variant: "shine" })}
                      >
                        <BsFillPlayFill className="h-6 w-6" />
                        Play Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

export default React.memo(BannerSwiper)
