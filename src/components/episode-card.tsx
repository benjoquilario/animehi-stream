"use client"

import Link from "next/link"
import type { AnifyRecentEpisode, RecentEpisode } from "types/types"
import { BsFillPlayFill, BsPlayFill } from "react-icons/bs"
import NextImage from "./ui/image"
import { memo } from "react"

type EpisodeCardProps = {
  animeResult: RecentEpisode
}

const EpisodeCard = ({ animeResult }: EpisodeCardProps) => {
  const episodeNumber = animeResult.episodeId.split("-").slice(-1).join()
  const animeId = animeResult.episodeId
    .split("-")
    .slice(0, -1)
    .join("-")
    .replace("-episode", "")

  return (
    <>
      <div className="relative mb-2 w-full overflow-hidden rounded-md pb-[140%]">
        <div className="absolute left-0 top-0 rounded text-xs font-semibold">
          HD
        </div>
        <div className="absolute bottom-0 left-2 z-[80] flex w-full justify-between py-2 shadow-lg">
          <div className="flex items-center text-sm md:text-base">
            <BsPlayFill />
            <h2>Episode {episodeNumber}</h2>
          </div>
        </div>
        <div className="absolute h-full w-full">
          <NextImage
            containerclassname="relative"
            style={{ objectFit: "cover" }}
            src={animeResult.image}
            alt={animeResult.title.english ?? animeResult.title.romaji}
            width={180}
            height={200}
            className="relative h-full w-full"
          />
        </div>
        <Link
          href={`/watch${animeId}/${animeResult.id}?episode=${episodeNumber}`}
          aria-label={animeResult.id}
          className="absolute inset-0 z-50 flex items-center justify-center bg-background/70 text-primary opacity-0 transition-opacity hover:opacity-100"
        >
          <BsFillPlayFill className="h-12 w-12" />
        </Link>
        <div className="absolute bottom-0 z-30 h-1/4 w-full bg-gradient-to-t from-background/80 from-25% to-transparent transition-all duration-300 ease-out group-hover:to-background/40"></div>
      </div>
      <div>
        <h3
          title={animeResult.title.english ?? animeResult.title.romaji}
          className="line-clamp-2 text-center text-xs font-medium leading-5 md:text-sm"
        >
          {animeResult.title.english ?? animeResult.title.romaji}
        </h3>
      </div>
    </>
  )
}

export default memo(EpisodeCard)
