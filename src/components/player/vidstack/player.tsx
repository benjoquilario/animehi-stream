"use client"

// https://github.com/Miruro-no-kuon/Miruro/blob/main/src/components/Watch/Video/Player.tsx
import "@vidstack/react/player/styles/default/theme.css"
import "@vidstack/react/player/styles/default/layouts/video.css"
import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  Poster,
  Track,
  type MediaProviderAdapter,
  type MediaProviderChangeEvent,
  type MediaPlayerInstance,
} from "@vidstack/react"
import type { IAnilistInfo, IEpisode, AniSkipResult } from "types/types"
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

type VidstackPlayerProps = {
  animeId: string
  episodeNumber: number
  animeResponse: IAnilistInfo
  episodeId: string
  currentEpisode?: IEpisode
  anilistId: string
  latestEpisodeNumber: number
  src: string
  vttUrl: string
  skipTimes: AniSkipResult[]
  currentTime: number
  setTotalDuration: (duration: number) => void
  textTracks: ITracks[]
}

const VidstackPlayer = (props: VidstackPlayerProps) => {
  const {
    animeId,
    episodeNumber,
    animeResponse,
    episodeId,
    currentEpisode,
    anilistId,
    latestEpisodeNumber,
    src,
    vttUrl,
    skipTimes,
    setTotalDuration,
    currentTime,
    textTracks,
  } = props
  const { data: session } = useSession()
  const router = useRouter()
  const player = useRef<MediaPlayerInstance>(null)
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

  useEffect(() => {
    player.current?.subscribe(({ currentTime, duration, poster }) => {
      if (skipTimes && skipTimes.length > 0) {
        const opStart = skipTimes[0]?.interval.startTime ?? 0
        const opEnd = skipTimes[0]?.interval.endTime ?? 0

        const epStart = skipTimes[1]?.interval.startTime ?? 0
        const epEnd = skipTimes[1]?.interval.endTime ?? 0

        const opButtonText = "Opening"
        const edButtonText = "Outro"

        setOpButton(
          opButtonText === "Opening" &&
            currentTime > opStart &&
            currentTime < opEnd
        )
        setEdButton(
          edButtonText === "Outro" &&
            currentTime > epStart &&
            currentTime < epEnd
        )

        if (autoSkip) {
          if (
            opButtonText === "Opening" &&
            currentTime > opStart &&
            currentTime < opEnd
          ) {
            Object.assign(player.current ?? {}, { currentTime: opEnd })
            return null
          }
          if (
            edButtonText === "Outro" &&
            currentTime > epStart &&
            currentTime < epEnd
          ) {
            Object.assign(player.current ?? {}, { currentTime: epEnd })
            return null
          }
        }
      }
    })
  }, [autoSkip, skipTimes])

  useEffect(() => {
    if (player.current && currentTime) {
      player.current.currentTime = currentTime
    }
  }, [currentTime])

  useEffect(() => {
    const updateViews = async function () {
      return await increment(animeId, latestEpisodeNumber)
    }

    updateViews()
  }, [animeId, latestEpisodeNumber])

  useEffect(() => {
    const createView = async function () {
      return await createViewCounter({
        animeId,
        title: animeResponse.title.english ?? animeResponse.title.romaji,
        image: animeResponse.image,
        latestEpisodeNumber,
        anilistId,
      })
    }

    createView()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anilistId, animeId])

  async function updateWatch() {
    return await updateWatchlist({
      episodeId: `${animeId}-episode-${episodeNumber}`,
      episodeNumber: `${episodeNumber}`,
      animeId,
      image: currentEpisode?.image ?? animeResponse.image,
    })
  }

  useEffect(() => {
    if (!session) return

    const createWatch = async function () {
      return await createWatchlist({
        animeId,
        episodeNumber: `${episodeNumber}`,
        title: animeResponse.title.english ?? animeResponse.title.romaji,
        image: currentEpisode?.image ?? animeResponse.image,
        anilistId,
      })
    }

    createWatch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, anilistId, animeId, currentEpisode])

  useEffect(() => {
    if (autoPlay && player.current) {
      player.current
        .play()
        .catch((e) => console.log("Playback failed to start automatically:", e))
    }
  }, [autoPlay, src])

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
    if (player.current) {
      const currentTime = player.current.currentTime
      const duration = player.current.duration || 1
      const playbackPercentage = (currentTime / duration) * 100
      const playbackInfo = {
        currentTime,
        playbackPercentage,
      }

      if (autoSkip && skipTimes.length) {
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

  function handlePlaybackEnded() {
    player.current?.pause()

    if (latestEpisodeNumber === episodeNumber) return

    router.replace(`?id=${anilistId}&slug=${animeId}&ep=${episodeNumber + 1}`)
  }

  return (
    <MediaPlayer
      key={src}
      className="player"
      title={`${animeResponse.title.english ?? animeResponse.title.romaji} / Episode ${episodeNumber}`}
      src={{
        src: src,
        type: "application/x-mpegurl",
      }}
      autoplay={autoPlay}
      crossorigin="anonymous"
      playsinline
      onLoadedMetadata={onLoadedMetadata}
      onProviderChange={onProviderChange}
      onDestroy={() => updateWatch()}
      onAbort={() => updateWatch()}
      onTimeUpdate={onTimeUpdate}
      ref={player}
      aspectRatio="16/9"
      load="eager"
      posterLoad="eager"
      streamType="on-demand"
      storage="storage-key"
      keyTarget="player"
      onEnded={handlePlaybackEnded}
    >
      <MediaProvider>
        <Poster
          className="vds-poster"
          src={`${env.NEXT_PUBLIC_PROXY_URI}=${currentEpisode?.image}`}
          alt=""
        />
        {textTracks &&
          textTracks.map((track) => (
            <Track
              label={track.label}
              kind={track.kind === "thumbnails" ? "chapters" : "captions"}
              src={track.file}
              default={track.default}
              key={track.file}
            />
          ))}
      </MediaProvider>
      {opButton && (
        <button
          onClick={() =>
            Object.assign(player.current ?? {}, {
              currentTime: skipTimes[0]?.interval.endTime ?? 0,
            })
          }
          className="absolute bottom-[70px] right-4 z-40 rounded-md bg-white px-3 py-2 text-sm  text-black sm:bottom-[83px]"
        >
          Skip Opening
        </button>
      )}
      {otButton && (
        <button
          onClick={() =>
            Object.assign(player.current ?? {}, {
              currentTime: skipTimes[1]?.interval.endTime ?? 0,
            })
          }
          className="absolute bottom-[70px] right-4 z-40 rounded-[6px] bg-white px-3 py-2 text-sm font-medium text-black sm:bottom-[83px]"
        >
          Skip Ending
        </button>
      )}
      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  )
}
export default VidstackPlayer
