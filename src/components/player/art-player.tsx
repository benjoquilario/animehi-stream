"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"

import { type Player } from "artplayer/types/player"
import type Artplayer from "artplayer/types/artplayer"
import { VideoPlayer } from "./artplayer/art-player"
import Option from "artplayer/types/option"
import { AspectRatio } from "../ui/aspect-ratio"

import type { Source, SourcesResponse } from "types/types"

type WatchProps = {
  sourcesPromise: Promise<SourcesResponse | undefined>
  data: SourcesResponse
}

import { notFound } from "next/navigation"
import { useWatchStore } from "@/store"

const ArtPlayerComponent = ({ sourcesPromise, data }: WatchProps) => {
  const [url, setUrl] = useWatchStore((store) => [store.url, store.setUrl])
  const [sources, setSources] = useWatchStore((store) => [
    store.sources,
    store.setSources,
  ])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    function compiler() {
      try {
        setIsLoading(true)
        if (!sourcesPromise) return

        sourcesPromise.then((res) =>
          res ? setSources(res.sources) : notFound()
        )

        const selectedSrc = sources?.find(
          (src) => src.quality === "default"
        ) as Source
        if (!selectedSrc) return

        setUrl(selectedSrc.url)
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
      }
    }

    compiler()

    return () => {
      setSources(undefined)
      setUrl("")
    }
  }, [sources])

  console.log(sources)

  function getInstance(art: Artplayer) {
    art.on("video:ended", () => {
      console.log("Ended")
    })
  }

  return (
    <AspectRatio ratio={16 / 9}>
      {url ? (
        <div className="h-full w-full">
          <VideoPlayer
            sourcesPromise={sourcesPromise}
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
