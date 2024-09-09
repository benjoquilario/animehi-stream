import React from "react"
import BannerSwiper from "./banner-swiper"
import { fetchTrendingAnime } from "@/lib/consumet"

async function Banner() {
  const top = await fetchTrendingAnime(1, 10)

  return (
    <div className="relative">
      <div className="relative w-full max-w-full p-0">
        <BannerSwiper trendingAnime={top.results} />
      </div>
    </div>
  )
}

export default Banner
