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
  useMediaRemote,
  useMediaStore,
  Spinner,
  type MediaProviderAdapter,
  type MediaProviderChangeEvent,
  type MediaPlayerInstance,
} from "@vidstack/react"
import type {
  IAnilistInfo,
  IEpisode,
  Source,
  SourcesResponse,
} from "types/types"
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
  fetchAnimeInfoFallback,
  fetchAnimeStreamingLinks,
  fetchSkipTimes,
  fetchAnimeStreamingLinksFallback,
} from "@/lib/cache"
import { useWatchStore } from "@/store"
import { AniSkipResult, AniSkip } from "types/types"
import useVideoSource from "@/hooks/useVideoSource"
import { AspectRatio } from "@/components/ui/aspect-ratio"

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
    banner,
  } = props
  const { data: session } = useSession()
  const router = useRouter()
  const player = useRef<MediaPlayerInstance>(null)
  const remote = useMediaRemote(player)
  // const { duration } = useMediaStore(player)
  const animeVideoTitle = title
  const posterImage = banner
  const [src, setSrc] = useState<string>("")
  const setDownload = useWatchStore((store) => store.setDownload)
  const [vttUrl, setVttUrl] = useState<string>("")
  const [skipTimes, setSkipTimes] = useState<AniSkipResult[]>([])
  const [vttGenerated, setVttGenerated] = useState<boolean>(false)
  const [totalDuration, setTotalDuration] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [textTracks, setTextTracks] = useState<ITracks[]>([])
  const [playerState, setPlayerState] = useState({
    currentTime: 0,
    isPlaying: false,
  })

  const { data, isError, isLoading } = useVideoSource(episodeId)

  const sources = useMemo(
    () => data?.sources.find((source: Source) => source.quality === "default"),
    [data]
  )

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
  let intervalId: any

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

        if (!session) {
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
  }, [session, isPlaying])

  useEffect(() => {
    if (player.current && currentTime) {
      player.current.currentTime = currentTime
    }
  }, [currentTime])

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
      router.replace(`?id=${anilistId}&ep=${episodeNumber + 1}`)
    }
  }

  useEffect(() => {
    setCurrentTime(parseFloat(localStorage.getItem("currentTime") || "0"))
    setDownload(data?.download)

    async function fetchAndProcessSkipTimes() {
      if (malId) {
        try {
          if (!malId) return

          const data = (await fetchSkipTimes({
            malId: malId.toString(),
            episodeNumber: `${episodeNumber}`,
          })) as AniSkip

          setSkipTimes(data.results)
        } catch (error) {
          console.error("Failed to fetch skip times", error)
        }
      }
    }

    // fetchAndSetAnimeSource()
    fetchAndProcessSkipTimes()
    return () => {
      setPlayerState({
        currentTime: 0,
        isPlaying: false,
      })
      if (vttUrl) URL.revokeObjectURL(vttUrl)
    }
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
      for (const cue of skipTimes) {
        track.addCue(
          new window.VTTCue(
            Number(cue.interval.startTime),
            Number(cue.interval.endTime),
            cue.skipType === "op" ? "Opening" : "Outro"
          )
        )
      }

      player?.current?.textTracks.add(track)
    }
  }

  useEffect(() => {
    const plyr = player.current

    return () => {
      if (plyr) {
        plyr.destroy()
      }
    }
  }, [episodeId])

  useEffect(() => {
    const plyr = player.current

    function handlePlay() {
      setIsPlaying(true)
    }

    function handlePause() {
      setIsPlaying(false)
    }

    function handleEnd() {
      setIsPlaying(false)
    }

    plyr?.addEventListener("play", handlePlay)
    plyr?.addEventListener("pause", handlePause)
    plyr?.addEventListener("ended", handleEnd)

    return () => {
      plyr?.removeEventListener("play", handlePlay)
      plyr?.removeEventListener("pause", handlePause)
      plyr?.removeEventListener("ended", handleEnd)
    }
  }, [episodeId])

  if (isLoading) {
    return (
      <AspectRatio ratio={16 / 9}>
        <div className="pointer-events-none absolute inset-0 z-50 flex h-full w-full items-center justify-center">
          <Spinner.Root
            className="animate-spin text-white opacity-100"
            size={84}
          >
            <Spinner.Track className="opacity-25" width={8} />
            <Spinner.TrackFill className="opacity-75" width={8} />
          </Spinner.Root>
        </div>
      </AspectRatio>
    )
  }

  return (
    <MediaPlayer
      key={sources.url}
      className="font-geist-sans player relative"
      title={animeVideoTitle}
      src={{
        src: sources.url,
        type: "application/vnd.apple.mpegurl",
      }}
      onCanPlay={onCanPlay}
      autoplay={autoPlay}
      crossorigin="anonymous"
      playsinline
      onLoadedMetadata={onLoadedMetadata}
      onProviderChange={onProviderChange}
      onTimeUpdate={onTimeUpdate}
      ref={player}
      aspectRatio="16/9"
      load="idle"
      posterLoad="idle"
      streamType="on-demand"
      storage="storage-key"
      keyTarget="player"
      onEnded={handlePlaybackEnded}
    >
      <MediaProvider>
        <Poster
          className="vds-poster absolute inset-0	h-full w-full translate-x-0 translate-y-0"
          src={`${env.NEXT_PUBLIC_PROXY_URI}?url=${posterImage}`}
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
