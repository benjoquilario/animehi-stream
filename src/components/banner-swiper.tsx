"use client"

/* eslint-disable @next/next/no-img-element */

import styles from "./banner.module.css"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import { spotlight } from "@/lib/spotlight"
import { Button, buttonVariants } from "./ui/button"
import { BsFillPlayFill } from "react-icons/bs"
import Link from "next/link"
import NextImage from "./ui/image"
import { extractId, stripHtml } from "@/lib/utils"
import { IAdvancedInfo, Seasonal } from "types/types"
import { IoAlertCircleOutline } from "react-icons/io5"
import React from "react"

type BannerSwiperProps = {
  trendingAnime: IAdvancedInfo[]
}

export default function BannerSwiper({ trendingAnime }: BannerSwiperProps) {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      modules={[Autoplay]}
      className="mySwiper"
    >
      {trendingAnime?.map((trending) => (
        <SwiperSlide id="slider" key={trending.id}>
          <div className="absolute inset-0 h-full w-full ">
            <div className="absolute inset-0 overflow-hidden">
              <NextImage
                containerclassname={`${styles.overlay} h-full w-full relative`}
                src={trending.cover ?? trending.image}
                className="absolute h-full w-full"
                style={{ objectFit: "cover" }}
                alt={trending.title.english || trending.title.romaji}
                fill
              />
              <div className="absolute bottom-[50px] top-auto z-[100] w-full max-w-[800px] pl-[2%] md:bottom-[109px]">
                <h2 className="mx-0 mb-2 line-clamp-2 w-full max-w-lg text-lg font-bold sm:text-2xl md:text-5xl">
                  {trending.title.english || trending.title.romaji}
                </h2>
                <p className="mx-0 my-3 line-clamp-2 w-full max-w-lg pr-6 text-left text-sm text-foreground/90 md:line-clamp-3">
                  {stripHtml(trending.description)}
                </p>
                <div className="flex gap-2">
                  <Link
                    href={`/anime/name/${trending.id}`}
                    className={buttonVariants()}
                  >
                    <BsFillPlayFill className="h-6 w-6" />
                    Play Now
                  </Link>
                  <Link
                    href={`/anime/anime/${trending.id}`}
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
