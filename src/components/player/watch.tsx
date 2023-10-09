"use client"

// credits : https://github.com/OatsProgramming/miruTV/blob/master/app/watch/components/OPlayer/OPlayer.tsx
import Player from "@oplayer/core"
import ui, { type Highlight, type MenuBar } from "@oplayer/ui"
import hls from "@oplayer/hls"
import { skipOpEd } from "@/lib/plugins"
import { useRef, useState, useEffect, useCallback } from "react"
import type { SourcesResponse, Source } from "types/types"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"

const plugins = [
  skipOpEd(),
  ui({
    pictureInPicture: true,
    slideToSeek: "always",
    screenshot: false,
    keyboard: { global: true },
    theme: {
      primaryColor: "#e11d48",
    },
    icons: {
      setting:
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>',
    },
  }),
  hls(),
]

type WatchProps = {
  sourcesPromise: Promise<SourcesResponse | undefined>
  animeId: string
}

export function Watch({ sourcesPromise, animeId }: WatchProps) {
  const playerRef = useRef<Player>()
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
      .create() as Player

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

  return <div id="oplayer" className="w-full" />
}
