"use client"

import { Episode, IEpisode } from "types/types"
import { Button } from "./ui/button"
import { useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { AiFillForward, AiFillBackward } from "react-icons/ai"
import useEpisodes from "@/hooks/useEpisodes"

type ButtonActionProps = {
  episodeId: string
  animeId: string
  children: React.ReactNode
  anilistId: string
}

const ButtonAction = ({
  episodeId,
  animeId,
  children,
  anilistId,
}: ButtonActionProps) => {
  const router = useRouter()
  const { data: episodes, isLoading } = useEpisodes<IEpisode[]>(anilistId)

  const currentEpisode = useMemo(
    () => episodes?.find((episode) => episode.id === episodeId),
    [episodes, episodeId]
  )

  const handleNextEpisode = useCallback(() => {
    if (currentEpisode?.number === episodes?.length) return

    router.push(
      `/watch/${animeId}/${anilistId}/${Number(currentEpisode?.number) + 1}`
    )
  }, [episodes?.length, currentEpisode, router, animeId, anilistId])

  const handlePrevEpisode = useCallback(() => {
    if (currentEpisode?.number === 1) return

    router.push(
      `/watch/${animeId}/${anilistId}/${Number(currentEpisode?.number) - 1}`
    )
  }, [currentEpisode, router, animeId, anilistId])

  const currentEpisodeIndex = useMemo(
    () => episodes?.findIndex((episode) => episode.id === episodeId),
    [episodes, episodeId]
  )

  const isNextEpisode = useMemo(
    () => currentEpisode?.number === episodes?.length,
    [currentEpisode, episodes]
  )

  const isPrevEpisode = useMemo(
    () => currentEpisode?.number === 1,
    [currentEpisode]
  )

  return (
    <>
      <div className="text-sm">
        Auto Next <button className="text-primary">Off</button>
      </div>
      <div className="flex items-center">
        <Button
          onClick={handlePrevEpisode}
          disabled={isPrevEpisode}
          aria-label="previous episode"
          className="flex h-3 items-center gap-1 bg-background px-2 text-sm text-foreground hover:bg-background"
        >
          <AiFillBackward className="h-5 w-5" />
          <span className="hidden md:block">Prev episode</span>
        </Button>
        <Button
          onClick={handleNextEpisode}
          disabled={isNextEpisode}
          aria-label="next episode"
          className="flex h-3 items-center gap-1 bg-background px-2 text-sm text-foreground hover:bg-background"
        >
          <span className="hidden md:block">Next episode</span>
          <AiFillForward className="h-5 w-5" />
        </Button>
        {children}
      </div>
    </>
  )
}

export default ButtonAction
