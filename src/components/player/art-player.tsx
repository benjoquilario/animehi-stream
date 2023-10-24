"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"

import { type Player } from "artplayer/types/player"
import type Artplayer from "artplayer/types/artplayer"
import { VideoPlayer } from "./artplayer/art-player"
import Option from "artplayer/types/option"
import { AspectRatio } from "../ui/aspect-ratio"

import type { Source, SourcesResponse } from "types/types"

type WatchProps = {
  animeId: string
  episodeNumber: string
}

import { notFound } from "next/navigation"
import { useWatchStore } from "@/store"
import { watch } from "@/lib/consumet"
import useVideoSource from "@/hooks/useVideoSource"

const ArtPlayerComponent = ({ animeId, episodeNumber }: WatchProps) => {
  const { data: sourceVideo, isLoading } = useVideoSource({
    episodeId: `${animeId}-episode-${episodeNumber}`,
  })
  const [resetSources, setSources] = useWatchStore((store) => [
    store.resetSources,
    store.setSources,
  ])

  const setUrl = useWatchStore((store) => store.setUrl)

  const sources = useMemo(
    () => (!sourceVideo?.sources?.length ? null : sourceVideo?.sources),
    [sourceVideo?.sources]
  )

  const selectedSrc = useMemo(
    () => sources?.find((src: Source) => src.quality === "default") as Source,
    [sources]
  )

  // useEffect(() => {
  //   setSources(sources)
  //   const selectedSrc = sources?.find(
  //     (src: Source) => src.quality === "default"
  //   ) as Source

  //   setUrl(selectedSrc?.url)
  // }, [sourceVideo])

  function getInstance(art: Artplayer) {
    art.on("video:ended", () => {
      console.log("Ended")
    })
  }

  return (
    <AspectRatio ratio={16 / 9}>
      {!isLoading ? (
        <div className="h-full w-full">
          <VideoPlayer
            // @ts-ignore
            option={{
              setting: true,
              muted: false,
              autoplay: true,
              pip: false,
              autoSize: true,
              autoMini: true,
              screenshot: true,
              flip: true,
              playbackRate: true,
              aspectRatio: true,
              fullscreen: true,
              fullscreenWeb: true,
              subtitleOffset: true,
              miniProgressBar: true,
              mutex: true,
              backdrop: true,
              playsInline: true,
              volume: 1,
              airplay: false,
              // lang: navigator.language.toLowerCase(),
              // whitelist: ["*"],
              moreVideoAttr: {
                crossOrigin: "anonymous",
              },
            }}
            getInstance={getInstance}
          />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </AspectRatio>
  )
}

export default ArtPlayerComponent
