"use client"

import React, { useState, useEffect } from "react"
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
import Row from "./content"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const RowContent = () => {
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
          fetchTrendingAnime(1, 20),
          fetchPopularAnime(1, 20),
          fetchMostPopularAnime(1, 20),
          fetchMostFavoriteAnime(1, 20),
          fetchTopAnime(1, 20),
          fetchTopAiringAnime(1, 20),
          fetchUpcomingSeasons(1, 20),
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
    <div>
      {state.loading.trending ? (
        <RowSkeleton />
      ) : (
        <Row
          seasonalTitle="Popular This Season"
          results={state.popularAnime.results}
          browse={`/browse?query=&season=${currentSeason.season}&format=TV&year=${currentSeason.year}&sort=POPULARITY_DESC`}
        />
      )}
      {state.loading.trending ? (
        <RowSkeleton />
      ) : (
        <Row
          seasonalTitle="Top Airing"
          results={state.trendingAnime.results}
          browse={`/browse?query=&season=${currentSeason.season}&year=${currentSeason.year}&format=TV&sort=SCORE_DESC`}
        />
      )}
      {state.loading.trending ? (
        <RowSkeleton />
      ) : (
        <Row
          seasonalTitle="Most Popular Anime"
          results={state.mostPopular.results}
          browse={`/browse?query=&sort=POPULARITY_DESC&format=TV`}
        />
      )}
      {state.loading.trending ? (
        <RowSkeleton />
      ) : (
        <Row
          seasonalTitle="Most Favorite Anime"
          results={state.mostFavorite.results}
          browse="/browse?query=&sort=FAVOURITES_DESC&format=TV"
        />
      )}
    </div>
  )
}

function RowSkeleton() {
  return (
    <div className="mt-4">
      <Carousel
        opts={{
          align: "start",
        }}
        className="relative w-full"
      >
        <CarouselContent className="relative ml-2 md:ml-5">
          {Array.from({ length: 20 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="basis-[155px] md:basis-[185px]"
            >
              <div className="flex flex-col gap-2">
                <Skeleton className="h-[194px] w-[139px] md:h-[236px] md:w-[169px]" />
                <Skeleton className="h-[30px] w-[139px] md:w-[169px]" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}

export default RowContent
