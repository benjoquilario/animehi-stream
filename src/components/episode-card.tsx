"use client"

import Link from "next/link"
import { BsFillPlayFill, BsPlayFill } from "react-icons/bs"
import NextImage from "./ui/image"
import { memo } from "react"
import { transformedTitle } from "@/lib/utils"

type EpisodeCardProps = {
  animeResult: IRecents
}

const EpisodeCard = ({ animeResult }: EpisodeCardProps) => {
  return (
    <>
      <div className="relative mb-2 w-full overflow-hidden rounded-md pb-[140%]">
        <div className="absolute left-0 top-0 rounded text-xs font-semibold">
          HD
        </div>
        <div className="absolute bottom-0 left-2 z-[80] flex w-full justify-between py-2 shadow-lg">
          <div className="flex items-center text-sm md:text-base">
            <BsPlayFill />
            <h2>Episode {animeResult.currentEpisode}</h2>
          </div>
        </div>
        <div className="absolute h-full w-full">
          <NextImage
            classnamecontainer="relative"
            style={{ objectFit: "cover" }}
            src={animeResult.coverImage}
            alt={animeResult.title.english ?? animeResult.title.romaji}
            width={180}
            height={200}
            className="group/item relative h-full w-full"
          />
        </div>
        <Link
          href={`/anime/${transformedTitle(animeResult.title.romaji ?? animeResult.title.english)}/${animeResult.id}`}
          aria-label={animeResult.id}
          className="absolute inset-0 z-50 flex items-center justify-center bg-background/70 text-primary opacity-0 transition-opacity hover:opacity-100 group-hover/item:scale-105"
        >
          <BsFillPlayFill className="h-12 w-12" />
        </Link>
        <div className="absolute bottom-0 z-30 h-1/4 w-full bg-gradient-to-t from-background/80 from-25% to-transparent transition-all duration-300 ease-out group-hover:to-background/40"></div>
      </div>
      <div className="grid grid-cols-[15px_1fr] items-start">
        <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-green-500"></div>
        <h3
          title={animeResult.title.english ?? animeResult.title.romaji}
          className="line-clamp-2  text-left text-xs font-medium leading-5 md:text-sm"
        >
          {animeResult.title.english ?? animeResult.title.romaji}
        </h3>
      </div>
    </>
  )
}

export default memo(EpisodeCard)
