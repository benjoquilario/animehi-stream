"use client"

import type { Episode } from "types/types"
import { chunk, cn } from "@/lib/utils"
import EpisodeChunk from "./episode-chunk"
import { useMemo, useState } from "react"
import { Button, buttonVariants } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"
import Link from "next/link"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"

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
      <div className="mb-2 flex items-center justify-between">
        <h3>
          Episode List <Badge>{fullEpisodes.length}</Badge>
        </h3>
        <div>
          <Input type="text" placeholder="ep. number" />
        </div>
      </div>
      <ScrollArea
        className={cn(
          "h-[25rem] max-h-[25rem] w-full rounded-md",
          fullEpisodes.length > 18 ? "h-[25rem]" : "h-[7rem]"
        )}
      >
        <div className="episode-grid relative py-3 pr-3">
          {fullEpisodes.map((episode) => (
            <Link
              key={episode.id}
              className={buttonVariants({
                variant: "secondary",
                className: cn(
                  "border-l-2 border-primary",
                  currentEpisode?.number === episode.number
                    ? "!bg-primary"
                    : "!bg-secondary hover:bg-secondary/80"
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
