"use client"

import React, { useMemo, useEffect, useState, useCallback } from "react"
import { IAnilistInfo } from "types/types"
import VidstackPlayer from "./player"
import Episodes from "@/components/episode/episodes"
import { useRouter, useSearchParams } from "next/navigation"
import useEpisodes from "@/hooks/useEpisodes"
import Server from "@/components/server"
import ButtonAction from "@/components/button-action"
import { useWatchStore } from "@/store"
import RelationWatch from "@/components/watch/relation"
import Comments from "@/components/comments/comments"
import { env } from "@/env.mjs"
import type {
  SourcesResponse,
  AniSkip,
  AniSkipResult,
  IEpisode,
} from "types/types"
import { Badge } from "@/components/ui/badge"
import { LuMessageSquare } from "react-icons/lu"

type VideoPlayerProps = {
  animeId: string
  animeResponse: IAnilistInfo
  anilistId: string
  currentUser: any
  ep: string
}

const VideoPlayer = (props: VideoPlayerProps) => {
  const { animeId, animeResponse, anilistId, currentUser, ep } = props

  const searchParams = useSearchParams()
  const isDub = searchParams.get("dub")
  const episodeNumber = Number(ep)
  // const episodeId = useMemo(
  //   () => `${animeId}-${isDub ? "dub-" : ""}episode-${episodeNumber}`,
  //   [animeId, episodeNumber, isDub]
  // )
  const download = useWatchStore((store) => store.download)
  const [src, setSrc] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const setDownload = useWatchStore((store) => store.setDownload)
  const [vttGenerated, setVttGenerated] = useState<boolean>(false)
  const [textTracks, setTextTracks] = useState<ITracks[]>([])
  const [selectedBackgroundImage, setSelectedBackgroundImage] =
    useState<string>("")

  const [vttUrl, setVttUrl] = useState<string>("")
  const [error, setError] = useState(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [skipTimes, setSkipTimes] = useState<AniSkipResult[]>([])
  const [totalDuration, setTotalDuration] = useState<number>(0)

  const {
    data: episodes,
    isLoading: isPending,
    isError,
  } = useEpisodes(anilistId)

  const currentEpisode = useMemo(
    () => episodes?.find((episode) => episode.number === episodeNumber),
    [episodes, episodeNumber]
  )

  const latestEpisodeNumber = useMemo(
    () =>
      episodes?.length !== 0
        ? episodes?.length ??
          animeResponse.currentEpisode ??
          animeResponse.nextAiringEpisode.episode - 1
        : 1,
    [animeResponse, episodes]
  )

  useEffect(() => {
    const updateBackgroundImage = () => {
      const episodeImage = currentEpisode?.image
      const bannerImage = animeResponse?.cover || animeResponse?.image
      if (episodeImage && episodeImage !== animeResponse.image) {
        const img = new Image()
        img.onload = () => {
          if (img.width > 500) {
            setSelectedBackgroundImage(episodeImage)
          } else {
            setSelectedBackgroundImage(bannerImage)
          }
        }
        img.onerror = () => {
          setSelectedBackgroundImage(bannerImage)
        }
        img.src = episodeImage
      } else {
        setSelectedBackgroundImage(bannerImage)
      }
    }
    if (animeResponse && currentEpisode) {
      updateBackgroundImage()
    }
  }, [animeResponse, currentEpisode])

  async function fetchAndSetAnimeSource() {
    setIsLoading(true)
    setSrc("")
    setTextTracks([])
    try {
      if (currentEpisode) {
        const response = await fetch(
          `${env.NEXT_PUBLIC_ANIME_API_URL}/anime/gogoanime/watch/${currentEpisode.id}`
        )

        if (!response.ok) throw Error

        const data = (await response.json()) as SourcesResponse

        const backupSource = data.sources.find(
          (source) => source.quality === "default"
        )

        if (backupSource) {
          setSrc(
            `${env.NEXT_PUBLIC_PROXY_URI}=${encodeURIComponent(backupSource.url)}`
          )
          setDownload(data.download)
          setIsLoading(false)
        } else {
          console.error("Backup source not found")
        }
      }
    } catch (error) {
      console.error("Failed to fetch anime streaming links", error)
      const response = await fetch(
        `${env.NEXT_PUBLIC_PROXY_URI}=${env.NEXT_PUBLIC_ANIME_API_URL_V3}/anime/info/${anilistId}`
      )

      const data = await response.json()
      console.log(data)

      const { episodesList } = data.data

      const source = episodesList.find(
        (episode: {
          episodeId: number
          id: string
          number: number
          title: string
        }) => episode.number === episodeNumber
      )

      const fetchDataSources = await fetch(
        `${env.NEXT_PUBLIC_PROXY_URI}=${env.NEXT_PUBLIC_ANIME_API_URL_V2}/anime/episode-srcs?id=${source.id}`
      )

      const videoSource = await fetchDataSources.json()

      setSrc(videoSource.sources[0].url)
      setTextTracks(videoSource.tracks)
      setDownload("")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAndSetAnimeSource()
    fetchAndProcessSkipTimes()
    return () => {
      if (vttUrl) URL.revokeObjectURL(vttUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animeId, animeResponse, isDub, episodeNumber, currentEpisode])

  function generateWebVTTFromSkipTimes(
    skipTimes: AniSkip,
    totalDuration: number
  ): string {
    let vttString = "WEBVTT\n\n"
    let previousEndTime = 0

    const sortedSkipTimes = skipTimes.results.sort(
      (a, b) => a.interval.startTime - b.interval.startTime
    )

    sortedSkipTimes.forEach((skipTime, index) => {
      const { startTime, endTime } = skipTime.interval
      const skipType =
        skipTime.skipType.toUpperCase() === "OP" ? "Opening" : "Outro"

      if (previousEndTime < startTime) {
        vttString += `${formatTime(previousEndTime)} --> ${formatTime(startTime)}\n`
        vttString += `${animeResponse.title.english ?? animeResponse.title.romaji} / Episode ${episodeNumber}\n\n`
      }

      vttString += `${formatTime(startTime)} --> ${formatTime(endTime)}\n`
      vttString += `${skipType}\n\n`
      previousEndTime = endTime

      if (index === sortedSkipTimes.length - 1 && endTime < totalDuration) {
        vttString += `${formatTime(endTime)} --> ${formatTime(totalDuration)}\n`
        vttString += `${animeResponse.title.english ?? animeResponse.title.romaji} / Episode ${episodeNumber}\n\n`
      }
    })

    return vttString
  }

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  async function fetchAndProcessSkipTimes() {
    if (animeResponse.malId && currentEpisode?.id) {
      try {
        if (!animeResponse.malId) return

        if (currentEpisode) {
          const response = await fetch(
            `https://api.aniskip.com/v2/skip-times/${animeResponse.malId}/${currentEpisode.number}?types=op&types=recap&types=mixed-op&types=ed&types=mixed-ed&episodeLength`
          )

          if (!response.ok) return

          const data = (await response.json()) as AniSkip
          const filteredSkipTimes = data.results.filter(
            ({ skipType }) => skipType === "op" || skipType === "ed"
          )
          if (!vttGenerated) {
            const vttContent = generateWebVTTFromSkipTimes(
              { results: filteredSkipTimes },
              totalDuration
            )
            const blob = new Blob([vttContent], { type: "text/vtt" })
            const vttBlobUrl = URL.createObjectURL(blob)
            setVttUrl(vttBlobUrl)
            setSkipTimes(filteredSkipTimes)
            setVttGenerated(true)
          }
        }
      } catch (error) {
        console.error("Failed to fetch skip times", error)
      }
    }
  }

  console.log(currentEpisode)

  return (
    <>
      {isPending ? (
        <div className="flex animate-pulse">
          <div className="relative h-0 w-full rounded-md bg-primary/10 pt-[56%]"></div>
        </div>
      ) : !error ? (
        <VidstackPlayer
          animeId={animeId}
          animeResponse={animeResponse}
          episodeNumber={currentEpisode?.number!}
          currentEpisode={currentEpisode}
          latestEpisodeNumber={latestEpisodeNumber}
          anilistId={anilistId}
          src={src}
          banner={selectedBackgroundImage}
          vttUrl={vttUrl}
          setTotalDuration={setTotalDuration}
          skipTimes={skipTimes}
          currentTime={currentTime}
          textTracks={textTracks}
          title={`${animeResponse.title.english ?? animeResponse.title.romaji} / Episode ${episodeNumber}`}
        />
      ) : (
        <div>Please try again</div>
      )}

      <Server
        download={download ?? ""}
        animeResult={animeResponse}
        animeId={animeId}
        anilistId={anilistId}
        currentUser={currentUser}
        lastEpisode={currentEpisode?.number!}
      >
        <ButtonAction
          isLoading={isPending}
          latestEpisodeNumber={latestEpisodeNumber}
          anilistId={anilistId}
          lastEpisode={currentEpisode?.number!}
          animeTitle={animeId}
        />
      </Server>

      <Episodes
        slug={animeId}
        episodes={episodes}
        isLoading={isPending}
        animeId={anilistId}
        episodeNumber={currentEpisode?.number}
      />

      <RelationWatch relations={animeResponse.relations} />
      <div className="mt-4">
        <h3 className="flex w-full items-center pt-2.5 text-left text-sm font-semibold md:text-base">
          <div className="mr-2 h-6 w-2 rounded-md bg-primary md:h-8"></div>
          Comments
          <Badge className="ml-2">Beta</Badge>
        </h3>
        <div className="mt-2 w-full rounded-sm bg-destructive px-2 py-5 text-center text-sm md:text-base">
          Respect others. Be nice. No spam. No hate speech.
        </div>

        <div className="my-4 flex items-center gap-2 text-xs md:text-sm">
          <LuMessageSquare />

          <span>Comments EP {episodeNumber}</span>
        </div>
      </div>

      {!isPending && currentEpisode ? (
        <Comments
          anilistId={anilistId}
          animeId={animeId}
          episodeNumber={`${currentEpisode.number}`}
        />
      ) : (
        <></>
      )}

      {/* <Sharethis /> */}
    </>
  )
}

export default VideoPlayer
