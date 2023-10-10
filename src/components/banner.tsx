"use client"
/* eslint-disable @next/next/no-img-element */

import React from "react"
import styles from "./banner.module.css"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { Swiper, SwiperSlide } from "swiper/react"
// @ts-expect-error
import { Autoplay } from "swiper"
import { spotlight } from "@/lib/spotlight"
import { Button, buttonVariants } from "./ui/button"
import { BsFillPlayFill } from "react-icons/bs"
import Link from "next/link"

const Banner = () => {
  return (
    <div className="relative">
      <div className="w-full max-w-full p-0">
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
          {spotlight.map((anime) => (
            <SwiperSlide id="slider" key={anime.id}>
              <div className="absolute inset-0 h-full w-full ">
                <div className="absolute inset-0 overflow-hidden">
                  <div className={styles.overlay}>
                    <img
                      src={anime.banner}
                      className="absolute h-full w-full"
                      style={{ objectFit: "cover" }}
                      alt="naruto"
                    />
                  </div>
                  <div className="absolute bottom-[50px] top-[auto] z-[100] w-full max-w-[800px] pl-[2%] md:bottom-[109px]">
                    <h2 className="mx-0 mb-2 line-clamp-2 w-full max-w-lg text-lg font-bold sm:text-2xl md:text-5xl">
                      {anime.title}
                    </h2>
                    <p className="mx-0 my-3 line-clamp-2 w-full max-w-lg pr-6 text-left text-sm text-muted-foreground md:line-clamp-3">
                      {anime.description}
                    </p>
                    <Link
                      href={`/watch/${anime.id}/${anime.episode}`}
                      className={buttonVariants()}
                    >
                      <BsFillPlayFill className="h-6 w-6" />
                      Play Now
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default Banner
