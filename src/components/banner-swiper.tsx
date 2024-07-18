"use client"

/* eslint-disable @next/next/no-img-element */

import styles from "./banner.module.css"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import { Button, buttonVariants } from "./ui/button"
import { BsFillPlayFill } from "react-icons/bs"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { stripHtml, transformedTitle } from "@/lib/utils"
import { IAdvancedInfo } from "types/types"
import { IoAlertCircleOutline } from "react-icons/io5"
import React from "react"
import { FaFire, FaCalendar } from "react-icons/fa"

type BannerSwiperProps = {
  trendingAnime: IAdvancedInfo[]
}

const BannerSwiper = ({ trendingAnime }: BannerSwiperProps) => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      modules={[Autoplay]}
      className="mySwiper relative"
    >
      {trendingAnime?.map((trending, index) => (
        <SwiperSlide id="slider" key={trending.id}>
          <div className="absolute inset-0 h-full w-full ">
            <div className="absolute inset-0 overflow-hidden">
              {/* <NextImage
                containerclassname={`${styles.overlay} h-full w-full relative`}
                src={trending.cover ?? trending.image}
                className="absolute h-full w-full"
                style={{ objectFit: "cover" }}
                alt={trending.title.english || trending.title.romaji}
                fill
              /> */}
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
                <div className="flex items-center gap-3 text-xs md:text-base">
                  <div className="flex items-center gap-1">
                    <BsFillPlayFill />
                    {trending.type}
                  </div>
                  <div className="flex items-center gap-1">
                    <FaFire />
                    {trending.rating}%
                  </div>
                  <div className="uppercase text-primary">
                    {trending.status}
                  </div>
                  <div className="flex items-center gap-1">
                    <FaCalendar />
                    {trending.releaseDate}
                  </div>
                </div>
                <p className="mx-0 my-3 line-clamp-3 w-full max-w-lg pr-6 text-left text-sm text-foreground/90 md:line-clamp-3">
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
                  <Link
                    href={`/anime/${transformedTitle(trending.title.romaji)}/${trending.id}`}
                    className={buttonVariants({ variant: "secondary" })}
                  >
                    <IoAlertCircleOutline className="h-6 w-6" />
                    More Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default React.memo(BannerSwiper)
