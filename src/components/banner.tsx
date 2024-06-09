import { trendingAnime } from "@/lib/consumet"
import React from "react"
import BannerSwiper from "./banner-swiper"

export default async function Banner() {
  const trending = await trendingAnime()

  return (
    <div className="relative">
      <div className="relative w-full max-w-full p-0">
        {trending.ok ? (
          <BannerSwiper trendingAnime={trending.results} />
        ) : (
          <div>Trending not found</div>
        )}
      </div>
    </div>
  )
}
