"use client"

import dynamic from "next/dynamic"
const OPlayer = dynamic(() => import("./csr"), { ssr: false })
import type { WatchProps } from "./csr"
import { useWatchStore } from "@/store"
import EmbedPlayer from "./embedded"

export default function VideoPlayer(props: WatchProps) {
  const [sourceType, embeddedUrl] = useWatchStore((store) => [
    store.sourceType,
    store.embeddedUrl,
  ])
  const {
    sourcesPromise,
    episodeId,
    animeId,
    anilistId,
    episodeNumber,
    poster,
    title,
    malId,
  } = props

  // const watchHistory = await animeWatchById(animeId)

  return (
    <OPlayer
      sourcesPromise={sourcesPromise}
      episodeId={episodeId}
      animeId={animeId}
      episodeNumber={episodeNumber}
      poster={poster}
      anilistId={anilistId}
      title={title}
      malId={malId}
    />
  )
}
