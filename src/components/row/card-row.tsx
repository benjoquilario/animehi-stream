"use client"

import React from "react"
import { BsFillPlayFill, BsPlayFill } from "react-icons/bs"
import { IAdvancedInfo } from "types/types"
import NextImage from "@/components/ui/image"
import Link from "next/link"
import { transformedTitle } from "@/lib/utils"

type CardRowProps = {
  results: IAdvancedInfo
}

const CardRow = ({ results }: CardRowProps) => {
  return (
    <>
      <div className="relative mb-2 w-full overflow-hidden rounded-md pb-[140%]">
        <div className="absolute h-full w-full">
          <NextImage
            classnamecontainer="relative"
            style={{ objectFit: "cover" }}
            src={results.image}
            alt={results.title.english ?? results.title.romaji}
            width={180}
            height={200}
            className="group/item relative h-full w-full"
          />
        </div>
        <Link
          href={`/anime/${transformedTitle(results.title.romaji ?? results.title.english)}/${results.id}`}
          aria-label={results.id}
          className="absolute inset-0 z-50 flex items-center justify-center bg-background/70 text-primary opacity-0 transition-opacity hover:opacity-100 group-hover/item:scale-105"
        >
          <BsFillPlayFill className="h-12 w-12" />
        </Link>
        <div className="absolute bottom-0 z-30 h-1/4 w-full bg-gradient-to-t from-background/80 from-25% to-transparent transition-all duration-300 ease-out group-hover:to-background/40"></div>
      </div>
      <div className="grid grid-cols-[15px_1fr] items-start">
        <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-green-500"></div>
        <h3
          title={results.title.english ?? results.title.romaji}
          className="line-clamp-2  text-left text-xs font-medium leading-5 md:text-sm"
        >
          {results.title.english ?? results.title.romaji}
        </h3>
      </div>
    </>
  )
}

export default CardRow
