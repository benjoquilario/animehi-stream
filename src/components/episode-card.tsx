"use client"

import Link from "next/link"
import type { RecentEpisode } from "types/types"
import { BsFillPlayFill, BsPlayFill } from "react-icons/bs"
import NextImage from "./ui/image"
import { increment } from "@/app/actions"
import { useSession } from "next-auth/react"

type EpisodeCardProps = {
  animeResult: RecentEpisode
}

export default function EpisodeCard({ animeResult }: EpisodeCardProps) {
  return (
    <>
      <div className="relative mb-2 w-full overflow-hidden rounded-md pb-[140%]">
        <div className="absolute left-0 top-0 rounded text-xs font-semibold">
          HD
        </div>
        <div className="absolute bottom-2 left-2 z-[80] flex w-full justify-between shadow-lg">
          <div className="flex items-center">
            <BsPlayFill />
            <h2>Episode {animeResult.episodeNumber}</h2>
          </div>
        </div>
        <div className="absolute h-full w-full">
          <NextImage
            containerclassname="relative"
            style={{ objectFit: "cover" }}
            src={animeResult.image}
            alt={animeResult.title}
            width={180}
            height={200}
            className="relative h-full w-full"
          />
        </div>
        <Link
          href={`/watch/${animeResult.id}/${animeResult.episodeNumber}`}
          aria-label={animeResult.episodeId}
          className="absolute inset-0 z-50 flex items-center justify-center bg-background/70 text-primary opacity-0 transition-opacity hover:opacity-100"
        >
          <BsFillPlayFill className="h-12 w-12" />
        </Link>
        <div className="absolute bottom-0 z-30 h-1/4 w-full bg-gradient-to-t from-background/80 from-25% to-transparent transition-all duration-300 ease-out group-hover:to-background/40"></div>
      </div>
      <div>
        <h3
          title={animeResult.title}
          className="line-clamp-2 text-center text-xs font-semibold leading-5 md:text-sm"
        >
          {animeResult.title}
        </h3>
      </div>
    </>
  )
}
