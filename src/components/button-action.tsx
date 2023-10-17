"use client"

import { Episode } from "types/types"
import { Button } from "./ui/button"
import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { AiFillForward, AiFillBackward } from "react-icons/ai"

type ButtonActionProps = {
  episodes?: Episode[]
  episodeId: string
  animeId: string
  children: React.ReactNode
}

const ButtonAction = ({
  episodes,
  episodeId,
  animeId,
  children,
}: ButtonActionProps) => {
  const router = useRouter()
  const currentEpisode = useMemo(
    () => episodes?.find((episode) => episode.id === episodeId),
    [episodes, episodeId]
  )

  const handleNextEpisode = () => {
    if (currentEpisode?.number === episodes?.length) return

    router.push(
      `/watch/${animeId}/${animeId}-episode-${
        Number(currentEpisode?.number) + 1
      }/${Number(currentEpisode?.number) + 1}`
    )
  }

  const handlePrevEpisode = () => {
    if (currentEpisode?.number === 1) return

    router.push(
      `/watch/${animeId}/${animeId}-episode-${
        Number(currentEpisode?.number) - 1
      }/${Number(currentEpisode?.number) - 1}`
    )
  }

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
      <Button
        onClick={handlePrevEpisode}
        disabled={isPrevEpisode}
        className="flex h-3 items-center gap-1 bg-background px-2 text-sm hover:bg-background"
      >
        <AiFillBackward className="h-5 w-5" />
        Prev episode
      </Button>
      <Button
        onClick={handleNextEpisode}
        disabled={isNextEpisode}
        className="flex h-3 items-center gap-1 bg-background px-2 text-sm hover:bg-background"
      >
        Next episode
        <AiFillForward className="h-5 w-5" />
      </Button>
      {children}
    </>
  )
}

export default ButtonAction
