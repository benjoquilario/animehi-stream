"use client"

import React, { useState, useEffect } from "react"
import BannerSwiper from "./banner-swiper"
import { ConsumetResponse, IAdvancedInfo } from "types/types"
import { fetchTopAnime } from "@/lib/cache"
import { Skeleton } from "./ui/skeleton"

export default function Banner() {
  const [state, setState] = useState({
    topAnime: {} as ConsumetResponse<IAdvancedInfo>,
    loading: {
      topAnime: true,
    },
    error: null as string | null,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState((prevState) => ({ ...prevState, error: null }))
        const top = await fetchTopAnime(1, 10)

        setState((prevState) => ({
          ...prevState,
          topAnime: top,
        }))
      } catch (fetchError) {
        setState((prevState) => ({
          ...prevState,
          error: "An unexpected error occurred",
        }))
      } finally {
        setState((prevState) => ({
          ...prevState,
          loading: {
            topAnime: false,
          },
        }))
      }
    }

    fetchData()
  }, [])

  return state.loading.topAnime ? (
    <div className="relative h-[350px] w-full animate-pulse bg-background px-[2%] md:h-[500px]">
      <div className="absolute bottom-[50px] top-auto z-[100] w-full max-w-[800px] space-y-3 md:bottom-[109px]">
        <Skeleton className="h-[28px] w-[344px] md:h-[52px] md:w-[512px]" />
        <Skeleton className="h-[42px] w-[344px] md:h-[58px] md:w-[512px]" />
        <div className="flex items-center space-x-3">
          <Skeleton className="h-[40px] w-[114px]" />
          <Skeleton className="h-[40px] w-[114px]" />
        </div>
      </div>
    </div>
  ) : (
    <div className="relative">
      <div className="relative w-full max-w-full p-0">
        {!state.error ? (
          <BannerSwiper trendingAnime={state.topAnime.results} />
        ) : (
          <div>Trending not found</div>
        )}
      </div>
    </div>
  )
}
