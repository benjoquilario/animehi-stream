"use client"

import React, { useEffect, useState } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ConsumetResponse, IAdvancedInfo } from "types/types"
import { fetchTrendingAnime } from "@/lib/cache"
// import EpisodeCard from "../episode-card"
import CardRow from "./card-row"
import { FaChevronRight, FaChevronLeft } from "react-icons/fa"
import Link from "next/link"
import { FaArrowRightLong } from "react-icons/fa6"

type RowProps = {
  browse: string
  results: IAdvancedInfo[]
  seasonalTitle: string
}

const Row = ({ browse, results, seasonalTitle }: RowProps) => {
  const [state, setState] = useState({
    trendingAnime: {} as ConsumetResponse<IAdvancedInfo>,
    loading: {
      trending: true,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState((prevState) => ({ ...prevState, error: null }))
        const trending = await fetchTrendingAnime(1, 20)

        setState((prevState) => ({
          ...prevState,
          trendingAnime: trending,
        }))
      } catch (error) {
        setState((prevState) => ({
          ...prevState,
          error: "An unexpected error occurred",
        }))
      } finally {
        setState((prevState) => ({
          ...prevState,
          loading: {
            trending: false,
          },
        }))
      }
    }

    fetchData()
  }, [])

  return (
    <div className="mt-4 flex flex-col gap-2">
      <Link
        href={browse}
        className="group relative mb-2 ml-4 flex items-center text-sm font-medium uppercase transition-all md:ml-6 xl:text-base"
      >
        <div className="mr-2 h-6 w-1 rounded-md bg-primary md:w-2"></div>
        {seasonalTitle}
        <FaArrowRightLong className="ml-2 transition-all group-hover:translate-x-1" />
      </Link>
      <Carousel
        opts={{
          align: "start",
        }}
        className="relative w-full"
      >
        <CarouselContent className="relative ml-2 md:ml-5">
          {results.map((result) => (
            <CarouselItem
              key={result.id}
              className="basis-[155px] md:basis-[185px]"
            >
              <div
                key={result.id}
                className="col-span-1 overflow-hidden rounded-md"
              >
                <CardRow results={result} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-1 h-8 w-8" />
        <CarouselNext className="absolute right-1 h-8 w-8" />
      </Carousel>
    </div>
  )
}

export default Row
