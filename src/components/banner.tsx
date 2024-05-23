import { trendingAnime } from "@/lib/consumet"
import React from "react"
import BannerSwiper from "./banner-swiper"
import { ConsumetResponse, IAdvancedInfo } from "types/types"

export default async function Banner() {
  const trending = (await trendingAnime()) as ConsumetResponse<IAdvancedInfo>

  return (
    <div className="relative">
      <div className="w-full max-w-full p-0">
        <BannerSwiper trendingAnime={trending.results} />
      </div>
    </div>
  )
}
