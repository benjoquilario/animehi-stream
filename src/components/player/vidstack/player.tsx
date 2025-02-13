"use client"

// https://github.com/Miruro-no-kuon/Miruro/blob/main/src/components/Watch/Video/Player.tsx
import "@vidstack/react/player/styles/default/theme.css"
import "@vidstack/react/player/styles/default/layouts/video.css"
import { useEffect, useRef, useState, useMemo, useCallback, use } from "react"
import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  Poster,
  Track,
  TextTrack,
  type MediaProviderAdapter,
  type MediaProviderChangeEvent,
  type MediaPlayerInstance,
} from "@vidstack/react"
import type { IAnilistInfo, IEpisode, Source } from "types/types"
import {
  increment,
  createViewCounter,
  createWatchlist,
  updateWatchlist,
} from "@/server/anime"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useStore } from "zustand"
import { useAutoSkip, useAutoNext, useAutoPlay } from "@/store"
import { env } from "@/env.mjs"
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default"
import { Button } from "@/components/ui/button"
import {
  fetchAnimeGogoUrlLink,
  fetchSkipTimes,
  fetchZoroUrlLink,
} from "@/lib/cache"
import { useWatchStore } from "@/store"
import { AniSkipResult, AniSkip } from "types/types"
import useVideoSource from "@/hooks/useVideoSource"

type VidstackPlayerProps = {
  episodeNumber: number
  animeResponse: IAnilistInfo
  currentEpisode?: IEpisode
  anilistId: string
  latestEpisodeNumber: number
  title: string
  episodeId: string
  malId: string
  banner: string
  provider: string
  type: string
  thumbnail?: string
  subtitle?: string
  videoUrl: string
}

