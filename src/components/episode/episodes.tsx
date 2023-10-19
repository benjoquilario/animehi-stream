"use client"

import type { Episode } from "types/types"
import { chunk, cn } from "@/lib/utils"
import { useCallback, useMemo, useState } from "react"
import { ScrollArea } from "../ui/scroll-area"

import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import SearchEpisode from "../search-episode"
import EpisodeList from "./episode-list"
import Link from "next/link"
import { AiOutlineSearch } from "react-icons/ai"

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
  const [episodes, setEpisodes] = useState(fullEpisodes)
  const [query, setQuery] = useState("")

  const currentEpisode = useMemo(
    () => episodes?.find((episode: Episode) => episode?.id === episodeId),
    [episodes]
  )

  const handleSearchEpisode = useCallback(
    (episodeNumber: string) => {
      if (episodeNumber) {
        const filterEpisode = fullEpisodes?.filter(
          (episode) => episode.number === Number(episodeNumber)
        )
        setEpisodes(filterEpisode)
      } else {
        setEpisodes(fullEpisodes)
      }

      setQuery(episodeNumber)
    },
    [episodes]
  )

  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        <h3>
          Episode List <Badge>{fullEpisodes.length}</Badge>
        </h3>
        <div className="relative">
          <form>
            <SearchEpisode onChange={handleSearchEpisode} />

            <Link href={`/watch/${animeId}/${query}`}>
              <button
                className="absolute right-[5px] top-[6px] text-muted-foreground/80"
                type="submit"
              >
                <AiOutlineSearch className="h-6 w-6" />
              </button>
            </Link>
          </form>
        </div>
      </div>
      <ScrollArea
        className={cn(
          "h-[25rem] max-h-[25rem] w-full rounded-md",
          fullEpisodes.length > 18 ? "h-[25rem]" : "h-[7rem]"
        )}
      >
        <EpisodeList
          episodes={episodes}
          currentEpisode={currentEpisode}
          animeId={animeId}
        />
      </ScrollArea>
    </div>
  )
}
