"use client"

import { Episode, IEpisode } from "types/types"
import { Button } from "./ui/button"
import { useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { AiFillForward, AiFillBackward } from "react-icons/ai"
import useEpisodes from "@/hooks/useEpisodes"
import useLastPlayed from "@/hooks/useLastPlayed"

type ButtonActionProps = {
  episodeId: string
  animeId: string
  anilistId: string
  lastEpisode: number
  update: (id: string, i: number, d: number) => void
}

const ButtonAction = ({
  episodeId,
  animeId,
  anilistId,
  lastEpisode,
  update,
}: ButtonActionProps) => {
  const { data: episodes, isLoading } = useEpisodes<IEpisode[]>(anilistId)

  const currentEpisode = useMemo(
    () => episodes?.find((episode) => episode.id === episodeId),
    [episodes, episodeId]
  )

  const latestEpisodeNumber = useMemo(() => episodes?.length, [episodes])

  return (
    <>
      <Button
        onClick={() => update(anilistId, lastEpisode - 1, 0)}
        disabled={lastEpisode === 1 || isLoading}
        aria-label="previous episode"
        className="flex h-3 items-center gap-1 bg-background px-2 text-sm text-foreground transition-all hover:bg-background active:scale-[.98]"
      >
        <AiFillBackward className="h-5 w-5" />
        <span className="hidden md:block">Prev episode</span>
      </Button>
      <Button
        onClick={() => update(anilistId, lastEpisode + 1, 0)}
        disabled={lastEpisode === latestEpisodeNumber || isLoading}
        aria-label="next episode"
        className="flex h-3 items-center gap-1 bg-background px-2 text-sm text-foreground transition-all hover:bg-background active:scale-[.98]"
      >
        <span className="hidden md:block">Next episode</span>
        <AiFillForward className="h-5 w-5" />
      </Button>
    </>
  )
}

export default ButtonAction
