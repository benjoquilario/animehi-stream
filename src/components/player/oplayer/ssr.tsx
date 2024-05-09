import dynamic from "next/dynamic"

const OPlayer = dynamic(() => import("./csr"), { ssr: false })
import type { WatchProps } from "./csr"

export default async function VideoPlayer(props: WatchProps) {
  const {
    sourcesPromise,
    episodeId,
    nextEpisode,
    prevEpisode,
    animeId,
    episodeNumber,
    poster,
  } = props

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