const VidstackPlayer = (props: VidstackPlayerProps) => {
  const {
    episodeId,
    episodeNumber,
    animeResponse,
    currentEpisode,
    anilistId,
    latestEpisodeNumber,
    title,
    malId,
    provider,
    type,
    banner,
    thumbnail,
    subtitle,
    videoUrl,
  } = props
  const { data: session } = useSession()
  const router = useRouter()
  const player = useRef<MediaPlayerInstance>(null)
  // const { duration } = useMediaStore(player)
  const animeVideoTitle = title
  const posterImage = banner
  const [skipTimes, setSkipTimes] = useState<AniSkipResult[]>([])
  const [totalDuration, setTotalDuration] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<number>(0)
  // const [isLoading, setIsLoading] = useState(false)

  const autoSkip = useStore(
    useAutoSkip,
    (store: any) => store.autoSkip as boolean
  )
  const autoPlay = useStore(
    useAutoPlay,
    (store: any) => store.autoPlay as boolean
  )

  const autoNext = useStore(
    useAutoNext,
    (store: any) => store.autoNext as boolean
  )
  const [opButton, setOpButton] = useState(false)
  const [otButton, setEdButton] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  let intervalId: NodeJS.Timeout

  useEffect(() => {
    const updateViews = async function () {
      return await increment(anilistId, latestEpisodeNumber)
    }

    updateViews()
  }, [anilistId, latestEpisodeNumber])

  useEffect(() => {
    if (isPlaying) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      intervalId = setInterval(async function () {
        if (currentEpisode && anilistId) {
          await updateWatchlist({
            episodeId: episodeId,
            episodeNumber: `${episodeNumber}`,
            anilistId,
            image: currentEpisode.image ?? animeResponse.image,
          })
        }

        if (session) {
          if (anilistId && currentEpisode) {
            await createWatchlist({
              animeId: currentEpisode.id,
              episodeNumber: `${episodeNumber}`,
              title: animeResponse.title.english ?? animeResponse.title.romaji,
              image: currentEpisode?.image ?? animeResponse.image,
              anilistId,
            })
          }
        }

        if (currentEpisode) {
          await createViewCounter({
            animeId: currentEpisode.id,
            title: animeResponse.title.english ?? animeResponse.title.romaji,
            image: animeResponse.image,
            latestEpisodeNumber,
            anilistId,
          })
        }
      }, 5000)
    } else {
      clearInterval(intervalId)
    }

    return () => {
      clearInterval(intervalId)
    }
  }, [session, isPlaying, totalDuration])

  useEffect(() => {
    if (player.current && currentTime) {
      player.current.currentTime = currentTime
    }
  }, [currentTime])

  function onProviderChange(
    provider: MediaProviderAdapter | null,
    _nativeEvent: MediaProviderChangeEvent
  ) {
    if (isHLSProvider(provider)) {
      provider.config = {}
    }
  }

  function onLoadedMetadata() {
    if (player.current) {
      setTotalDuration(player.current.duration)
    }
  }

  function onTimeUpdate() {
    if (player.current && currentEpisode) {
      const currentTime = player.current.currentTime
      const duration = player.current.duration || 1
      const playbackPercentage = (currentTime / duration) * 100
      const _ = {
        currentTime,
        playbackPercentage,
      }

      if (skipTimes && skipTimes.length > 0) {
        const opStart = skipTimes[0]?.interval.startTime ?? 0
        const opEnd = skipTimes[0]?.interval.endTime ?? 0

        const epStart = skipTimes[1]?.interval.startTime ?? 0
        const epEnd = skipTimes[1]?.interval.endTime ?? 0

        const opButtonText = skipTimes[0]?.skipType
        const edButtonText = skipTimes[1]?.skipType

        setOpButton(
          opButtonText === "op" && currentTime > opStart && currentTime < opEnd
        )
        setEdButton(
          edButtonText === "ed" && currentTime > epStart && currentTime < epEnd
        )
      }

      if (autoSkip && skipTimes.length > 0) {
        const skipInterval = skipTimes.find(
          ({ interval }) =>
            currentTime >= interval.startTime && currentTime < interval.endTime
        )
        if (skipInterval) {
          player.current.currentTime = skipInterval.interval.endTime
        }
      }
    }
  }

  const handlePlaybackEnded = function () {
    player.current?.pause()

    if (latestEpisodeNumber === episodeNumber) return

    if (autoNext) {
      router.replace(
        `?id=${anilistId}&ep=${episodeNumber + 1}&provider=${provider}&type=${type}`
      )
    }
  }

  useEffect(() => {
    setCurrentTime(parseFloat(localStorage.getItem("currentTime") || "0"))
    // setDownload(data?.download)

    async function fetchProcessAndSkipTimes() {
      if (!malId) return

      try {
        const data = (await fetchSkipTimes({
          malId: malId.toString(),
          episodeNumber: `${episodeNumber}`,
        })) as AniSkip

        console.log(data)

        const filteredSkipTimes = data.results.filter(
          ({ skipType }) => skipType === "op" || skipType === "ed"
        )

        setSkipTimes(filteredSkipTimes)
      } catch (error) {
        console.log("error")
      }
    }

    // fetchAndSetAnimeSource()
    fetchProcessAndSkipTimes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodeId, malId])

  function onCanPlay() {
    if (skipTimes && skipTimes.length > 0) {
      const track = new TextTrack({
        kind: "chapters",
        default: true,
        label: "English",
        language: "en-US",
        type: "json",
      })

      let previousEndTime = 0

      const sortedSkipTimes = skipTimes.sort(
        (a, b) => a.interval.startTime - b.interval.startTime
      )

      skipTimes.forEach((skipTime, index) => {
        const { startTime, endTime } = skipTime.interval
        const skipType =
          skipTime.skipType.toUpperCase() === "OP" ? "Opening" : "Outro"

        if (previousEndTime < startTime) {
          track.addCue(
            new window.VTTCue(
              previousEndTime,
              startTime,
              `${animeVideoTitle} - Episode ${episodeNumber}\n\n`
            )
          )
        }

        track.addCue(
          new window.VTTCue(Number(startTime), Number(endTime), skipType)
        )

        previousEndTime = endTime

        if (index === sortedSkipTimes.length - 1 && endTime < totalDuration) {
          track.addCue(
            new window.VTTCue(
              endTime,
              totalDuration,
              `${animeVideoTitle} - Episode ${episodeNumber}\n\n`
            )
          )
        }
      })

      player?.current?.textTracks.add(track)
    }
  }

  const handlePlay = function () {
    setIsPlaying(true)
  }

  const handlePause = function () {
    setIsPlaying(false)
  }

  const handleEnd = function () {
    setIsPlaying(false)
  }

  return (
    <MediaPlayer
      key={videoUrl}
      className="font-geist-sans player relative"
      title={animeVideoTitle || animeResponse.title.english}
      src={`${env.NEXT_PUBLIC_PROXY_URI}?url=${videoUrl}`}
      onCanPlay={onCanPlay}
      autoplay={autoPlay}
      crossorigin="anonymous"
      playsinline
      onLoadedMetadata={onLoadedMetadata}
      onProviderChange={onProviderChange}
      onTimeUpdate={onTimeUpdate}
      ref={player}
      aspectRatio="16/9"
      load="eager"
      posterLoad="eager"
      streamType="on-demand"
      storage="storage-key"
      keyTarget="player"
      onPause={handlePause}
      onEnd={handleEnd}
      onPlay={handlePlay}
      onEnded={handlePlaybackEnded}
    >
      <MediaProvider>
        {banner ? (
          <Poster
            className="vds-poster absolute inset-0	h-full w-full translate-x-0 translate-y-0"
            src={`${env.NEXT_PUBLIC_PROXY_URI}?url=${posterImage}`}
            alt=""
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="absolute inset-0"></div>
        )}

        {subtitle && provider === "zoro" ? (
          <Track
            label="English"
            kind="captions"
            src={subtitle}
            default
            key={subtitle}
          />
        ) : null}
      </MediaProvider>
      {opButton && (
        <Button
          onClick={() =>
            Object.assign(player.current ?? {}, {
              currentTime: skipTimes[0]?.interval.endTime ?? 0,
            })
          }
          variant="secondary"
          className="absolute bottom-[70px] right-4 z-40 rounded-md px-3 py-2 text-sm sm:bottom-[83px]"
        >
          Skip Opening
        </Button>
      )}
      {otButton && (
        <Button
          variant="secondary"
          onClick={() =>
            Object.assign(player.current ?? {}, {
              currentTime: skipTimes[1]?.interval.endTime ?? 0,
            })
          }
          className="absolute bottom-[70px] right-4 z-40 rounded-[6px] px-3 py-2 text-sm sm:bottom-[83px]"
        >
          Skip Ending
        </Button>
      )}
      <DefaultVideoLayout
        thumbnails={thumbnail ?? ""}
        icons={defaultLayoutIcons}
      />
    </MediaPlayer>
  )
}
export default VidstackPlayer
