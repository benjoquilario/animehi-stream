"use client"

import { type Option } from "artplayer/types/option"
import Hls from "hls.js"
import { useRef, useEffect, useMemo } from "react"
import Artplayer from "artplayer"
import artplayerPluginHlsQuality from "artplayer-plugin-hls-quality"
import { useWatchStore } from "@/store"
import { Source } from "types/types"
import useVideoSource from "@/hooks/useVideoSource"
import { AspectRatio } from "@/components/ui/aspect-ratio"

type ArtPlayerProps = {
  animeId: string
  episodeNumber: string
}

const VideoPlayer = ({ animeId, episodeNumber, ...rest }: ArtPlayerProps) => {
  const artRef = useRef<HTMLDivElement | null>(null)
  const url = useWatchStore((store) => store.url)

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

  function getInstance(art: Artplayer) {
    art.on("video:ended", () => {
      console.log("Ended")
    })
  }

  function playM3u8(video: HTMLMediaElement, url: string, art: any) {
    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(url)
      hls.attachMedia(video)
      hls.once(Hls.Events.MANIFEST_PARSED, function (event, data) {
        hls.startLevel = -1
      })
      art.hls = hls
      art.once("url", () => hls.destroy())
      art.on("destroy", () => hls.destroy())
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url
    } else {
      art.notice.show = "Unsupported playback format: m3u8"
    }
  }

  useEffect(() => {
    if (!artRef.current) return

    const art = new Artplayer({
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
      url: selectedSrc.url,
      customType: {
        m3u8: playM3u8,
      },
      plugins: [
        artplayerPluginHlsQuality({
          setting: true,
          title: "Quality",
          auto: "Auto",
        }),
      ],
      container: artRef.current,
    })

    if (getInstance && typeof getInstance === "function") {
      getInstance(art)
    }

    return () => {
      if (art && art.destroy) {
        art.destroy(false)
      }
    }
  }, [getInstance, sourceVideo, selectedSrc])

  return (
    <div>
      {!isLoading && url ? (
        <AspectRatio ratio={16 / 9}>
          <div className="h-full" ref={artRef} {...rest} />
        </AspectRatio>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}

export { VideoPlayer }
