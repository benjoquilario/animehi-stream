"use client"

import React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { IAdvancedInfo } from "types/types"
// import EpisodeCard from "../episode-card"
import CardRow from "./card-row"
import Link from "next/link"
import { FaArrowRightLong } from "react-icons/fa6"
import Section from "../section"

interface RowProps {
  browse: string
  results: IAdvancedInfo[]
  seasonalTitle: string
  isNextSeason?: boolean
}

const Row: React.FC<RowProps> = ({
  browse,
  results,
  seasonalTitle,
  isNextSeason = false,
}) => {
  return (
    <Section sectionName={seasonalTitle} className="mt-4 flex flex-col gap-2">
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
              className="basis-[125px] md:basis-[175px]"
            >
              <div
                key={result.id}
                className="col-span-1 overflow-hidden rounded-md"
              >
                <CardRow isNextSeason={isNextSeason} results={result} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-1 h-8 w-8" />
        <CarouselNext className="absolute right-1 h-8 w-8" />
      </Carousel>
    </Section>
  )
}

export default Row
