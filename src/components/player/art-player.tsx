"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"

import { type Player } from "artplayer/types/player"
import type Artplayer from "artplayer/types/artplayer"
import { VideoPlayer } from "./artplayer/art-player"
import Option from "artplayer/types/option"

import type { Source, SourcesResponse } from "types/types"

type WatchProps = {
  sourcesPromise: Promise<SourcesResponse | undefined>
}

import { notFound } from "next/navigation"

const ArtPlayerComponent = ({ sourcesPromise }: WatchProps) => {
  const [url, setUrl] = useState("")
  const [sources, setSources] = useState<Source[] | undefined>(undefined)

  function getSelectedSrc(selectedQuality?: string): string {
    const selectedSrc = sources?.find(
      (src) => src.quality === selectedQuality
    ) as Source
    if (!selectedSrc) return ""

    return selectedSrc.url
  }

  useEffect(() => {
    if (!sourcesPromise) return

    sourcesPromise.then((res) => (res ? setSources(res.sources) : notFound()))

    const selectedSrc = sources?.find(
      (src) => src.quality === "default"
    ) as Source
    if (!selectedSrc) return

    setUrl(selectedSrc.url)
  }, [sources])

  const option = {
    url: url,
    autoplay: true,
    autoSize: false,
    fullscreen: true,
    autoOrientation: true,
    //  icons: icons,
    setting: true,
    screenshot: true,
    hotkey: true,
    pip: true,
    airplay: true,
    lock: true,
  }

  function getInstance(art: Artplayer) {
    art.on("video:ended", () => {
      console.log("Ended")
    })
  }

  return <VideoPlayer option={option} getInstance={getInstance} />
}

export default ArtPlayerComponent
