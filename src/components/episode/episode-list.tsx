"use client"

import type { Episode } from "types/types"
import { memo } from "react"
import Link from "next/link"
import { Button, buttonVariants } from "../ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

type EpisodeListProps = {
  episodes: Episode[]
  currentEpisode?: Episode
  animeId: string
  anilistId: string
}

const EpisodeList = ({
  episodes,
  currentEpisode,
  animeId,
  anilistId,
}: EpisodeListProps) => {
  const router = useRouter()

  return (
    <div className="episode-grid relative py-3 pr-3">
      {episodes.map((episode) => (
        <Button
          key={episode.id}
          className={buttonVariants({
            variant: "secondary",
            className: cn(
              "rounded-xl border-l-2 border-primary",
              currentEpisode?.number === episode.number
                ? "!bg-primary hover:!bg-primary/80"
                : "!bg-secondary hover:!bg-secondary/80"
            ),
          })}
          onClick={() =>
            router.push(`/watch/${animeId}/${episode.number}/${anilistId}`)
          }
        >
          Ep. {episode.number}
        </Button>
      ))}
    </div>
  )
}

export default memo(EpisodeList)
