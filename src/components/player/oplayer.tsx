"use client"

// credits : https://github.com/OatsProgramming/miruTV/blob/master/app/watch/components/OPlayer/OPlayer.tsx
import Player from "@oplayer/core"
import OUI, { type Highlight, type MenuBar } from "@oplayer/ui"
import OHls from "@oplayer/hls"
import { skipOpEd } from "@/lib/plugins"
import { useRef, useState, useEffect, useCallback, useMemo } from "react"
import type { SourcesResponse, Source, Episode } from "types/types"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { AspectRatio } from "../ui/aspect-ratio"
import Server from "../server"

type Ctx = {
  ui: ReturnType<typeof OUI>
  hls: ReturnType<typeof OHls>
}

const plugins = [
  skipOpEd(),
  OUI({
    autoFocus: true,
    screenshot: true,
    theme: {
      primaryColor: "#6d28d9",
    },
  }),
  OHls(),
]

type WatchProps = {
  sourcesPromise: Promise<SourcesResponse | undefined>
  episodes?: Episode[]
  animeId: string
  episodeId: string
  episodeNumber: string
}

export function OPlayer({
  sourcesPromise,
  animeId,
  episodes,
  episodeNumber,
  episodeId,
}: WatchProps) {
  const playerRef = useRef<Player<Ctx>>()
  const lst = useRef()
  const router = useRouter()
  const [sources, setSources] = useState<Source[] | undefined>(undefined)

  const currentEpisode = useMemo(
    () => episodes?.find((episode) => episode.id === episodeId),
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

  console.log(isNextEpisode, isPrevEpisode)

  const currentEpisodeIndex = useMemo(
    () => episodes?.findIndex((episode) => episode.id === episodeId),
    [episodes, episodeId]
  )

  function getSelectedSrc(selectedQuality: string): Promise<Source> {
    return new Promise((resolve, reject) => {
      const selectedSrc = sources!.find(
        (src) => src.quality === selectedQuality
      ) as Source
      if (!selectedSrc) reject("Selected quality source not found")
      resolve(selectedSrc)
    })
  }

  function handleNextEpisode() {
    if (currentEpisode?.number === episodes?.length) return

    router.push(
      `/watch/${animeId}/${animeId}-episode-${
        Number(currentEpisode?.number) + 1
      }`
    )
  }

  function handlePrevEpisode() {
    if (currentEpisode?.number === 1) return

    router.push(
      `/watch/${animeId}/${animeId}-episode-${
        Number(currentEpisode?.number) - 1
      }`
    )
  }

  useEffect(() => {
    if (!sourcesPromise) return

    sourcesPromise.then((res) => (res ? setSources(res.sources) : notFound()))

    playerRef.current = Player.make("#oplayer", {
      autoplay: true,
      playbackRate: 1,
    })
      .use(plugins)
      .on("ended", () => {
        handleNextEpisode()
      })
      .on("aut")
      .create() as Player<Ctx>

    return () => {
      playerRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    const oplayer = playerRef.current

    if (!oplayer || !sources) return

    const { menu } = oplayer.context.ui

    const menuBar: MenuBar = {
      name: "Quality",
      children: sources?.map((source) => ({
        name: source.quality,
        value: source.quality,
        default: source.quality === "default",
      })),
      onChange: ({ value }) => {
        if (!playerRef.current) return

        playerRef.current
          .changeSource(
            getSelectedSrc(value).then((res) =>
              res ? { src: res.url } : notFound()
            )
          )
          .catch((err) => console.log(err))
      },
    }

    menu.unregister("Source")
    menu.register(menuBar)

    oplayer
      .changeSource(
        getSelectedSrc("default").then((res) =>
          res ? { src: res.url } : notFound()
        )
      )
      .catch((err) => console.log(err))
  }, [sources, playerRef.current])

  return (
    <>
      <AspectRatio ratio={16 / 9}>
        <div id="oplayer" className="w-full bg-secondary" />
      </AspectRatio>
      <Server
        nextEpisode={handleNextEpisode}
        prevEpisode={handlePrevEpisode}
        isPrevEpisode={isPrevEpisode}
        isNextEpisode={isNextEpisode}
        currentEpisodeIndex={Number(currentEpisodeIndex) + 1}
      />
    </>
  )
}
