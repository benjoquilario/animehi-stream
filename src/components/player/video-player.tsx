"use client"

import { AspectRatio } from "../ui/aspect-ratio"
import OPlayer, { Player, PlayerEvent } from "./oplayer"
import { type SourcesResponse, type Source, IEpisode } from "types/types"
import { useWatchStore } from "@/store"
import useEpisodes from "@/hooks/useEpisodes"
import { updateWatchlist } from "@/app/actions"
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { notFound } from "next/navigation"

type VideoPlayerProps = {
  episodeId: string
  sourcesPromise: Promise<SourcesResponse>
  anilistId: string
  episodeNumber: string
  poster: string
  title: string
  animeId: string
}

const VideoPlayer = ({
  episodeId,
  sourcesPromise,
  anilistId,
  episodeNumber,
  poster,
  title,
  animeId,
}: VideoPlayerProps) => {
  const [sources, _] = useState<Source[]>([])
  const playerRef = useRef<Player>(null)
  const setDownload = useWatchStore((store) => store.setDownload)
  const { data: episodes, isLoading } = useEpisodes<IEpisode[]>(anilistId)
  const [source, setSource] = useState<{
    src: string
    title: string
    poster: string
  }>({ title: "", poster: "", src: "" })

  const currentEpisode = useMemo(
    () => episodes?.find((episode) => episode.id === episodeId),
    [episodes, episodeId]
  )

  const getSelectedSrc = useCallback(
    (selectedQuality: string): Promise<Source> => {
      return new Promise((resolve, reject) => {
        const selectedSrc = sources!.find(
          (src) => src.quality === selectedQuality
        ) as Source
        if (!selectedSrc) reject("Selected quality source not found")
        resolve(selectedSrc)
      })
    },
    [sources]
  )

  console.log(source)

  useEffect(() => {
    if (!sourcesPromise) return

    sourcesPromise.then((res) => {
      if (!res) return

      _(res.sources)

      if (sources) {
        const selectedSrc = sources!.find(
          (src) => src.quality === "default"
        ) as Source

        setSource({
          src: selectedSrc.url,
          poster: currentEpisode?.image ?? poster ?? "",
          title: `${title} / Episosde ${episodeNumber}`,
        })
      }
    })
  }, [
    currentEpisode?.image,
    episodeNumber,
    poster,
    sources,
    sourcesPromise,
    title,
  ])

  useEffect(() => {
    const oplayer = playerRef.current

    if (!oplayer || !sources) return

    const forward = document.createElement("button")

    forward.className = "forward"
    forward.setAttribute("aria-label", "forward")
    forward.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.444 3.685A10 10 0 0 1 18 4h-2v2h4a1 1 0 0 0 1-1V1h-2v1.253A12 12 0 1 0 24 12h-2A10 10 0 1 1 6.444 3.685ZM22 4v3h-3v2h4a1 1 0 0 0 1-1V4h-2Zm-9.398 11.576c.437.283.945.424 1.523.424s1.083-.141 1.513-.424c.437-.29.774-.694 1.009-1.215.235-.527.353-1.148.353-1.861 0-.707-.118-1.324-.353-1.851-.235-.527-.572-.932-1.009-1.215-.43-.29-.935-.434-1.513-.434-.578 0-1.086.145-1.523.434-.43.283-.764.688-.999 1.215-.235.527-.353 1.144-.353 1.851 0 .713.118 1.334.353 1.86.236.522.568.927.999 1.216Zm2.441-1.485c-.222.373-.528.56-.918.56s-.696-.187-.918-.56c-.222-.38-.333-.91-.333-1.591 0-.681.111-1.208.333-1.581.222-.38.528-.57.918-.57s.696.19.918.57c.222.373.333.9.333 1.581 0 .681-.111 1.212-.333 1.59Zm-6.439-3.375v5.14h1.594V9.018L7 9.82v1.321l1.604-.424Z" fill="currentColor"></path></svg>'
    forward.onclick = function () {
      oplayer.seek(oplayer.currentTime + 10)
    }

    const backward = document.createElement("button")

    backward.className = "backward"
    forward.setAttribute("aria-label", "backward")
    backward.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.02 2.048A10 10 0 1 1 2 12H0a12 12 0 1 0 5-9.747V1H3v4a1 1 0 0 0 1 1h4V4H6a10 10 0 0 1 5.02-1.952ZM2 4v3h3v2H1a1 1 0 0 1-1-1V4h2Zm12.125 12c-.578 0-1.086-.141-1.523-.424-.43-.29-.764-.694-.999-1.215-.235-.527-.353-1.148-.353-1.861 0-.707.118-1.324.353-1.851.236-.527.568-.932.999-1.215.437-.29.945-.434 1.523-.434s1.083.145 1.513.434c.437.283.774.688 1.009 1.215.235.527.353 1.144.353 1.851 0 .713-.118 1.334-.353 1.86-.235.522-.572.927-1.009 1.216-.43.283-.935.424-1.513.424Zm0-1.35c.39 0 .696-.186.918-.56.222-.378.333-.909.333-1.59s-.111-1.208-.333-1.581c-.222-.38-.528-.57-.918-.57s-.696.19-.918.57c-.222.373-.333.9-.333 1.581 0 .681.111 1.212.333 1.59.222.374.528.56.918.56Zm-5.521 1.205v-5.139L7 11.141V9.82l3.198-.8v6.835H8.604Z" fill="currentColor"></path></svg>'
    backward.onclick = function () {
      oplayer.seek(oplayer.currentTime - 10)
    }

    oplayer.$root.appendChild(forward)
    oplayer.$root.appendChild(backward)

    oplayer
      .changeSource(
        getSelectedSrc("default").then((res) =>
          res
            ? {
                src: res.url,
                poster: currentEpisode?.image ?? poster,
                title: `${title} / Episode ${episodeNumber}`,
              }
            : notFound()
        )
      )
      .then(() => {
        ;(async () => {
          console.log("qqwqwq")
        })()
      })
      .catch((err) => console.log(err))
  }, [
    getSelectedSrc,
    episodeId,
    sources,
    poster,
    title,
    currentEpisode?.image,
    episodeNumber,
  ])

  async function watchDB() {
    await updateWatchlist({
      episodeId,
      nextEpisode: "1",
      prevEpisode: "1",
      episodeNumber,
      animeId,
    })
  }

  const onEvent = useCallback(({ type, payload }: PlayerEvent) => {
    console.log(type, payload)
  }, [])

  return (
    <AspectRatio ratio={16 / 9}>
      <OPlayer
        // ref={playerRef}
        autoplay={true}
        source={source}
        onEvent={onEvent}
        // duration={lastDuration}
        // isLive={id == "iptv" || document.location.search.includes("live")}
      />
    </AspectRatio>
  )
}

export default VideoPlayer
