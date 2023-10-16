"use client"

import { type Option } from "artplayer/types/option"
import Hls from "hls.js"
import { useRef, useEffect } from "react"
import Artplayer from "artplayer"
import artplayerPluginHlsQuality from "artplayer-plugin-hls-quality"

type ArtPlayerProps = {
  option: Option
  getInstance: (...args: any) => void
}

const VideoPlayer = ({ option, getInstance, ...rest }: ArtPlayerProps) => {
  const artRef = useRef<HTMLDivElement | null>(null)

  function playM3u8(video: HTMLMediaElement, url: string, art: any) {
    if (Hls.isSupported()) {
      if (art.hls) art.hls.destroy()
      const hls = new Hls()
      hls.loadSource(url)
      hls.attachMedia(video)
      art.hls = hls
      art.on("destroy", () => hls.destroy())
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url
    } else {
      art.notice.show = "Unsupported playback format: m3u8"
    }
  }

  useEffect(() => {
    const art = new Artplayer({
      ...option,
      // @ts-expect-error
      container: artRef.current,
      type: "m3u8",
      customType: {
        m3u8: playM3u8,
      },
      plugins: [
        artplayerPluginHlsQuality({
          // Show quality in setting
          setting: true,

          // Get the resolution text from level
          getResolution: (level) => level.height + "P",

          // I18n
          title: "Quality",
          auto: "Auto",
        }),
      ],
    })

    if (getInstance && typeof getInstance === "function") {
      getInstance(art)
    }

    return () => {
      if (art && art.destroy) {
        art.destroy(false)
      }
    }
  }, [])

  return <div ref={artRef} {...rest} />
}

export { VideoPlayer }
