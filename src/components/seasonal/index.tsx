"use client"

import React, { useState, useEffect } from "react"
import Column from "./column"
import Section from "../section"
import { getSeason } from "@/lib/utils"
import { ConsumetResponse, IAdvancedInfo, IAnilistInfo } from "types/types"
import {
  fetchTrendingAnime,
  fetchPopularAnime,
  fetchTopAiringAnime,
  fetchTopAnime,
  fetchUpcomingSeasons,
  fetchMostPopularAnime,
  fetchMostFavoriteAnime,
} from "@/lib/cache"
import { Skeleton } from "@/components/ui/skeleton"

const Seasonal = () => {
  const currentSeason = getSeason()
  const [itemsCount, setItemsCount] = useState(
    window.innerWidth > 500 ? 24 : 15
  )

  const [state, setState] = useState({
    trendingAnime: {} as ConsumetResponse<IAdvancedInfo>,
    popularAnime: {} as ConsumetResponse<IAdvancedInfo>,
    mostPopular: {} as ConsumetResponse<IAdvancedInfo>,
    mostFavorite: {} as ConsumetResponse<IAdvancedInfo>,
    topAnime: {} as ConsumetResponse<IAdvancedInfo>,
    topAiring: {} as ConsumetResponse<IAdvancedInfo>,
    Upcoming: {} as ConsumetResponse<IAdvancedInfo>,
    error: null as string | null,
    loading: {
      trending: true,
      popular: true,
      mostPopular: true,
      mostFavorite: true,
      topRated: true,
      topAiring: true,
      Upcoming: true,
    },
  })

  useEffect(() => {
    const fetchCount = Math.ceil(itemsCount * 1.4)
    const fetchData = async () => {
      try {
        setState((prevState) => ({ ...prevState, error: null }))
        const [
          trending,
          popular,
          mostPopular,
          mostFavorite,
          topRated,
          topAiring,
          Upcoming,
        ] = await Promise.all([
          fetchTrendingAnime(1, 5),
          fetchPopularAnime(1, 5),
          fetchMostPopularAnime(1, 5),
          fetchMostFavoriteAnime(1, 5),
          fetchTopAnime(1, 5),
          fetchTopAiringAnime(1, 5),
          fetchUpcomingSeasons(1, 5),
        ])
        setState((prevState) => ({
          ...prevState,
          trendingAnime: trending,
          popularAnime: popular,
          mostPopular: mostPopular,
          mostFavorite: mostFavorite,
          topAnime: topRated,
          topAiring: topAiring,
          Upcoming: Upcoming,
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
            trending: false,
            popular: false,
            mostPopular: false,
            mostFavorite: false,
            topRated: false,
            topAiring: false,
            Upcoming: false,
          },
        }))
      }
    }

    fetchData()
  }, [itemsCount])

  useEffect(() => {
    const handleResize = () => {
      setItemsCount(window.innerWidth > 500 ? 24 : 15)
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <Section sectionName="seasonal" className="my-5">
      <div className="grid grid-cols-2 gap-2 md:gap-4 xl:grid-cols-4">
        {state.loading.popular ? (
          <SeasonalSkeleton />
        ) : (
          <Column
            seasonalTitle="Popular This Season"
            results={state.popularAnime.results}
            browse={`/browse?query=&season=${currentSeason.season}&format=TV&year=${currentSeason.year}&sort=POPULARITY_DESC`}
          />
        )}
        {state.loading.trending ? (
          <SeasonalSkeleton />
        ) : (
          <Column
            seasonalTitle="Top Airing"
            results={state.trendingAnime.results}
            browse={`/browse?query=&season=${currentSeason.season}&year=${currentSeason.year}&format=TV&sort=SCORE_DESC`}
          />
        )}
        {state.loading.mostPopular ? (
          <SeasonalSkeleton />
        ) : (
          <Column
            seasonalTitle="Most Popular Anime"
            results={state.mostPopular.results}
            browse={`/browse?query=&sort=POPULARITY_DESC&format=TV`}
          />
        )}
        {state.loading.mostFavorite ? (
          <SeasonalSkeleton />
        ) : (
          <Column
            seasonalTitle="Most Favorite Anime"
            results={state.mostFavorite.results}
            browse="/browse?query=&sort=FAVOURITES_DESC&format=TV"
          />
        )}
      </div>
    </Section>
  )
}

function SeasonalSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <SeasonalCardSkeleton />
      <SeasonalCardSkeleton />
      <SeasonalCardSkeleton />
      <SeasonalCardSkeleton />
      <SeasonalCardSkeleton />
    </div>
  )
}

function SeasonalCardSkeleton() {
  return (
    <div className="flex space-x-2">
      <Skeleton className="h-[75px] w-[60px]" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-[35px] w-[108px] md:w-[210px]" />
        <Skeleton className="h-[30px] md:w-[180px]" />
      </div>
    </div>
  )
}

export default Seasonal
