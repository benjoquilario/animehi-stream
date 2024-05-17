import React from "react"
import BannerSwiper from "./banner-swiper"
import { seasonal } from "@/lib/consumet"

const Banner = async () => {
  const seasonalTrending = await seasonal()

  return (
    <div className="relative">
      <div className="w-full max-w-full p-0">
        <BannerSwiper seasonalTrending={seasonalTrending?.trending} />
      </div>
    </div>
  )
}

export default Banner
