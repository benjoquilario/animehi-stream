import { useRef, useEffect } from "react"
import Hls from "hls.js"
import Artplayer from "artplayer"
import artplayerPluginHlsQuality from "artplayer-plugin-hls-quality"

const ArtPlayer = () => {
  const artRef = useRef(null)

  function playM3u8(video, url, art) {
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
    console.log("Render useEffect-video-player")
    const art = new Artplayer({
      ...option,
      container: artRef.current,
      url: videoLink,
      poster: poster,
      customType: {
        m3u8: function (video: HTMLMediaElement, url: string) {
          if (Hls.isSupported()) {
            const hls = new Hls()
            hls.loadSource(url)
            hls.attachMedia(video)
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url
          } else {
            art.notice.show = "Hls is not supported"
          }
        },
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
      quality: handleQuality(),
      title: ,
      autoSize: false,
      autoOrientation: false,
      volume: 0.5,
      isLive: false,
      muted: false,
      autoplay: true,
      pip: true,
      autoMini: true,
      screenshot: false,
      setting: true,
      loop: false,
      flip: false,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: false,
      subtitleOffset: true,
      miniProgressBar: true,
      mutex: true,
      backdrop: true,
      playsInline: true,
      autoPlayback: true,
      airplay: true,
      theme: "#6a55fa",
      lang: navigator.language.toLowerCase(),
      whitelist: ["*"],
      moreVideoAttr: {
        crossOrigin: "anonymous",
      },
      thumbnails: {
        url: "",
        number: 60,
        column: 10,
      },
      icons: {
        loading:
          '<img class="animate-spin text-white h-12 h-12" src="/loading.svg">',
        setting: '<img class="h-6 h-6" src="/setting.svg">',
        volume: '<img class="h-6 h-6" src="/volume.svg">',
      },
    })

    if (getInstance && typeof getInstance === "function") {
      getInstance(art)
    }

    art.on("aspectRatio", (...args) => {
      art.storage.set("aspectRatio", args[0])
    })

    art.on("playbackRate", (...args) => {
      art.storage.set("playBackRate", args[0])
    })

    art.on("ready", () => {
      art.aspectRatio = art.storage.get("aspectRatio")
      art.playbackRate = art.storage.get("playBackRate")
    })

    return () => {
      if (art && art.destroy) {
        art.destroy(false)
      }
    }
  }, [])

  return <div>ArtPlayer</div>
}

export default ArtPlayer
