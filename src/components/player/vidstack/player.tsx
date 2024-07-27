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
  Captions,
  TextTrack,
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
import { Button } from "@/components/ui/button"

type VidstackPlayerProps = {
  animeId: string
  episodeNumber: number
  animeResponse: IAnilistInfo
  currentEpisode?: IEpisode
  anilistId: string
  latestEpisodeNumber: number
  src: string
  vttUrl: string
  skipTimes: AniSkipResult[]
  currentTime: number
  setTotalDuration: (duration: number) => void
  textTracks: ITracks[]
  banner: string
  title: string
}

const VidstackPlayer = (props: VidstackPlayerProps) => {
  const {
    animeId,
    episodeNumber,
    animeResponse,
    currentEpisode,
    anilistId,
    latestEpisodeNumber,
    src,
    vttUrl,
    skipTimes,
    setTotalDuration,
    currentTime,
    textTracks,
    banner,
    title,
  } = props
  const { data: session } = useSession()
  const router = useRouter()
  const player = useRef<MediaPlayerInstance>(null)
  const animeVideoTitle = title
  const posterImage = banner

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
    if (currentEpisode && animeId) {
      return await updateWatchlist({
        episodeId: `${animeId}-episode-${episodeNumber}`,
        episodeNumber: `${episodeNumber}`,
        animeId,
        image: currentEpisode?.image ?? animeResponse.image,
      })
    }
  }

  useEffect(() => {
    if (!session) return

    if (animeId && currentEpisode) {
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
    }
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
    if (player.current && currentEpisode) {
      const currentTime = player.current.currentTime
      const duration = player.current.duration || 1
      const playbackPercentage = (currentTime / duration) * 100
      const playbackInfo = {
        currentTime,
        playbackPercentage,
      }

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

  const handlePlaybackEnded = function () {
    player.current?.pause()

    if (latestEpisodeNumber === episodeNumber) return

    if (autoNext) {
      router.replace(`?id=${anilistId}&slug=${animeId}&ep=${episodeNumber + 1}`)
    }
  }

  //console.log(opButton)

  return (
    <MediaPlayer
      key={src}
      className="font-geist-sans player relative"
      title={animeVideoTitle}
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
          src={`${env.NEXT_PUBLIC_PROXY_URI}=${posterImage}`}
          alt=""
          style={{ objectFit: "cover" }}
        />
        {textTracks.length > 0 &&
          textTracks.map((track) => (
            <Track
              label={track.label}
              kind={track.kind === "thumbnails" ? "chapters" : "captions"}
              src={track.file}
              default={track.default}
              key={track.file}
            />
          ))}
        {vttUrl && (
          <Track kind="chapters" src={vttUrl} default label="Skip Times" />
        )}
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
      <DefaultVideoLayout thumbnails={vttUrl} icons={defaultLayoutIcons} />
    </MediaPlayer>
  )
}
export default VidstackPlayer
