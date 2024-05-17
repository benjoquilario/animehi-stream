import dynamic from "next/dynamic"
import { watch } from "@/lib/consumet"

const OPlayer = dynamic(() => import("./csr"), { ssr: false })
import type { WatchProps } from "./csr"

export default async function VideoPlayer(props: WatchProps) {
  const {
    episodeId,
    nextEpisode,
    prevEpisode,
    animeId,
    episodeNumber,
    poster,
  } = props

  const sourcesPromise = await watch(`${animeId}-episode-${episodeNumber}`)

  // const watchHistory = await animeWatchById(animeId)

  return (
    <OPlayer
      sourcesPromise={sourcesPromise}
      episodeId={episodeId}
      nextEpisode={nextEpisode}
      prevEpisode={prevEpisode}
      animeId={animeId}
      episodeNumber={episodeNumber}
      poster={poster}
    />
  )
}
