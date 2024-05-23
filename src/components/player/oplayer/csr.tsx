"use client"

// credits : https://github.com/OatsProgramming/miruTV/blob/master/app/watch/components/OPlayer/OPlayer.tsx
import Player from "@oplayer/core"
import OUI from "@oplayer/ui"
import OHls from "@oplayer/hls"
import { skipOpEd } from "@/lib/plugins"
import { type SourcesResponse, type Source, IEpisode } from "types/types"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { useSession } from "next-auth/react"
import { useWatchStore } from "@/store"
import { updateWatchlist } from "@/app/actions"
import useEpisodes from "@/hooks/useEpisodes"
import { useRef, useState, useEffect, useMemo, useCallback } from "react"
import useVideoSource from "@/hooks/useVideoSource"

export type WatchProps = {
  sourcesPromise: Promise<SourcesResponse>
  episodeId: string
  animeId: string
  episodeNumber: string
  poster: string
  anilistId: string
}

type Ctx = {
  ui: ReturnType<typeof OUI>
  hls: ReturnType<typeof OHls>
}

const plugins = [
  skipOpEd(),
  OUI({
    subtitle: { background: true },
    theme: {
      primaryColor: "#6d28d9",
    },
    screenshot: true,
    forceLandscapeOnFullscreen: true,
    autoFocus: true,
    slideToSeek: "long-touch",
  }),
  OHls({ forceHLS: true, withBitrate: true }),
]

export default function OPlayer(props: WatchProps) {
  const {
    sourcesPromise,
    episodeId,
    animeId,
    episodeNumber,
    poster,
    anilistId,
  } = props
  const { data: session } = useSession()
  const playerRef = useRef<Player<Ctx>>()
  const [sources, setSources] = useState<Source[] | undefined>(undefined)
  const isAutoNext = useWatchStore((store) => store.isAutoNext)
  const setDownload = useWatchStore((store) => store.setDownload)

  // const currentEpisode = useMemo(
  //   () => episodes?.find((episode) => episode.id === episodeId),
  //   [episodes, episodeId]
  // )
  // const nextEpisode = useMemo(() => {
  //   if (episodes && !isLoading) {
  //     if (Number(episodeNumber) === currentEpisode?.number) return episodeNumber

  //     const nextEpisodeNumber = episodes?.findIndex(
  //       (episode) => episode.number === Number(episodeNumber)
  //     )

  //     return String(nextEpisodeNumber + 2)
  //   }
  // }, [episodes, episodeNumber, isLoading])

  console.log(sources)

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

  useEffect(() => {
    if (!sourcesPromise) return

    sourcesPromise.then((res) => {
      if (res) {
        setSources(res.sources)
        setDownload(res.download)
      } else notFound
    })

    const updateWatchlistDb = async () => {
      await updateWatchlist({
        episodeId,
        nextEpisode: "1",
        prevEpisode: "1",
        episodeNumber,
        animeId,
      })
    }

    playerRef.current = Player.make("#oplayer", {
      autoplay: isAutoNext,
      playbackRate: 1,
    })
      .use(plugins)
      .on("ended", () => {
        updateWatchlistDb()
      })
      .on("timeupdate", ({ payload }) => {
        console.log("Timeupdate")
      })
      .on("pause", () => {
        console.log("Playing Pause")

        updateWatchlistDb()
      })
      .on("destroy", () => {
        updateWatchlistDb()
      })
      .on("abort", () => {
        updateWatchlistDb()
      })
      .create() as Player<Ctx>

    return () => {
      playerRef.current?.destroy()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const oplayer = playerRef.current

    if (!oplayer || !sources) return

    const { menu } = oplayer.context.ui

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
          res ? { src: res.url, poster } : notFound()
        )
      )
      .then(() => {
        ;(async () => {
          console.log("qqwqwq")
        })()
      })
      .catch((err) => console.log(err))
  }, [sources, episodeId, getSelectedSrc, poster])

  return (
    <AspectRatio ratio={16 / 9}>
      <div id="oplayer" />
      {/* <ReactPlayer plugins={plugins} ref={playerRef} source={} /> */}
    </AspectRatio>
  )
}
