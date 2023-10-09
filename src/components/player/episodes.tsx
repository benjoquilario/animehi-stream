"use client"

import type { Episode } from "types/types"
import { chunk, cn } from "@/lib/utils"
import EpisodeChunk from "./episode-chunk"
import { useMemo, useState } from "react"
import { Button, buttonVariants } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"
import Link from "next/link"
import { Input } from "../ui/input"

type EpisodesProps = {
  fullEpisodes: Episode[]
  episodeId: string
  animeId: string
}

export default function Episodes({
  fullEpisodes,
  episodeId,
  animeId,
}: EpisodesProps) {
  const currentEpisode = useMemo(
    () => fullEpisodes?.find((episode: Episode) => episode?.id === episodeId),
    [fullEpisodes]
  )

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <h3>Episode List</h3>
        <div>
          <Input type="text" placeholder="ep. number" />
        </div>
      </div>
      <ScrollArea className="max-h-[25rem] w-full rounded-md">
        <div className="episode-grid relative py-3 pr-3">
          {fullEpisodes.map((episode) => (
            <Link
              key={episode.id}
              className={buttonVariants({
                variant: "secondary",
                className: cn(
                  "border-l-2 border-primary",
                  currentEpisode?.number === episode.number
                    ? "bg-primary"
                    : "bg-secondary"
                ),
              })}
              href={`/watch/${animeId}/${episode.id}`}
            >
              Ep. {episode.number}
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
