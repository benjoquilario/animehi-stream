"use client"

// credits : https://github.com/OatsProgramming/miruTV/blob/master/app/watch/components/OPlayer/OPlayer.tsx
import Player from "@oplayer/core"
import OUI, { type Highlight, type MenuBar } from "@oplayer/ui"
import OHls from "@oplayer/hls"
import { skipOpEd } from "@/lib/plugins"
import { useRef, useState, useEffect, useCallback } from "react"
import type { SourcesResponse, Source } from "types/types"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"

type Ctx = {
  ui: ReturnType<typeof OUI>
  hls: ReturnType<typeof OHls>
}

const plugins = [skipOpEd(), OUI(), OHls()]

type WatchProps = {
  sourcesPromise: Promise<SourcesResponse | undefined>
  animeId: string
}

export function Watch({ sourcesPromise, animeId }: WatchProps) {
  const playerRef = useRef<Player<Ctx>>()
  const lst = useRef()
  const router = useRouter()
  const [sources, setSources] = useState<Source[] | undefined>(undefined)
  const [lastEpisode, setLastEpisode] = useState(lst.current ? lst.current : 1)

  function getSelectedSrc(selectedQuality: string): Promise<Source> {
    return new Promise((resolve, reject) => {
      const selectedSrc = sources!.find(
        (src) => src.quality === selectedQuality
      ) as Source
      if (!selectedSrc) reject("Selected quality source not found")
      resolve(selectedSrc)
    })
  }

  const handleNextEpisode = useCallback(() => {
    setLastEpisode(lastEpisode + 1)
    router.push(`/watch/${animeId}/${animeId}-episode-${lastEpisode + 1}`)
  }, [])

  useEffect(() => {
    if (!sourcesPromise) return

    sourcesPromise.then((res) => (res ? setSources(res.sources) : notFound()))

    playerRef.current = Player.make("#oplayer", {
      autoplay: true,
      playbackRate: 1,
    })
      .use(plugins)
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

  useEffect(() => {
    lst.current = lastEpisode as unknown as undefined
  }, [lastEpisode])

  return (
    <>
      <div id="oplayer" className="w-full bg-secondary" />
    </>
  )
}
